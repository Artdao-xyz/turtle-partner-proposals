'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { ANIMATION_TIMINGS, getTextOpacityDelay } from '../config/animationTimings';
import { useScrollThreshold } from '../hooks/useScrollThreshold';

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
const DESKTOP_TEXT_OFFSET = 20; // Reduced from 40
const DESKTOP_PERPENDICULAR_OFFSET = 50; // Increased from 40

// Layout constants - Mobile (vertical)
const MOBILE_ORBIT_RADIUS = 80;
const MOBILE_HERO_SIZE = 100;
const MOBILE_IMAGE_SIZE = 28;
const MOBILE_TEXT_OFFSET = 10; // Reduced from 20
const MOBILE_PERPENDICULAR_OFFSET = 22; // Increased from 18

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
  // State based on scroll position - starts "unauthenticated" (large, no text)
  const isScrolled = useScrollThreshold(15);
  const isScrolledRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Update ref when state changes (for draw function access)
  useEffect(() => {
    isScrolledRef.current = isScrolled;
  }, [isScrolled]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const heroImageRef = useRef<HTMLImageElement | null>(null);
  const lastSizeRef = useRef({ width: 0, height: 0 });
  const rafIdRef = useRef<number | null>(null);
  // Mobile: texts start hidden and fade in on load; Desktop: texts start hidden
  const getInitialTextOpacities = () => {
    // Always start at 0, will animate in based on mobile/desktop logic
    return new Array(IMAGE_DATA.length).fill(0);
  };
  const textOpacityRefs = useRef<number[]>(getInitialTextOpacities());
  const [textOpacities, setTextOpacities] = useState<number[]>(getInitialTextOpacities());
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const imagesLoadedOpacityRef = useRef(0); // Opacity for fade in when images load
  const [imagesLoadedOpacity, setImagesLoadedOpacity] = useState(0); // State for triggering re-renders
  const grayscaleRef = useRef(0); // Always in color (no grayscale)
  const [grayscale, setGrayscale] = useState(0);
  const glowColorProgressRef = useRef(1); // Always with glow
  const [glowColorProgress, setGlowColorProgress] = useState(1);
  // Initialize scale factor based on screen size (mobile vs desktop)
  // Mobile: starts larger like desktop, Desktop: initial is larger
  const getInitialScaleFactor = () => {
    if (typeof window === 'undefined') return 1.5; // 135% - larger but smaller than before
    return 1.35; // Both mobile and desktop start at 135%
  };
  const scaleFactorRef = useRef(getInitialScaleFactor());
  const [scaleFactor, setScaleFactor] = useState(getInitialScaleFactor());
  // Mobile: always centered (0), Desktop: composition 30% outside bottom when not scrolled
  // Offset represents how much of composition is outside bottom (0.0 = centered, negative = above center)
  const getInitialVerticalOffset = () => {
    if (typeof window === 'undefined') return -0.03;
    return window.innerWidth < 1024 ? 0 : -0.03; // Mobile: 0% (centered), Desktop: 3% above center
  };
  const verticalOffsetRef = useRef(getInitialVerticalOffset());
  const [verticalOffset, setVerticalOffset] = useState(getInitialVerticalOffset());
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
    // Size is 20% larger than base (0.80 * 1.2 = 0.96)
    const finalScaleFactor = baseScaleFactor * authScaleFactor * 0.94;
    
    // Use appropriate sizes based on layout and scale proportionally
    const ORBIT_RADIUS = (isVertical ? MOBILE_ORBIT_RADIUS : DESKTOP_ORBIT_RADIUS) * finalScaleFactor;
    const HERO_SIZE = (isVertical ? MOBILE_HERO_SIZE : DESKTOP_HERO_SIZE) * finalScaleFactor;
    const IMAGE_SIZE = (isVertical ? MOBILE_IMAGE_SIZE : DESKTOP_IMAGE_SIZE) * finalScaleFactor;
    const TEXT_OFFSET = (isVertical ? MOBILE_TEXT_OFFSET : DESKTOP_TEXT_OFFSET) * finalScaleFactor;
    const PERPENDICULAR_OFFSET = (isVertical ? MOBILE_PERPENDICULAR_OFFSET : DESKTOP_PERPENDICULAR_OFFSET) * finalScaleFactor;

    const centerX = width / 2;
    // Calculate vertical position so that when not scrolled, 30% of composition is outside bottom
    // When scrolled, composition is centered
    // Mobile: always centered
    // Offset is adjusted based on scale factor to maintain relative position
    const isMobile = width < 1024;
    let centerY: number;
    if (isMobile) {
      // Mobile: always centered
      centerY = height / 2;
    } else {
      // Desktop: calculate offset so composition is 3% above center when not scrolled
      // The composition height is approximately ORBIT_RADIUS * 2 + some padding
      // Adjust offset based on scale factor to maintain relative position when composition size changes
      const compositionHeight = ORBIT_RADIUS * 2 + HERO_SIZE; // Approximate total height
      // Normalize offset by scale factor: when scale is larger, reduce offset to maintain same visual position
      const scaleNormalizedOffset = verticalOffsetRef.current / authScaleFactor; // Adjust for scale
      const offsetAmount = compositionHeight * -0.03 * scaleNormalizedOffset; // -3% (above center) when offset=-1, 0% when offset=0
      centerY = height / 2 + offsetAmount;
    }

    // Check if all images are loaded before drawing orbit
    const heroImg = heroImageRef.current;
    const allImagesLoaded = heroImg?.complete && heroImg.naturalWidth > 0 && 
                            imagesRef.current.length === IMAGE_DATA.length &&
                            imagesRef.current.every(img => img?.complete && img.naturalWidth > 0);

    // Draw orbit circle only after images are loaded, with fade in
    if (allImagesLoaded && imagesLoadedOpacityRef.current > 0) {
      ctx.save();
      ctx.globalAlpha = imagesLoadedOpacityRef.current;
      ctx.strokeStyle = ORBIT_STROKE_COLOR;
      ctx.lineWidth = 2 * Math.min(finalScaleFactor, 1.5); // Scale line width but cap at 1.5x to avoid too thick lines
      ctx.beginPath();
      ctx.arc(centerX, centerY, ORBIT_RADIUS, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Draw hero image with glow effect, with fade in
    if (heroImg?.complete && heroImg.naturalWidth > 0 && imagesLoadedOpacityRef.current > 0) {
      const heroX = centerX - HERO_SIZE / 2;
      const heroY = centerY - HERO_SIZE / 2;

      ctx.save();
      
      // Interpolate glow color between disabled (gray) and enabled (green) based on authentication
      const progress = glowColorProgressRef.current;
      // Interpolate RGB values: gray (128, 128, 128) to green (115, 243, 108)
      const r = Math.round(128 + (115 - 128) * progress);
      const g = Math.round(128 + (243 - 128) * progress);
      const b = Math.round(128 + (108 - 128) * progress);
      // Interpolate opacity: 0.3 to 0.75, also affected by fade in
      const baseOpacity = 0.3 + (0.75 - 0.3) * progress;
      const finalOpacity = baseOpacity * imagesLoadedOpacityRef.current;
      const glowColor = `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
      
      // Apply blur and glow effect (blur is always applied, opacity controls visibility)
      ctx.shadowBlur = GLOW_BLUR * finalScaleFactor;
      ctx.shadowColor = glowColor;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Apply global alpha for fade in
      ctx.globalAlpha = imagesLoadedOpacityRef.current;

      // Apply grayscale filter manually (Safari compatible)
      applyGrayscale(ctx, heroImg, heroX, heroY, HERO_SIZE, HERO_SIZE, grayscaleRef.current, dpr);

      ctx.restore();
    }

    // Draw icons and text, with fade in
    if (imagesRef.current.length === IMAGE_DATA.length && imagesLoadedOpacityRef.current > 0) {
      const angleStep = (Math.PI * 2) / IMAGE_DATA.length;
      const textRadius = ORBIT_RADIUS + IMAGE_SIZE / 2 + TEXT_OFFSET;

      IMAGE_DATA.forEach((item, index) => {
        const img = imagesRef.current[index];
        if (!img?.complete || img.naturalWidth === 0) return;

        const angle = index * angleStep - Math.PI / 2;
        const iconX = centerX + Math.cos(angle) * ORBIT_RADIUS - IMAGE_SIZE / 2;
        const iconY = centerY + Math.sin(angle) * ORBIT_RADIUS - IMAGE_SIZE / 2;

        // Draw icon with grayscale filter (Safari compatible), with fade in
        ctx.save();
        ctx.globalAlpha = imagesLoadedOpacityRef.current;
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
        // When scrolled, text is at 50% opacity; otherwise at 70%
        const textOpacity = isScrolledRef.current ? 0.5 : 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${textOpacity})`;
        // Mobile: 8px font size when visible, Desktop: 14px scaled
        const baseFontSize = isVertical ? 8 : 14;
        const fontSize = baseFontSize * finalScaleFactor;
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
        
        // Animate fade in for images and orbit
        const startTime = performance.now();
        const FADE_DURATION = 600; // 0.6 seconds
        
        const animateFadeIn = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / FADE_DURATION, 1);
          
          // Easing function (ease-in-out)
          const eased = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          
          imagesLoadedOpacityRef.current = eased;
          setImagesLoadedOpacity(eased); // Update state to trigger re-render
          draw();
          
          if (progress < 1) {
            requestAnimationFrame(animateFadeIn);
          } else {
            imagesLoadedOpacityRef.current = 1;
            setImagesLoadedOpacity(1);
            draw();
          }
        };
        
        // Force a redraw after all images are loaded
        // Use double RAF to ensure DOM is ready and canvas is properly sized
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(animateFadeIn);
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

  // Mobile texts no longer fade in automatically - they appear on scroll

  // Animate text opacity and grayscale based on scroll state (both mobile and desktop)
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    // Cancel any ongoing animation
    if (fadeAnimationRef.current !== null) {
      cancelAnimationFrame(fadeAnimationRef.current);
    }

    // Always in color (no grayscale) and always with glow
    const targetGrayscale = 0;
    const targetGlowColorProgress = 1; // Always with glow
    // Scale factor: Both mobile and desktop start larger, grow when scrolled
    // Scrolled state: Mobile 1.1, Desktop 1.4 (larger than initial)
    // Initial state: Both 135%
    const finalScaleFactor = isMobile ? 1.2 : 1.4;
    const targetScaleFactor = isScrolled 
      ? finalScaleFactor // Grow when scrolled
      : 1.5; // Start larger (both mobile and desktop)
    // Offset represents vertical position (0.0 = centered, negative = above center)
    // Desktop: 3% above center when not scrolled, centered when scrolled
    // Mobile: always centered (0)
    const targetVerticalOffset = isMobile 
      ? 0 // Mobile: always centered
      : (isScrolled ? 0 : -1.0); // Desktop: centered when scrolled, 3% above center when not scrolled
    // Text opacities: Both mobile and desktop start hidden, appear when scrolled
    const targetTextOpacities = isScrolled 
      ? new Array(IMAGE_DATA.length).fill(1) // Show text when scrolled
      : new Array(IMAGE_DATA.length).fill(0); // Hide text initially
    
    const startGrayscale = grayscaleRef.current;
    const startGlowColorProgress = glowColorProgressRef.current;
    const startScaleFactor = scaleFactorRef.current;
    const startVerticalOffset = verticalOffsetRef.current;
    const startTextOpacities = [...textOpacityRefs.current];
    const startTime = performance.now();

    // All animations use the same duration: 300ms (0.3s) - very fast and slick
    const ANIMATION_DURATION = 300; // milliseconds
    const imageColorDelay = 0; // No delay, all animations start together
    const imageColorDuration = ANIMATION_DURATION;
    const textDuration = ANIMATION_DURATION;

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

      // Animate each text opacity with cascade effect (individual delays)
      const newTextOpacities = textOpacityRefs.current.map((startOpacity, index) => {
        // Both mobile and desktop: cascade delays when scrolled, no delay when hiding
        const textDelay = isScrolled 
          ? (isMobile ? 0 : toMs(getTextOpacityDelay(index))) // Mobile: no delay, Desktop: cascade delays
          : 0; // No delay when hiding
        
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
          const textDelay = isScrolled 
            ? (isMobile ? 0 : toMs(getTextOpacityDelay(index))) // Mobile: no delay, Desktop: cascade delays
            : 0; // No delay when hiding
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
  }, [isScrolled, draw]);

  return <canvas ref={canvasRef} className="w-full h-full relative" />;
}