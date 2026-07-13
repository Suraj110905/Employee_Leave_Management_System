import { MoreVertical, LogOut, User, Settings } from "lucide-react";
import Logo from "./Logo";
import NavItem from "./NavItem";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Responsive MobileSidebar component using shadcn/ui Sheet.
 * Integrates navigation matching desktop sidebar and includes user dropdown context.
 */
export default function MobileSidebar({
  isOpen = false,
  onClose = () => {},
  items = [],
  role = "",
  user = null,
  onLogout = () => {},
}) {
  // Extract user properties with fallbacks
  const {
    name = "User",
    email = "user@leaveportal.com",
    role: userRole = "employee",
    avatar = "",
  } = user || {};

  // Resolve user initials for Avatar fallback
  const getInitials = (nameString) => {
    if (!nameString) return "U";
    const parts = nameString.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nameString.charAt(0).toUpperCase();
  };

  const userInitial = getInitials(name);
  const activeRole = role || userRole;

  const getAvatarBg = () => {
    const roleLower = activeRole?.toLowerCase();
    if (roleLower === "admin" || roleLower === "hr_admin") {
      return "bg-teal-600 text-white font-bold";
    }
    if (roleLower === "manager") {
      return "bg-indigo-600 text-white font-bold";
    }
    return "bg-emerald-600 text-white font-bold";
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="left"
        showCloseButton={true}
        className="w-64 p-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-full select-none"
      >
        {/* Logo area */}
        <div className="flex items-center h-16 px-5 border-b border-sidebar-border shrink-0">
          <Logo role={activeRole} showText={true} size="md" />
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
          {items.map((item) => (
            <NavItem
              key={item.route}
              item={item}
              role={activeRole}
              onClick={onClose}
            />
          ))}
        </nav>

        {/* Bottom Profile section */}
        <div className="p-4 border-t border-sidebar-border shrink-0 bg-sidebar/50 mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-sidebar-accent/60 transition-colors text-left focus:outline-none cursor-pointer group">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-9 w-9 border border-sidebar-border shrink-0">
                    {avatar && <AvatarImage src={avatar} alt={name} />}
                    <AvatarFallback className={getAvatarBg()}>
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-sidebar-foreground truncate leading-none mb-1">
                      {name}
                    </p>
                    <p className="text-[10px] text-sidebar-foreground/60 truncate leading-none">
                      {user?.label || activeRole}
                    </p>
                  </div>
                </div>
                <MoreVertical className="w-4 h-4 text-sidebar-foreground/50 group-hover:text-sidebar-foreground shrink-0" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="right"
              align="end"
              sideOffset={12}
              className="w-56 bg-sidebar border border-sidebar-border text-sidebar-foreground rounded-xl p-1.5 shadow-xl"
            >
              <DropdownMenuLabel className="px-2 py-1.5 text-xs text-sidebar-foreground/65 font-normal">
                Logged in as
                <p className="font-semibold text-sidebar-foreground truncate mt-0.5">{email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-sidebar-border" />
              <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-sidebar-accent focus:bg-sidebar-accent focus:text-sidebar-accent-foreground cursor-pointer text-sm">
                <User className="w-4 h-4 text-sidebar-foreground/60" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-sidebar-accent focus:bg-sidebar-accent focus:text-sidebar-accent-foreground cursor-pointer text-sm">
                <Settings className="w-4 h-4 text-sidebar-foreground/60" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-sidebar-border" />
              <DropdownMenuItem
                onClick={onLogout}
                className="flex items-center gap-2 px-2 py-2 rounded-lg text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 focus:bg-rose-950/20 focus:text-rose-300 cursor-pointer text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SheetContent>
    </Sheet>
  );
}
