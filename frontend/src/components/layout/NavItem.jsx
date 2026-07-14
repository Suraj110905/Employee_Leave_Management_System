import { NavLink } from "react-router-dom";

export default function NavItem({ item, role = "", onClick = null }) {
  const Icon = item.icon;

  /** Active nav item — primary green for all roles (matches design board) */
  const getActiveStyles = () =>
    "bg-primary text-primary-foreground shadow-sm shadow-primary/30";


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


