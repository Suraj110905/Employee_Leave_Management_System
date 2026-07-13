/**
 * Reusable layout Footer component.
 * Uses semantic HTML, responsive spacing, and tailwind theme variables.
 *
 * @component
 */
export default function Footer() {
  return (
    <footer className="w-full py-4 px-4 sm:px-6 lg:px-8 border-t border-border bg-card/30 text-xs text-muted-foreground select-none font-sans shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        {/* Branding, copyright, and version tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-1 sm:gap-2">
          <span>
            &copy; {new Date().getFullYear()} Employee Leave Management System. All rights reserved.
          </span>
          <span className="hidden sm:inline text-border" aria-hidden="true">|</span>
          <span className="font-semibold text-foreground/70">v1.0.0</span>
        </div>

        {/* Dynamic policy links */}
        <div className="flex items-center justify-center gap-4">
          <a
            href="#privacy"
            className="hover:text-foreground hover:underline transition-colors focus-visible:ring-1 focus-visible:ring-ring outline-none rounded px-1"
          >
            Privacy Policy
          </a>
          <span className="text-border" aria-hidden="true">/</span>
          <a
            href="#terms"
            className="hover:text-foreground hover:underline transition-colors focus-visible:ring-1 focus-visible:ring-ring outline-none rounded px-1"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
