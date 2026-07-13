import { NavLink } from "react-router-dom";

export default function NavItem({ item, role = "", onClick = null }) {
  const Icon = item.icon;

  const getActiveStyles = () => {
    const roleLower = role?.toLowerCase();
    if (roleLower === "admin" || roleLower === "hr_admin") {
      return "bg-teal-600 text-white shadow-lg shadow-teal-900/30";
    }
    if (roleLower === "manager") {
      return "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30";
    }
    return "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30";
  };

  return (
    <NavLink
      to={item.route}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? getActiveStyles()
            : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
        }`
      }
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      <span>{item.label}</span>
    </NavLink>
  );
}


