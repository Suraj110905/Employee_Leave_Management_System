import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Login page — matches the ELMS UI design board login screen.
 * Features: role selector dropdown, email/ID field, password with eye toggle,
 * remember me, forgot password, sign in button, Google/Microsoft social row.
 */
export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /* Redirect if already authenticated */
  useEffect(() => {
    if (isAuthenticated && user) redirectUser(user.role);
  }, [isAuthenticated, user]);

  /* Auto-fill demo credentials when role is selected */
  useEffect(() => {
    if (role === ROLES.EMPLOYEE) {
      setEmail("employee@leaveportal.com");
      setPassword("password123");
    } else if (role === ROLES.MANAGER) {
      setEmail("manager@leaveportal.com");
      setPassword("password123");
    } else if (role === ROLES.HR_ADMIN) {
      setEmail("admin@leaveportal.com");
      setPassword("password123");
    } else {
      setEmail("");
      setPassword("");
    }
    setErrorMsg("");
  }, [role]);

  const redirectUser = (userRole) => {
    if (userRole === ROLES.HR_ADMIN) navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
    else if (userRole === ROLES.MANAGER) navigate(ROUTES.MANAGER.DASHBOARD, { replace: true });
    else navigate(ROUTES.EMPLOYEE.DASHBOARD, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    const emailTrimmed = email.trim();

    if (!emailTrimmed.includes("@")) {
      setErrorMsg("Please enter a valid email or employee ID.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const loggedUser = await login(emailTrimmed, password, rememberMe);
      redirectUser(loggedUser.role);
    } catch (err) {
      setErrorMsg(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full select-none">
      {/* Heading */}
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-foreground leading-tight">
          Sign in to your account
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5">
          Please enter your credentials to continue
        </p>
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div
          role="alert"
          className="flex items-center gap-2.5 px-4 py-3 mb-5 bg-destructive/8 border border-destructive/20 text-destructive text-xs rounded-xl font-medium"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Role Selector */}
        <div className="space-y-1.5">
          <label
            htmlFor="role-select"
            className="block text-xs font-semibold text-foreground"
          >
            Role
          </label>
          <div className="relative">
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-11 px-3 pr-9 rounded-xl border border-input bg-card text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 cursor-pointer appearance-none transition-colors hover:border-primary/50"
              aria-label="Select your role"
            >
              <option value="">Select your role</option>
              <option value={ROLES.EMPLOYEE}>Employee</option>
              <option value={ROLES.MANAGER}>Manager</option>
              <option value={ROLES.HR_ADMIN}>HR Admin</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Email / Employee ID */}
        <div className="space-y-1.5">
          <label
            htmlFor="email-input"
            className="block text-xs font-semibold text-foreground"
          >
            Email / Employee ID
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email-input"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email or employee ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 w-full rounded-xl border-input bg-card focus-visible:ring-ring/40 transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password-input"
              className="block text-xs font-semibold text-foreground"
            >
              Password
            </label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs font-semibold text-primary hover:underline underline-offset-2 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password-input"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-11 w-full rounded-xl border-input bg-card focus-visible:ring-ring/40 transition-colors"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-input accent-primary cursor-pointer"
          />
          <label
            htmlFor="remember-me"
            className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
          >
            Remember me
          </label>
        </div>

        {/* Sign In button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl font-semibold text-sm cursor-pointer flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-medium">
          or continue with
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Social sign-in (UI only — placeholder for OAuth) */}
      <div className="grid grid-cols-2 gap-3">
        <SocialButton
          label="Google"
          logo={
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          }
        />
        <SocialButton
          label="Microsoft"
          logo={
            <svg className="w-4 h-4" viewBox="0 0 23 23" aria-hidden="true">
              <rect x="1" y="1" width="10" height="10" fill="#F25022" />
              <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
              <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
              <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
            </svg>
          }
        />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a
          href="mailto:admin@leaveportal.com"
          className="font-semibold text-primary hover:underline underline-offset-2 transition-colors"
        >
          Contact Administrator
        </a>
      </p>
    </div>
  );
}

/**
 * Social sign-in button (Google / Microsoft).
 * @param {{ label: string, logo: React.ReactNode }} props
 */
function SocialButton({ label, logo }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2.5 h-11 rounded-xl border border-input bg-card hover:bg-accent text-sm font-medium text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      {logo}
      {label}
    </button>
  );
}
