import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-400 font-medium font-sans mb-4">
      <Link to="/" className="hover:text-slate-600 transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const label = typeof item === "string" ? item : item.label;
        const path = typeof item === "object" ? item.path : null;

        return (
          <div key={idx} className="flex items-center space-x-2">
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            {isLast ? (
              <span className="text-slate-600 font-semibold truncate">{label}</span>
            ) : path ? (
              <Link to={path} className="hover:text-slate-600 transition-colors truncate">
                {label}
              </Link>
            ) : (
              <span className="truncate">{label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        path: PropTypes.string,
      }),
    ])
  ),
};
