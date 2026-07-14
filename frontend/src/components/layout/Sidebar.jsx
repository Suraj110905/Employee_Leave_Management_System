import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Settings,
  MoreVertical,
} from "lucide-react";
import Logo from "./Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Enterprise SaaS Sidebar component.
 * Accepts a `user` prop and renders dynamic, role-based collapsible navigation
 * utilizing semantic Tailwind CSS theme classes.
 */
export default function Sidebar({
  items = [],
  role = "",
  onLogout = () => {},
  user = null,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = !isCollapsed || isHovered;

  // Extract user properties with robust fallback values
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
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameString.charAt(0).toUpperCase();
  };

  const userInitial = getInitials(name);
  const activeRole = role || userRole;

  /** Avatar fallback — unified primary green for all roles */
  const getAvatarBg = () => "bg-primary text-primary-foreground font-bold";

  /** Active nav item — primary green for all roles (matches design board) */
  const getActiveStyles = () =>
    "bg-primary text-primary-foreground shadow-sm shadow-primary/30";

  return (
    <aside
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => isCollapsed && setIsHovered(false)}
      className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border z-30 transition-all duration-300 ease-in-out select-none ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={() => {
          setIsCollapsed(!isCollapsed);
          setIsHovered(false);
        }}
        className="absolute -right-3.5 top-8 w-7 h-7 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent flex items-center justify-center cursor-pointer shadow-md transition-transform duration-200 hover:scale-105 z-40"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Header Logo */}
      <div className="flex items-center h-16 px-5 border-b border-sidebar-border shrink-0">
        <Logo role={activeRole} showText={isExpanded} size="md" />
      </div>

      {/* Single Tooltip Provider wrapping the navigation menus */}
      <TooltipProvider delay={100}>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.route}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.route}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? getActiveStyles()
                            : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span
                        className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
                          isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
                        }`}
                      >
                        {item.label}
                      </span>
                    </NavLink>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent
                      side="right"
                      className="bg-sidebar text-sidebar-foreground border border-sidebar-border text-xs py-1.5 px-3 rounded-lg shadow-xl"
                    >
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>

            );
          })}
        </nav>
      </TooltipProvider>

      {/* Profile Section Footer */}
      <div className="p-4 border-t border-sidebar-border shrink-0 bg-sidebar/50">
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
                {isExpanded && (
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-sidebar-foreground truncate leading-none mb-1">
                      {name}
                    </p>
                    <p className="text-[10px] text-sidebar-foreground/60 truncate leading-none">
                      {user.label || activeRole}
                    </p>
                  </div>
                )}
              </div>
              {isExpanded && (
                <MoreVertical className="w-4 h-4 text-sidebar-foreground/50 group-hover:text-sidebar-foreground shrink-0" />
              )}
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
    </aside>
  );
}
