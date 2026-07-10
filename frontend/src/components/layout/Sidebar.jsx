import PropTypes from "prop-types";
import { LogOut } from "lucide-react";
import Logo from "./Logo";
import NavItem from "./NavItem";

export default function Sidebar({ items = [], role = "", onLogout }) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-slate-900 text-slate-100 border-r border-slate-800 z-30">
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <Logo role={role} />
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {items.map((item) => (
          <NavItem key={item.path} item={item} role={role} />
        ))}
      </nav>

      {/* Sidebar Footer (Logout) */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
    })
  ).isRequired,
  role: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
};
