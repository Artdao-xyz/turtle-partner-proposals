'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ANIMATION_TIMINGS, getTextOpacityDelay } from '../config/animationTimings';

// Constants
const IMAGE_DATA = [
  { path: '/media/hero-image/icons/1_Discovery.svg', text: 'Discovery & Due Diligence' },
  { path: '/media/hero-image/icons/2_Organisation.svg', text: 'Organisation Onboarding' },
  { path: '/media/hero-image/icons/3_Incentive.svg', text: 'Incentive Structuring' },
  { path: '/media/hero-image/icons/4_Launch.svg', text: 'Launch' },
  { path: '/media/hero-image/icons/5_Additional.svg', text: 'Additional Distribution' },
  { path: '/media/hero-image/icons/6_PostListing.svg', text: 'Post Listing Management' },
] as const;

const HERO_IMAGE_PATH = '/media/hero-image/hero-image.png';
const ORBIT_RADIUS = 175;
const HERO_SIZE = 200;
const IMAGE_SIZE = 56;
const TEXT_OFFSET = 40;
const PERPENDICULAR_OFFSET = 60;
const SIZE_THRESHOLD = 2;
const ORBIT_STROKE_COLOR = 'rgba(255, 255, 255, 0.3)';
const GLOW_COLOR = 'rgba(115, 243, 108, 0.75)';
const GLOW_COLOR_DISABLED = 'rgba(128, 128, 128, 0.3)'; // Gray glow when not authenticated
const GLOW_BLUR = 50;

// Helper function to load an image
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      reject(new Error(`Failed to load image: ${src}`));
    };
    img.src = src;
  });
};

const FADE_DURATION = 600; // Duration in milliseconds

// Convert seconds to milliseconds
const toMs = (seconds: number) => seconds * 1000;

// Helper function to apply grayscale filter manually (Safari compatible)
const applyGrayscale = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  grayscalePercent: number
): void => {
  if (grayscalePercent === 0) {
    // No grayscale needed, draw directly
    ctx.drawImage(image, x, y, width, height);
    return;
  }

  // Create a temporary canvas to apply grayscale
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) {
    ctx.drawImage(image, x, y, width, height);
    return;
  }

  // Draw image to temporary canvas
  tempCtx.drawImage(image, 0, 0, width, height);
  
  // Get image data
  const imageData = tempCtx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Apply grayscale formula: 0.299*R + 0.587*G + 0.114*B
  const grayscaleFactor = grayscalePercent / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate grayscale value
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Interpolate between original color and grayscale
    data[i] = r + (gray - r) * grayscaleFactor;     // R
    data[i + 1] = g + (gray - g) * grayscaleFactor;   // G
    data[i + 2] = b + (gray - b) * grayscaleFactor;   // B
    // Alpha channel (data[i + 3]) remains unchanged
  }
  
  // Put modified image data back
  tempCtx.putImageData(imageData, 0, 0);
  
  // Draw the processed image to the main canvas
  ctx.drawImage(tempCanvas, x, y);
};

