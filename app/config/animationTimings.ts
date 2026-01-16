/**
 * Animation timing configuration for authenticated and unauthenticated state transitions
 * All delays are in seconds and follow a cascade effect
 */

export const ANIMATION_TIMINGS = {
  // Unauthenticated state - all elements appear simultaneously
  unauthenticated: {
    header: {
      delay: 0,
      duration: 0.6,
    },
    authForm: {
      delay: 0,
      duration: 0.6,
    },
    canvas: {
      delay: 0,
      duration: 0.6,
    },
  },
  
  // Authenticated state - cascade effect
  authenticated: {
    // Title appears first
    title: {
      delay: 0,
      duration: 0.6,
    },
    
    // Color of images and glow appears after title
    imageColorAndGlow: {
      delay: 0.3, // Starts after title begins
      duration: 0.6,
    },
    
    // Text opacity appears in sequence (text 1, then 2, then 3, etc.)
    textOpacity: {
      baseDelay: 0.6, // Starts after image color/glow begins
      staggerDelay: 0.15, // Delay between each text item
      duration: 0.6,
      totalItems: 6, // Number of text items in the canvas
    },
    
    // Hero description appears last
    heroDescription: {
      delay: 1.2, // Starts after all text items have begun animating
      duration: 0.6,
    },
  },
} as const;

/**
 * Get the delay for a specific text item index (authenticated state)
 * @param index - Zero-based index of the text item (0-5)
 * @returns Delay in seconds
 */
export function getTextOpacityDelay(index: number): number {
  return ANIMATION_TIMINGS.authenticated.textOpacity.baseDelay + 
         (index * ANIMATION_TIMINGS.authenticated.textOpacity.staggerDelay);
}

/**
 * Easing function for smooth animations
 */
export const EASING = [0.25, 0.1, 0.25, 1] as const;
