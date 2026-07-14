import { useState, useEffect, useRef } from "react";
import { Search, User, Briefcase, Calendar, FileText, X } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * Presentational Spotlight Search Component.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.results - Matching records grouped by category.
 * @param {Array} props.results.employees - Employee list.
 * @param {Array} props.results.departments - Department list.
 * @param {Array} props.results.holidays - Holidays list.
 * @param {Array} props.results.leaveTypes - Policies list.
 * @param {Function} props.onSearchChange - Triggers lookup updates.
 * @param {Function} props.onResultClick - Callback when selection is made.
 */
export default function GlobalSearchInput({
  results = { employees: [], departments: [], holidays: [], leaveTypes: [] },
  onSearchChange = () => {},
  onResultClick = () => {},
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close search results overlay when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearchChange(val);
    setIsOpen(val.trim().length >= 2);
  };

  const handleClear = () => {
    setQuery("");
    onSearchChange("");
    setIsOpen(false);
  };

  const selectItem = (type, item) => {
    onResultClick(type, item);
    setIsOpen(false);
  };

  const hasResults =
    results.employees?.length > 0 ||
    results.departments?.length > 0 ||
    results.holidays?.length > 0 ||
    results.leaveTypes?.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-md select-none text-left font-sans">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/60" />
        <Input
          type="text"
          placeholder="Global search (Staff, Dept, Holidays...)"
          value={query}
          onChange={handleInputChange}
          className="pl-9 pr-8 h-10 rounded-xl bg-accent/25 border-border focus:bg-accent/40 font-semibold text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grouped Results overlay */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto bg-card border border-border rounded-xl shadow-lg divide-y divide-border animate-in fade-in duration-200">
          {!hasResults ? (
            <div className="p-4 text-center text-xs text-muted-foreground italic font-semibold">
              No matching records found.
            </div>
          ) : (
            <>
              {/* Employees */}
              {results.employees?.length > 0 && (
                <div className="p-2">
                  <span className="px-2.5 py-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Staff Directory
                  </span>
                  {results.employees.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => selectItem("employee", e)}
                      className="px-2.5 py-2 hover:bg-accent/30 rounded-lg cursor-pointer flex items-center gap-2.5 text-xs text-foreground font-semibold"
                    >
                      <User className="w-3.5 h-3.5 text-primary shrink-0" />
                      <div>
                        <span>{e.name}</span>
                        <span className="text-[10px] text-muted-foreground block font-medium">
                          {e.designation} &bull; {e.department}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Departments */}
              {results.departments?.length > 0 && (
                <div className="p-2">
                  <span className="px-2.5 py-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Departments
                  </span>
                  {results.departments.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => selectItem("department", d)}
                      className="px-2.5 py-2 hover:bg-accent/30 rounded-lg cursor-pointer flex items-center gap-2.5 text-xs text-foreground font-semibold"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <div>
                        <span>{d.name}</span>
                        <span className="text-[10px] text-muted-foreground block font-medium">
                          Manager: {d.manager || "Unassigned"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Holidays */}
              {results.holidays?.length > 0 && (
                <div className="p-2">
                  <span className="px-2.5 py-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Public Calendar
                  </span>
                  {results.holidays.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => selectItem("holiday", h)}
                      className="px-2.5 py-2 hover:bg-accent/30 rounded-lg cursor-pointer flex items-center gap-2.5 text-xs text-foreground font-semibold"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div>
                        <span>{h.name}</span>
                        <span className="text-[10px] text-muted-foreground block font-medium">
                          Date: {h.date} &bull; {h.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Leave Types */}
              {results.leaveTypes?.length > 0 && (
                <div className="p-2">
                  <span className="px-2.5 py-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Leave Types Policy
                  </span>
                  {results.leaveTypes.map((lt) => (
                    <div
                      key={lt.id}
                      onClick={() => selectItem("leaveType", lt)}
                      className="px-2.5 py-2 hover:bg-accent/30 rounded-lg cursor-pointer flex items-center gap-2.5 text-xs text-foreground font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <div>
                        <span>{lt.type} Leave</span>
                        <span className="text-[10px] text-muted-foreground block font-medium">
                          Limit: {lt.annualLimit} days &bull; Carry forward: {lt.carryForward ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
export { GlobalSearchInput };
