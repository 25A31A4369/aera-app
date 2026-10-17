import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

interface AeraLogoProps extends SVGProps<SVGSVGElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "icon-only" | "badge";
}

const SIZE_MAP = {
  sm: 24,
  md: 36,
  lg: 48,
  xl: 64,
};

/**
 * AERA Official Vector Logo
 * Symbolizes outdoor relief: an overarching shade canopy leaf protecting a refreshing water droplet.
 * Colors: Forest Green (#28563B) and Warm Cream (#F7F4EC).
 */
export function AeraLogo({
  size = "md",
  variant = "icon-only",
  className,
  ...props
}: AeraLogoProps) {
  const pixelSize = SIZE_MAP[size];

  const svgContent = (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="AERA Logo"
      role="img"
      {...props}
    >
      {/* Background soft circle if badge variant */}
      {variant === "badge" && (
        <rect width="48" height="48" rx="14" fill="#F7F4EC" stroke="#E2DDD1" strokeWidth="1.5" />
      )}

      {/* Overarching Shade Canopy / Protective Leaf */}
      <path
        d="M9 36C9 23.8497 18.8497 10 33 10C37.5 10 39.5 12 39 16C37 32 23 37 9 36Z"
        fill="#28563B"
      />

      {/* Secondary Soft Leaf Accent / Sun Shield */}
      <path d="M13 36C18 24 28 17 38 15C36 28 25 35 13 36Z" fill="#3F7553" opacity="0.85" />

      {/* Relief Water Droplet Sheltered Underneath */}
      <path
        d="M27 38C30.866 38 34 34.866 34 31C34 26.5 27 21 27 21C27 21 20 26.5 20 31C20 34.866 23.134 38 27 38Z"
        fill="#F7F4EC"
      />
      <circle cx="27" cy="32" r="2.5" fill="#28563B" />
    </svg>
  );

  return svgContent;
}

/**
 * Brand Lockup Component: Logo + Wordmark
 */
export function AeraBrandLockup({
  size = "md",
  showTagline = false,
  className,
}: {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <AeraLogo size={size} variant="badge" />
      <div>
        <span
          className={cn(
            "font-display font-black tracking-tight text-primary block leading-none",
            size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-3xl",
          )}
        >
          AERA
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium text-foreground/80 block mt-0.5">
            Find Shade. Find Relief.
          </span>
        )}
      </div>
    </div>
  );
}
