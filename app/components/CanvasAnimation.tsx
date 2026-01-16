'use client';

import { useRef, useEffect, useCallback } from 'react';

// Constants
const IMAGE_DATA = [
  { path: '/media/hero-image/icons/1_Discovery.svg', text: 'Discovery & Due Diligence' },
  { path: '/media/hero-image/icons/2_Organisation.svg', text: 'Organisation Onboarding' },
  { path: '/media/hero-image/icons/3_Incentive.svg', text: 'Incentive Structuring' },
  { path: '/media/hero-image/icons/4_Launch.svg', text: 'Launch' },
  { path: '/media/hero-image/icons/5_Additional.svg', text: 'Additional Distribution' },
  { path: '/media/hero-image/icons/6_PostListing.svg', text: 'Post Listing Management' },
] as const;

const HERO_IMAGE_PATH = '/media/hero-image/hero-image.svg';
const ORBIT_RADIUS = 175;
const HERO_SIZE = 200;
const IMAGE_SIZE = 56;
const TEXT_OFFSET = 40;
const PERPENDICULAR_OFFSET = 60;
const SIZE_THRESHOLD = 2;
const ORBIT_STROKE_COLOR = 'rgba(255, 255, 255, 0.3)';
const GLOW_COLOR = 'rgba(115, 243, 108, 0.75)';
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

export default function CanvasAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const heroImageRef = useRef<HTMLImageElement | null>(null);
  const lastSizeRef = useRef({ width: 0, height: 0 });
  const rafIdRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    if (width === 0 || height === 0) return;

    // Skip if size hasn't changed significantly
    const { width: lastWidth, height: lastHeight } = lastSizeRef.current;
    if (
      Math.abs(width - lastWidth) < SIZE_THRESHOLD &&
      Math.abs(height - lastHeight) < SIZE_THRESHOLD
    ) {
      return;
    }

    lastSizeRef.current = { width, height };

    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
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

      ctx.shadowBlur = GLOW_BLUR;
      ctx.shadowColor = GLOW_COLOR;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.drawImage(heroImg, heroX, heroY, HERO_SIZE, HERO_SIZE);

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
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

        // Draw icon
        ctx.drawImage(img, iconX, iconY, IMAGE_SIZE, IMAGE_SIZE);

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

        ctx.fillText(item.text, textX, textY);
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
        draw();
      } catch (error) {
        // Continue even if some images fail to load
        console.error('Error loading images:', error);
        draw();
      }
    };

    loadAllImages();

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

  return <canvas ref={canvasRef} className="w-full h-full relative" />;
}