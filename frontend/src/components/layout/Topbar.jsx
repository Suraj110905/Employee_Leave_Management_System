import {
  Menu,
  Bell,
  Search,
  Sun,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Enterprise-grade SaaS Topbar component.
 * Integrates search input, notifications, theme toggles, and unified user dropdown context.
 *
 * @component
 */
export default function Topbar({
  title = "Dashboard",
  subtitle = "",
  user = null,
  notifications = [],
  onToggleSidebar = () => {},
  onLogout = () => {},
}) {
  const {
    name = "User",
    email = "user@leaveportal.com",
    role = "employee",
    avatar = "",
  } = user || {};

  // Resolve user initials for Avatar fallback
  const getInitials = (nameString) => {
    if (!nameString || nameString === "User") return "U";
    const parts = nameString.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nameString.charAt(0).toUpperCase();
  };

  const userInitial = getInitials(name);
  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  const getAvatarBg = () => {
    const roleLower = role?.toLowerCase();
    if (roleLower === "admin" || roleLower === "hr_admin") {
      return "bg-teal-100 text-teal-800 border-teal-200";
    }
    if (roleLower === "manager") {
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    }
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  };

  const getBadgeColor = () => {
    const roleLower = role?.toLowerCase();
    if (roleLower === "admin" || roleLower === "hr_admin") {
      return "bg-teal-500 text-white";
    }
    if (roleLower === "manager") {
      return "bg-indigo-500 text-white";
    }
    return "bg-emerald-500 text-white";
  };

  return (
    <header className="bg-card/90 backdrop-blur-md border-b border-border h-16 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-xs select-none">
      {/* Left Section: Mobile toggle and title details */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col text-left min-w-0">
          <h1 className="text-sm font-semibold text-foreground leading-none truncate">
            {title}
          </h1>
          {(subtitle || role) && (
            <span className="text-[10px] text-muted-foreground font-medium mt-1 leading-none capitalize truncate">
              {subtitle || role.replace("_", " ")}
            </span>
          )}
        </div>
      </div>

      {/* Center Section: Responsive search input */}
      <div className="hidden sm:flex items-center relative max-w-xs w-full mx-4">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search requests, records..."
          className="pl-9 h-9 w-full bg-accent/40 border-border rounded-xl focus:bg-accent/80 transition-colors"
        />
      </div>

      {/* Right Section: Alerts and account details */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notification bell with count badge */}
        <button
          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className={`absolute top-1.5 right-1.5 min-w-4 h-4 rounded-full text-[9px] font-extrabold flex items-center justify-center px-1 border border-card shadow-sm ${getBadgeColor()}`}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Theme Toggle (UI only) */}
        <button
          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          aria-label="Toggle interface theme"
        >
          <Sun className="w-5 h-5" />
        </button>

        <div className="h-8 w-px bg-border mx-1"></div>

        {/* Profile Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-accent transition-colors cursor-pointer focus:outline-none select-none group">
              <Avatar className="h-8 w-8 border border-border shrink-0">
                {avatar && <AvatarImage src={avatar} alt={name} />}
                <AvatarFallback className={`font-bold text-xs ${getAvatarBg()}`}>
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:block text-xs font-semibold text-foreground truncate max-w-[120px]">
                {name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors hidden lg:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="end"
            sideOffset={8}
            className="w-56 bg-popover border border-border text-popover-foreground rounded-xl p-1.5 shadow-md"
          >
            <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground font-normal">
              Logged in as
              <p className="font-semibold text-foreground truncate mt-0.5">{email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent focus:bg-accent cursor-pointer text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent focus:bg-accent cursor-pointer text-sm">
              <Settings className="w-4 h-4 text-muted-foreground" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent focus:bg-accent cursor-pointer text-sm">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
              Help
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="flex items-center gap-2 px-2 py-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
