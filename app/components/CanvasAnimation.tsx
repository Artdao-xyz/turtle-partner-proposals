'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { ANIMATION_TIMINGS, getTextOpacityDelay } from '../config/animationTimings';

// Constants
const IMAGE_DATA = [
  { path: '/media/hero-image/icons/1_Discovery.png', text: 'Discovery & Due Diligence' },
  { path: '/media/hero-image/icons/2_Organisation.png', text: 'Organisation Onboarding' },
  { path: '/media/hero-image/icons/3_Incentive.png', text: 'Incentive Structuring' },
  { path: '/media/hero-image/icons/4_Launch.png', text: 'Launch' },
  { path: '/media/hero-image/icons/5_Additional.png', text: 'Additional Distribution' },
  { path: '/media/hero-image/icons/6_PostListing.png', text: 'Post Listing Management' },
] as const;

const HERO_IMAGE_PATH = '/media/hero-image/hero-image.png';

// Layout constants - Desktop (horizontal)
const DESKTOP_ORBIT_RADIUS = 175;
const DESKTOP_HERO_SIZE = 200;
const DESKTOP_IMAGE_SIZE = 56;
const DESKTOP_TEXT_OFFSET = 40;
const DESKTOP_PERPENDICULAR_OFFSET = 60;

// Layout constants - Mobile (vertical)
const MOBILE_ORBIT_RADIUS = 80;
const MOBILE_HERO_SIZE = 100;
const MOBILE_IMAGE_SIZE = 28;
const MOBILE_TEXT_OFFSET = 20;
const MOBILE_PERPENDICULAR_OFFSET = 25;

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
  grayscalePercent: number,
  dpr: number = 1
): void => {
  if (grayscalePercent === 0) {
    // No grayscale needed, draw directly
    ctx.drawImage(image, x, y, width, height);
    return;
  }

  // Create a temporary canvas to apply grayscale with DPR support
  const tempCanvas = document.createElement('canvas');
  // Set actual size accounting for DPR
  tempCanvas.width = width * dpr;
  tempCanvas.height = height * dpr;
  
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) {
    ctx.drawImage(image, x, y, width, height);
    return;
  }

  // Draw image to temporary canvas at full resolution
  tempCtx.drawImage(image, 0, 0, width * dpr, height * dpr);
  
  // Get image data at full resolution
  const imageData = tempCtx.getImageData(0, 0, width * dpr, height * dpr);
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
  ctx.drawImage(tempCanvas, x, y, width, height);
};

