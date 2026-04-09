"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useCalendarContext } from "@/context/CalendarContext";
import { getThemePalette } from "@/utils/themes";

/**
 * Month-specific hero images mapped by month index (0-11).
 * Uses high-quality Unsplash photos via their static CDN.
 *
 * `url`    — full-res version for the hero card (optimized via next/image)
 * `bgUrl`  — tiny 100px version for the blurred page background (loads instantly)
 */
export const MONTH_IMAGES: Record<number, { url: string; bgUrl: string; alt: string }> = {
  0: {
    url: "https://images.unsplash.com/photo-1457269449834-928af64c684d?w=800&h=500&fit=crop",
    bgUrl: "https://images.unsplash.com/photo-1457269449834-928af64c684d?w=100&h=60&fit=crop&q=30",
    alt: "Snowy winter landscape — January",
  },
  1: {
    url: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=500&fit=crop",
    bgUrl: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=100&h=60&fit=crop&q=30",
    alt: "Pink roses — February",
  },
  2: {
    url: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=500&fit=crop",
    bgUrl: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=100&h=60&fit=crop&q=30",
    alt: "Spring tulips in bloom — March",
  },
  3: {
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop",
    bgUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100&h=60&fit=crop&q=30",
    alt: "Mountain meadow in spring — April",
  },
  4: {
    url: "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=800&h=500&fit=crop",
    bgUrl: "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=100&h=60&fit=crop&q=30",
    alt: "Sunny green meadow — May",
  },
  5: {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
    bgUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=60&fit=crop&q=30",
    alt: "Tropical beach — June",
  },
  6: {
    url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&h=500&fit=crop",
    bgUrl: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=100&h=60&fit=crop&q=30",
    alt: "Golden sunset over ocean — July",
  },
  7: {
    url: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&h=500&fit=crop",
    bgUrl: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=100&h=60&fit=crop&q=30",
    alt: "Lush tropical forest — August",
  },
  8: {
    url: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800&h=500&fit=crop",
    bgUrl: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=100&h=60&fit=crop&q=30",
    alt: "Autumn leaves in golden light — September",
  },
  9: {
    url: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=800&h=500&fit=crop",
    bgUrl: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=100&h=60&fit=crop&q=30",
    alt: "Fall foliage — October",
  },
  10: {
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=500&fit=crop",
    bgUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=100&h=60&fit=crop&q=30",
    alt: "Misty autumn forest — November",
  },
  11: {
    url: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&h=500&fit=crop",
    bgUrl: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=100&h=60&fit=crop&q=30",
    alt: "Festive winter scene — December",
  },
};

/**
 * Hero image with skeleton fallback during load / on error,
 * and a smooth page-flip animation when navigating months.
 *
 * Uses next/image for automatic WebP conversion, responsive srcset,
 * and Vercel edge caching — dramatically faster than raw <img>.
 */
export default function HeroImage() {
  const { state } = useCalendarContext();
  const monthIndex = state.currentMonth.getMonth();
  const palette = getThemePalette(state.theme, monthIndex);
  const image = MONTH_IMAGES[monthIndex];

  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // Reset load state when month changes
  const handleKey = format(state.currentMonth, "yyyy-MM");

  const onLoad = useCallback(() => setLoaded(true), []);
  const onError = useCallback(() => {
    setErrored(true);
    setLoaded(true); // stop the skeleton
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg" style={{ perspective: "1200px" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={handleKey}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: "top center" }}
          onAnimationStart={() => {
            setLoaded(false);
            setErrored(false);
          }}
        >
          <div className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-lg overflow-hidden">
            {/* Skeleton / gradient fallback — visible while loading or on error */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: loaded && !errored ? 0 : 1,
                background: `linear-gradient(135deg, ${palette.primaryLight} 0%, ${palette.accent} 40%, ${palette.primary}30 100%)`,
              }}
            >
              {/* Animated shimmer */}
              <div className="absolute inset-0 skeleton-shimmer" />
              {errored && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm font-medium opacity-60" style={{ color: palette.text }}>
                    {image.alt}
                  </p>
                </div>
              )}
            </div>

            {/* Actual image — uses next/image for optimization */}
            {!errored && (
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                quality={75}
                className="object-cover transition-opacity duration-500"
                style={{ opacity: loaded ? 1 : 0 }}
                onLoad={onLoad}
                onError={onError}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Subtle inset shadow frame */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none
                    shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)]
                    border border-black/10"
      />
    </div>
  );
}
