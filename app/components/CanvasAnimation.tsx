'use client';

import { useRef, useEffect } from 'react';

export default function CanvasAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const heroImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Image paths with their corresponding texts (in order 1-6)
    const imageData = [
      { path: '/media/hero-image/icons/1_Discovery.svg', text: 'Discovery & Due Dilligence' },
      { path: '/media/hero-image/icons/2_Organisation.svg', text: 'Organisation Onboarding' },
      { path: '/media/hero-image/icons/3_Incentive.svg', text: 'Incentive Structuring' },
      { path: '/media/hero-image/icons/4_Launch.svg', text: 'Launch' },
      { path: '/media/hero-image/icons/5_Additional.svg', text: 'Additional Distribution' },
      { path: '/media/hero-image/icons/6_PostListing.svg', text: 'Post Listing Management' },
    ];

    // Load images
    let loadedCount = 0;
    const totalImages = imageData.length + 1; // +1 for hero image

    const loadImages = () => {
      // Load hero image
      const heroImg = new Image();
      heroImg.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          draw(); // Redraw when all images are loaded
        }
      };
      heroImg.onerror = () => {
        console.error('Failed to load hero image');
        loadedCount++;
        if (loadedCount === totalImages) {
          draw(); // Redraw even if hero image failed
        }
      };
      heroImg.src = '/media/hero-image/hero-image.svg';
      heroImageRef.current = heroImg;

      // Load icon images
      imageData.forEach((item) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            draw(); // Redraw when all images are loaded
          }
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${item.path}`);
          loadedCount++;
          if (loadedCount === totalImages) {
            draw(); // Redraw even if some images failed
          }
        };
        img.src = item.path;
        imagesRef.current.push(img);
      });
    };

    // Function to draw everything
    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Fill with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Center of canvas
      const centerX = width / 2;
      const centerY = height / 2;

      // Orbit radius (fixed 350px diameter = 175px radius)
      const orbitRadius = 175;

      // Draw orbit (circle)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw hero image in the center (fixed 200px size) with glow/shadow effect
      if (heroImageRef.current && heroImageRef.current.complete && heroImageRef.current.naturalWidth > 0) {
        const heroSize = 200;
        const heroX = centerX - heroSize / 2;
        const heroY = centerY - heroSize / 2;
        
        // Apply glow/shadow effect
        ctx.shadowBlur = 50;
        ctx.shadowColor = 'rgba(115, 243, 108, 0.75)'; // Bright lime green glow
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.drawImage(heroImageRef.current, heroX, heroY, heroSize, heroSize);
        
        // Reset shadow properties
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
      }

      // Draw images in circle (starting from top, like clock hands at 12)
      const images = imagesRef.current.filter(img => img.complete && img.naturalWidth > 0);
      
      if (images.length > 0) {
        const imageSize = 56; // Size of each image
        const angleStep = (Math.PI * 2) / images.length;
        const textOffset = 40; // Offset to push text further away from icon (perpendicular to center)
        const textRadius = orbitRadius + imageSize / 2 + textOffset; // Text radius (outside the orbit)

        images.forEach((img, index) => {
          // Start from top (subtract Math.PI/2 to rotate 90 degrees counterclockwise)
          const angle = index * angleStep - Math.PI / 2;
          
          const x = centerX + Math.cos(angle) * orbitRadius - imageSize / 2;
          const y = centerY + Math.sin(angle) * orbitRadius - imageSize / 2;

          // Draw image
          ctx.drawImage(img, x, y, imageSize, imageSize);

          // Icon center position (same Y as text should align to)
          const iconCenterY = centerY + Math.sin(angle) * orbitRadius;
          
          // Draw text outside the circle (further from center)
          const textX = centerX + Math.cos(angle) * textRadius;
          
          // Apply perpendicular offset for images 1 (top) and 4 (bottom)
          const perpendicularOffset = 80; // Offset perpendicular to center
          let textYOffset = 0;
          if (index === 0) {
            // Image 1 (top): offset upward (negative Y)
            textYOffset = -perpendicularOffset;
          } else if (index === 3) {
            // Image 4 (bottom): offset downward (positive Y)
            textYOffset = perpendicularOffset;
          }
          
          ctx.fillStyle = '#ffffff';
          ctx.font = '14px sans-serif';
          // Dynamic text alignment: 1&4=center, 2&3=left, 5&6=right
          if (index === 0 || index === 3) {
            ctx.textAlign = 'center';
          } else if (index === 1 || index === 2) {
            ctx.textAlign = 'left';
          } else {
            ctx.textAlign = 'right';
          }
          ctx.textBaseline = 'middle';
          
          // Draw text in a single line (no line breaks)
          const text = imageData[index].text;
          const textY = iconCenterY + textYOffset;
          
          // Draw text
          ctx.fillText(text, textX, textY);
        });
      }
    };

    // Initial draw (black background and orbit)
    draw();

    // Load images
    loadImages();

    // Resize on window resize
    window.addEventListener('resize', draw);
    
    return () => {
      window.removeEventListener('resize', draw);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-screen fixed top-0 left-0 -z-10"
    />
  );
}