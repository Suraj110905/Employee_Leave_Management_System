import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

/**
 * Employee Dashboard Welcome Banner.
 * Matches the ELMS design board: clean heading with first name + wave emoji,
 * subtitle text, and a "+ Apply Leave" action button on the right.
 *
 * @component
 */
export default function WelcomeBanner({ user = null }) {
  const firstName = (user?.name || "User").split(" ")[0];

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left: greeting */}
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
          {getGreeting()}, {firstName}! 👋
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your leaves today.
        </p>
      </div>

      {/* Right: CTA button */}
      <Button
        asChild
        size="sm"
        className="shrink-0 gap-2 rounded-xl font-semibold cursor-pointer"
      >
        <Link to={ROUTES.EMPLOYEE.APPLY}>
          <Plus className="w-4 h-4" />
          Apply Leave
        </Link>
      </Button>
    </div>
  );
}
