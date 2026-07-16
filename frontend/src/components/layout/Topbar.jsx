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
  Check,
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
  onMarkNotificationAsRead = () => {},
  onMarkAllNotificationsAsRead = () => {},
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
  const unreadCount = (notifications || []).length;

  /** Topbar avatar — unified primary green for all roles */
  const getAvatarBg = () => "bg-primary/15 text-primary border-primary/20";

  /** Notification badge — always primary green */
  const getBadgeColor = () => "bg-primary text-primary-foreground";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative cursor-pointer focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className={`absolute top-1.5 right-1.5 min-w-4 h-4 rounded-full text-[9px] font-extrabold flex items-center justify-center px-1 border border-card shadow-sm ${getBadgeColor()}`}>
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            sideOffset={8}
            className="w-80 sm:w-96 bg-popover border border-border text-popover-foreground rounded-xl p-1.5 shadow-md flex flex-col max-h-[400px] overflow-hidden"
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-bold text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllNotificationsAsRead}
                  className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="flex-1 overflow-y-auto space-y-1 py-1 max-h-[300px] pr-0.5 scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">☕</span>
                  <p className="text-xs font-semibold text-muted-foreground">All caught up!</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/40 transition-colors group relative"
                  >
                    <div className="flex-1 text-left space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{n.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-normal break-words">{n.message}</p>
                      <p className="text-[9px] text-muted-foreground/60 font-semibold">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button
                      onClick={() => onMarkNotificationAsRead(n.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all cursor-pointer absolute right-2 top-2"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

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
