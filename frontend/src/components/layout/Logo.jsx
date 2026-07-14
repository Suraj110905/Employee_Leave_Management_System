/**
 * Logo component for the Employee Leave Management System.
 * Follows modern SaaS branding with Node.js Green (#118D4F) and responsive sizes.
 *
 * @component
 */
export default function Logo({ size = "md", showText = true, className = "" }) {
  // Configured sizes corresponding to sm (24px), md (36px), and lg (48px) requirements
  const sizeMap = {
    sm: {
      icon: "w-6 h-6",
      title: "text-[11px] font-bold leading-none tracking-tight",
      subtitle: "text-[9px] font-medium leading-none mt-0.5",
      gap: "gap-2",
    },
    md: {
      icon: "w-9 h-9",
      title: "text-sm font-bold leading-none tracking-tight",
      subtitle: "text-[10px] font-medium leading-none mt-1",
      gap: "gap-2.5",
    },
    lg: {
      icon: "w-12 h-12",
      title: "text-lg font-extrabold leading-none tracking-tight",
      subtitle: "text-xs font-semibold leading-none mt-1",
      gap: "gap-3",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`flex items-center ${currentSize.gap} ${className}`}
      role="img"
      aria-label="Employee Leave Management System Logo"
    >
      {/* Geometric leaf and grid calendar brand icon in pure SVG */}
      <svg
        className={`${currentSize.icon} shrink-0`}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Left leaf blade (Primary Node.js Green #118D4F) */}
        <path
          d="M16 4C16 4 6 12 6 20C6 25.5 10.5 28 16 28"
          fill="#118D4F"
        />
        {/* Right leaf blade (Secondary Light Green #68A063) */}
        <path
          d="M16 4C16 4 26 12 26 20C26 25.5 21.5 28 16 28"
          fill="#68A063"
          opacity="0.9"
        />
        {/* Central stem divider */}
        <path
          d="M16 7V28"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col select-none text-left">
          <span className={`${currentSize.title} text-sidebar-foreground`}>
            ELMS
          </span>
          <span className={`${currentSize.subtitle} text-sidebar-foreground/50`}>
            Leave Portal
          </span>
        </div>
      )}
    </div>
  );
}