export default function CanvasAnimation() {
  const { isAuthenticated } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const heroImageRef = useRef<HTMLImageElement | null>(null);
  const lastSizeRef = useRef({ width: 0, height: 0 });
  const rafIdRef = useRef<number | null>(null);
  const textOpacityRefs = useRef<number[]>(new Array(IMAGE_DATA.length).fill(0));
  const [textOpacities, setTextOpacities] = useState<number[]>(new Array(IMAGE_DATA.length).fill(0));
  const grayscaleRef = useRef(100);
  const [grayscale, setGrayscale] = useState(100);
  const glowColorProgressRef = useRef(0);
  const [glowColorProgress, setGlowColorProgress] = useState(0);
  const fadeAnimationRef = useRef<number | null>(null);

  // Draw function - always draws everything
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    if (width === 0 || height === 0) return;

    const dpr = window.devicePixelRatio || 1;

    // Always set canvas size (it's safe to do so)
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw orbit circle
    ctx.strokeStyle = ORBIT_STROKE_COLOR;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, ORBIT_RADIUS, 0, Math.PI * 2);
    ctx.stroke();

    // Draw hero image with glow effect
    const heroImg = heroImageRef.current;
    if (heroImg?.complete && heroImg.naturalWidth > 0) {
      const heroX = centerX - HERO_SIZE / 2;
      const heroY = centerY - HERO_SIZE / 2;

      ctx.save();
      
      // Interpolate glow color between disabled (gray) and enabled (green) based on authentication
      const progress = glowColorProgressRef.current;
      // Interpolate RGB values: gray (128, 128, 128) to green (115, 243, 108)
      const r = Math.round(128 + (115 - 128) * progress);
      const g = Math.round(128 + (243 - 128) * progress);
      const b = Math.round(128 + (108 - 128) * progress);
      // Interpolate opacity: 0.3 to 0.75
      const opacity = 0.3 + (0.75 - 0.3) * progress;
      const glowColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      
      ctx.shadowBlur = GLOW_BLUR;
      ctx.shadowColor = glowColor;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Apply grayscale filter manually (Safari compatible)
      applyGrayscale(ctx, heroImg, heroX, heroY, HERO_SIZE, HERO_SIZE, grayscaleRef.current);

      ctx.restore();
    }

    // Draw icons and text
    if (imagesRef.current.length === IMAGE_DATA.length) {
      const angleStep = (Math.PI * 2) / IMAGE_DATA.length;
      const textRadius = ORBIT_RADIUS + IMAGE_SIZE / 2 + TEXT_OFFSET;

      IMAGE_DATA.forEach((item, index) => {
        const img = imagesRef.current[index];
        if (!img?.complete || img.naturalWidth === 0) return;

        const angle = index * angleStep - Math.PI / 2;
        const iconX = centerX + Math.cos(angle) * ORBIT_RADIUS - IMAGE_SIZE / 2;
        const iconY = centerY + Math.sin(angle) * ORBIT_RADIUS - IMAGE_SIZE / 2;

        // Draw icon with grayscale filter (Safari compatible)
        ctx.save();
        applyGrayscale(ctx, img, iconX, iconY, IMAGE_SIZE, IMAGE_SIZE, grayscaleRef.current);
        ctx.restore();

        // Calculate text position
        const iconCenterY = centerY + Math.sin(angle) * ORBIT_RADIUS;
        const textX = centerX + Math.cos(angle) * textRadius;
        let textYOffset = 0;

        if (index === 0) {
          textYOffset = -PERPENDICULAR_OFFSET;
        } else if (index === 3) {
          textYOffset = PERPENDICULAR_OFFSET;
        }

        const textY = iconCenterY + textYOffset;

        // Set text style
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.textBaseline = 'middle';

        // Set text alignment based on position
        if (index === 0 || index === 3) {
          ctx.textAlign = 'center';
        } else if (index === 1 || index === 2) {
          ctx.textAlign = 'left';
        } else {
          ctx.textAlign = 'right';
        }

        // Apply opacity to text based on authentication state and index
        ctx.save();
        ctx.globalAlpha = textOpacityRefs.current[index];
        ctx.fillText(item.text, textX, textY);
        ctx.restore();
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load all images
    const loadAllImages = async () => {
      try {
        const [heroImg, ...iconImages] = await Promise.all([
          loadImage(HERO_IMAGE_PATH),
          ...IMAGE_DATA.map((item) => loadImage(item.path)),
        ]);

        heroImageRef.current = heroImg;
        imagesRef.current = iconImages;
        
        // Force a redraw after all images are loaded
        // Use double RAF to ensure DOM is ready and canvas is properly sized
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            draw();
            // Also trigger one more draw after a tiny delay to catch any edge cases
            setTimeout(() => {
              draw();
            }, 50);
          });
        });
      } catch (error) {
        // Continue even if some images fail to load
        console.error('Error loading images:', error);
        // Still try to draw with what we have
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            draw();
          });
        });
      }
    };

    loadAllImages();

    // Also draw immediately to show the orbit circle while images load
    draw();

    // Handle resize with requestAnimationFrame for performance
    const handleResize = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [draw]);

  // Animate text opacity and grayscale based on authentication state
  useEffect(() => {
    // Cancel any ongoing animation
    if (fadeAnimationRef.current !== null) {
      cancelAnimationFrame(fadeAnimationRef.current);
    }

    const targetGrayscale = isAuthenticated ? 0 : 100;
    const targetGlowColorProgress = isAuthenticated ? 1 : 0;
    const targetTextOpacities = isAuthenticated 
      ? new Array(IMAGE_DATA.length).fill(1)
      : new Array(IMAGE_DATA.length).fill(0);
    
    const startGrayscale = grayscaleRef.current;
    const startGlowColorProgress = glowColorProgressRef.current;
    const startTextOpacities = [...textOpacityRefs.current];
    const startTime = performance.now();

    // Calculate delays in milliseconds based on authentication state
    const imageColorDelay = isAuthenticated 
      ? toMs(ANIMATION_TIMINGS.authenticated.imageColorAndGlow.delay)
      : toMs(ANIMATION_TIMINGS.unauthenticated.canvas.delay);
    const imageColorDuration = isAuthenticated
      ? toMs(ANIMATION_TIMINGS.authenticated.imageColorAndGlow.duration)
      : toMs(ANIMATION_TIMINGS.unauthenticated.canvas.duration);
    const textDuration = isAuthenticated
      ? toMs(ANIMATION_TIMINGS.authenticated.textOpacity.duration)
      : toMs(ANIMATION_TIMINGS.unauthenticated.canvas.duration);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      
      // Animate grayscale and glow color (with delay)
      let grayscaleProgress = 0;
      let glowProgress = 0;
      
      if (elapsed >= imageColorDelay) {
        const imageElapsed = elapsed - imageColorDelay;
        grayscaleProgress = Math.min(imageElapsed / imageColorDuration, 1);
        glowProgress = grayscaleProgress;
        
        // Easing function for smooth fade (ease-in-out)
        const eased = grayscaleProgress < 0.5
          ? 2 * grayscaleProgress * grayscaleProgress
          : 1 - Math.pow(-2 * grayscaleProgress + 2, 2) / 2;
        
        grayscaleProgress = eased;
        glowProgress = eased;
      }
      
      const currentGrayscale = startGrayscale + (targetGrayscale - startGrayscale) * grayscaleProgress;
      const currentGlowColorProgress = startGlowColorProgress + (targetGlowColorProgress - startGlowColorProgress) * glowProgress;
      
      grayscaleRef.current = currentGrayscale;
      glowColorProgressRef.current = currentGlowColorProgress;
      setGrayscale(currentGrayscale);
      setGlowColorProgress(currentGlowColorProgress);

      // Animate each text opacity with its own delay
      const newTextOpacities = textOpacityRefs.current.map((startOpacity, index) => {
        // When not authenticated, all texts appear at the same time
        const textDelay = isAuthenticated 
          ? toMs(getTextOpacityDelay(index))
          : toMs(ANIMATION_TIMINGS.unauthenticated.canvas.delay);
        
        if (elapsed < textDelay) {
          return startOpacity;
        }
        
        const textElapsed = elapsed - textDelay;
        const textProgress = Math.min(textElapsed / textDuration, 1);
        
        // Easing function for smooth fade (ease-in-out)
        const eased = textProgress < 0.5
          ? 2 * textProgress * textProgress
          : 1 - Math.pow(-2 * textProgress + 2, 2) / 2;
        
        return startOpacity + (targetTextOpacities[index] - startOpacity) * eased;
      });
      
      textOpacityRefs.current = newTextOpacities;
      setTextOpacities([...newTextOpacities]);

      // Redraw canvas with new values
      draw();

      // Check if all animations are complete
      const allComplete = 
        grayscaleProgress >= 1 &&
        glowProgress >= 1 &&
        newTextOpacities.every((opacity, index) => {
          const textDelay = isAuthenticated
            ? toMs(getTextOpacityDelay(index))
            : toMs(ANIMATION_TIMINGS.unauthenticated.canvas.delay);
          return elapsed >= textDelay + textDuration;
        });

      if (!allComplete) {
        fadeAnimationRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure final values
        grayscaleRef.current = targetGrayscale;
        glowColorProgressRef.current = targetGlowColorProgress;
        textOpacityRefs.current = targetTextOpacities;
        setGrayscale(targetGrayscale);
        setGlowColorProgress(targetGlowColorProgress);
        setTextOpacities([...targetTextOpacities]);
        fadeAnimationRef.current = null;
        draw(); // Final draw to ensure correct values
      }
    };

    fadeAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (fadeAnimationRef.current !== null) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
    };
  }, [isAuthenticated, draw]);

  return <canvas ref={canvasRef} className="w-full h-full relative" />;
}