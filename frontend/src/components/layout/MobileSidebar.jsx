import PropTypes from "prop-types";
import { X, LogOut } from "lucide-react";
import Logo from "./Logo";
import NavItem from "./NavItem";

export default function MobileSidebar({
  isOpen,
  onClose,
  items = [],
  role = "",
  onLogout,
}) {
  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-100 border-r border-slate-800 z-50 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <Logo role={role} />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto" onClick={onClose}>
          {items.map((item) => (
            <NavItem key={item.path} item={item} role={role} />
          ))}
        </nav>

        {/* Drawer Footer (Logout) */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

MobileSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
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