export default function CanvasAnimation() {
  // Always in authenticated state (no grayscale, with glow, etc.) but with on-load animations
  const isAuthenticated = true;
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
  // Initialize scale factor based on screen size (mobile vs desktop)
  const getInitialScaleFactor = () => {
    if (typeof window === 'undefined') return 1.12;
    return window.innerWidth < 1024 ? 1.35 : 1.12; // Mobile: 135%, Desktop: 112%
  };
  const scaleFactorRef = useRef(getInitialScaleFactor());
  const [scaleFactor, setScaleFactor] = useState(getInitialScaleFactor());
  const verticalOffsetRef = useRef(-20); // Start higher when not authenticated (negative = up)
  const [verticalOffset, setVerticalOffset] = useState(-30);
  const fadeAnimationRef = useRef<number | null>(null);
  const devicePixelRatioRef = useRef<number>(1);

  // Draw function - always draws everything
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    // Get the DPR and size of the container (more reliable than canvas.getBoundingClientRect)
    const dpr = window.devicePixelRatio || 1;
    // Use container's bounding rect for accurate size, fallback to offsetWidth/Height
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width || container.offsetWidth;
    const height = containerRect.height || container.offsetHeight;

    if (width === 0 || height === 0) return;

    // Set the actual size of the canvas's drawing buffer
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Set the drawn size of the canvas using CSS (keeps it the same visual size)
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale the context to ensure all drawing operations use the new, larger resolution
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Store DPR for reference
    devicePixelRatioRef.current = dpr;

    // Detect layout: vertical (mobile) if width < 1024px (lg breakpoint), horizontal (desktop) otherwise
    const isVertical = width < 1024;
    
    // Calculate base scale factor based on canvas dimensions
    // Mobile: scale relative to width
    // Desktop: scale relative to height
    // Base reference: 1100px width / 550px height for desktop, 350px width / 400px height for mobile
    const baseWidth = isVertical ? 350 : 1100;
    const baseHeight = isVertical ? 400 : 550;
    const widthScale = width / baseWidth;
    const heightScale = height / baseHeight;
    // Mobile: use width scale, Desktop: use height scale
    const baseScaleFactor = Math.max(0.5, Math.min(2, isVertical ? widthScale : heightScale)); // Clamp between 0.5x and 2x
    
    // Apply authentication scale factor (larger when not authenticated)
    const authScaleFactor = scaleFactorRef.current;
    const finalScaleFactor = baseScaleFactor * authScaleFactor;
    
    // Use appropriate sizes based on layout and scale proportionally
    const ORBIT_RADIUS = (isVertical ? MOBILE_ORBIT_RADIUS : DESKTOP_ORBIT_RADIUS) * finalScaleFactor;
    const HERO_SIZE = (isVertical ? MOBILE_HERO_SIZE : DESKTOP_HERO_SIZE) * finalScaleFactor;
    const IMAGE_SIZE = (isVertical ? MOBILE_IMAGE_SIZE : DESKTOP_IMAGE_SIZE) * finalScaleFactor;
    const TEXT_OFFSET = (isVertical ? MOBILE_TEXT_OFFSET : DESKTOP_TEXT_OFFSET) * finalScaleFactor;
    const PERPENDICULAR_OFFSET = (isVertical ? MOBILE_PERPENDICULAR_OFFSET : DESKTOP_PERPENDICULAR_OFFSET) * finalScaleFactor;

    const centerX = width / 2;
    const centerY = height / 2 + verticalOffsetRef.current; // Apply vertical offset

    // Draw orbit circle
    ctx.strokeStyle = ORBIT_STROKE_COLOR;
    ctx.lineWidth = 2 * Math.min(finalScaleFactor, 1.5); // Scale line width but cap at 1.5x to avoid too thick lines
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
      
      ctx.shadowBlur = GLOW_BLUR * finalScaleFactor;
      ctx.shadowColor = glowColor;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Apply grayscale filter manually (Safari compatible)
      applyGrayscale(ctx, heroImg, heroX, heroY, HERO_SIZE, HERO_SIZE, grayscaleRef.current, dpr);

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
        applyGrayscale(ctx, img, iconX, iconY, IMAGE_SIZE, IMAGE_SIZE, grayscaleRef.current, dpr);
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

        // Set text style (scaled proportionally)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // White at 70% opacity
        const fontSize = 14 * finalScaleFactor;
        ctx.font = `${fontSize}px sans-serif`;
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
        
        // Split long texts (indices 1, 2, 4, 5) into multiple lines - only on mobile
        const needsLineBreak = isVertical && (index === 1 || index === 2 || index === 4 || index === 5);
        if (needsLineBreak) {
          // Split text at spaces and draw on multiple lines
          const words = item.text.split(' ');
          const midPoint = Math.ceil(words.length / 2);
          const line1 = words.slice(0, midPoint).join(' ');
          const line2 = words.slice(midPoint).join(' ');
          const lineHeight = 18 * finalScaleFactor; // Spacing between lines (scaled proportionally)
          
          ctx.fillText(line1, textX, textY - lineHeight / 2);
          ctx.fillText(line2, textX, textY + lineHeight / 2);
        } else {
          ctx.fillText(item.text, textX, textY);
        }
        
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
    // Use double RAF to ensure layout has fully updated
    const handleResize = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      // Double RAF ensures the container has resized before we read its size
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = requestAnimationFrame(draw);
      });
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

    // Detect if mobile (same breakpoint as canvas: 1024px)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

    const targetGrayscale = isAuthenticated ? 0 : 100;
    const targetGlowColorProgress = isAuthenticated ? 1 : 0;
    // Different scale factors for mobile vs desktop when not authenticated
    const targetScaleFactor = isAuthenticated 
      ? 0.9 
      : (isMobile ? 1.35 : 1.12); // Mobile: 135% when not authenticated, Desktop: 112%
    const targetVerticalOffset = isAuthenticated ? 0 : -30; // Centered when authenticated, higher when not (negative = up)
    const targetTextOpacities = isAuthenticated 
      ? new Array(IMAGE_DATA.length).fill(1)
      : new Array(IMAGE_DATA.length).fill(0);
    
    const startGrayscale = grayscaleRef.current;
    const startGlowColorProgress = glowColorProgressRef.current;
    const startScaleFactor = scaleFactorRef.current;
    const startVerticalOffset = verticalOffsetRef.current;
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
      const currentScaleFactor = startScaleFactor + (targetScaleFactor - startScaleFactor) * glowProgress;
      const currentVerticalOffset = startVerticalOffset + (targetVerticalOffset - startVerticalOffset) * glowProgress;
      
      grayscaleRef.current = currentGrayscale;
      glowColorProgressRef.current = currentGlowColorProgress;
      scaleFactorRef.current = currentScaleFactor;
      verticalOffsetRef.current = currentVerticalOffset;
      setGrayscale(currentGrayscale);
      setGlowColorProgress(currentGlowColorProgress);
      setScaleFactor(currentScaleFactor);
      setVerticalOffset(currentVerticalOffset);

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
        scaleFactorRef.current = targetScaleFactor;
        verticalOffsetRef.current = targetVerticalOffset;
        textOpacityRefs.current = targetTextOpacities;
        setGrayscale(targetGrayscale);
        setGlowColorProgress(targetGlowColorProgress);
        setScaleFactor(targetScaleFactor);
        setVerticalOffset(targetVerticalOffset);
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