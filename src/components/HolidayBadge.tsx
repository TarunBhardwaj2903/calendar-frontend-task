"use client";

import { useState } from "react";

interface HolidayBadgeProps {
  name: string;
  primaryColor: string;
}

/**
 * Small colored dot rendered on holiday dates.
 * Shows a tooltip with the holiday name on hover/focus.
 */
export default function HolidayBadge({ name, primaryColor }: HolidayBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative flex justify-center">
      <button
        className="w-1.5 h-1.5 rounded-full cursor-help"
        style={{ backgroundColor: primaryColor }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label={`Holiday: ${name}`}
      />

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute bottom-full mb-2 px-2 py-1 text-xs font-sans
                     rounded shadow-lg whitespace-nowrap z-50 pointer-events-none"
          style={{
            backgroundColor: primaryColor,
            color: "#FFFFFF",
          }}
        >
          {name}
          {/* Tooltip arrow */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2
                       w-0 h-0 border-l-4 border-r-4 border-t-4
                       border-l-transparent border-r-transparent"
            style={{ borderTopColor: primaryColor }}
          />
        </div>
      )}
    </div>
  );
}
