import { Outlet } from "react-router-dom";
import {
  CalendarCheck2,
  Bell,
  ShieldCheck,
} from "lucide-react";

/**
 * Public layout for unauthenticated pages (Login, ForgotPassword).
 * Uses a two-column split design matching the ELMS UI design board:
 * — Left: Dark green branding panel with logo, tagline, and feature pills
 * — Right: White form area with centered content
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen flex font-sans antialiased bg-background">
      {/* ─── Left Branding Panel ───────────────────────────── */}
      <aside
        className="hidden lg:flex lg:w-[42%] xl:w-[38%] flex-col items-center justify-between p-10 relative overflow-hidden select-none"
        style={{
          background:
            "linear-gradient(155deg, #15803d 0%, #16a34a 40%, #166534 100%)",
        }}
      >
        {/* Decorative background circles */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: "rgba(255,255,255,0.15)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 translate-x-1/3 translate-y-1/3"
          style={{ background: "rgba(255,255,255,0.2)" }}
          aria-hidden="true"
        />

        {/* Top: Logo */}
        <div className="w-full flex items-center gap-3 z-10">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0 shadow-lg">
            <svg
              className="w-6 h-6"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M16 4C16 4 6 12 6 20C6 25.5 10.5 28 16 28" fill="white" />
              <path
                d="M16 4C16 4 26 12 26 20C26 25.5 21.5 28 16 28"
                fill="white"
                opacity="0.65"
              />
              <path
                d="M16 7V28"
                stroke="rgba(21,128,61,0.9)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-base leading-none tracking-tight">
              ELMS
            </p>
            <p className="text-white/60 text-[10px] font-medium leading-none mt-0.5">
              Employee Leave Management
            </p>
          </div>
        </div>

        {/* Middle: Tagline & Illustration */}
        <div className="z-10 text-center space-y-4 px-4">
          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
            Welcome Back!
          </h1>
          <p className="text-white/75 text-sm leading-relaxed max-w-xs mx-auto">
            Sign in to your account and continue managing leaves effortlessly.
          </p>

          {/* Illustration placeholder — calendar icon graphic */}
          <div className="flex items-center justify-center py-6">
            <div
              className="w-40 h-40 rounded-3xl flex items-center justify-center shadow-2xl"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <CalendarCheck2 className="w-20 h-20 text-white/80" strokeWidth={1.25} />
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 items-start max-w-xs mx-auto">
            <FeaturePill
              icon={<CalendarCheck2 className="w-4 h-4" />}
              label="Easy Leave Management"
            />
            <FeaturePill
              icon={<Bell className="w-4 h-4" />}
              label="Real-time Notifications"
            />
            <FeaturePill
              icon={<ShieldCheck className="w-4 h-4" />}
              label="Secure &amp; Reliable"
            />
          </div>
        </div>

        {/* Bottom: Version badge */}
        <p className="text-white/40 text-[10px] font-medium z-10">
          ELMS v1.0 &nbsp;·&nbsp; Web Responsive
        </p>
      </aside>

      {/* ─── Right Form Panel ──────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-background">
        {/* Mobile-only header */}
        <div className="lg:hidden mb-8 flex items-center gap-2 self-start">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#22c55e" }}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M16 4C16 4 6 12 6 20C6 25.5 10.5 28 16 28" fill="white" />
              <path d="M16 4C16 4 26 12 26 20C26 25.5 21.5 28 16 28" fill="white" opacity="0.65" />
              <path d="M16 7V28" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-foreground text-lg">ELMS</span>
        </div>

        {/* The actual page content (Login / ForgotPassword) */}
        <div className="w-full max-w-md">
          <Outlet />
        </div>

        <p className="mt-8 text-[11px] text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} ELMS · Employee Leave Management System.&nbsp;
          <a href="#" className="hover:text-primary transition-colors underline-offset-2 hover:underline">
            Privacy Policy
          </a>
        </p>
      </main>
    </div>
  );
}

/**
 * Small feature pill shown in the branding panel.
 * @param {{ icon: React.ReactNode, label: string }} props
 */
function FeaturePill({ icon, label }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl w-full"
      style={{ background: "rgba(255,255,255,0.12)" }}>
      <span className="text-white/80 shrink-0">{icon}</span>
      <span className="text-white/90 text-xs font-semibold">{label}</span>
    </div>
  );
}
