import { useState, useEffect } from "react";
import { X, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validationUtils } from "@/utils/validationUtils";

/**
 * Presentational DepartmentDialog.
 * Handles registering or modifying departments configurations.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Renders dialog.
 * @param {Function} props.onClose - Closes modal.
 * @param {Function} props.onSubmit - Submission trigger with form payload.
 * @param {Object} [props.department] - Existing department details (null for creation).
 * @param {boolean} [props.loading=false] - Submission pending state.
 */
export default function DepartmentDialog({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  department = null,
  loading = false,
}) {
  const [name, setName] = useState("");
  const [manager, setManager] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (department) {
      setName(department.name || "");
      setManager(department.manager || "");
    } else {
      setName("");
      setManager("");
    }
    setErrorMsg("");
  }, [department, isOpen]);

  // Support Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validationUtils.validateMinLength(name, 3)) {
      setErrorMsg("Department name must be at least 3 characters long.");
      return;
    }

    onSubmit({ name, manager: manager.trim() });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dept-dialog-title"
    >
      <div
        className="w-full max-w-md bg-card border border-border p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 text-left flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start justify-between border-b border-border pb-3">
            <h3 id="dept-dialog-title" className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary shrink-0" />
              {department ? "Modify Department Configuration" : "Register Department Profile"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMsg && (
            <p className="text-[10px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl">
              {errorMsg}
            </p>
          )}

          <div className="space-y-3">
            {/* Department Name */}
            <div className="space-y-1">
              <label htmlFor="dept-name" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Department Name
              </label>
              <input
                required
                type="text"
                id="dept-name"
                disabled={loading}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="Product Engineering"
                className="w-full p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Department Manager */}
            <div className="space-y-1">
              <label htmlFor="dept-manager" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Direct Manager Assignment
              </label>
              <input
                type="text"
                id="dept-manager"
                disabled={loading}
                value={manager}
                onChange={(e) => {
                  setManager(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="Sarah Hansen (MGR-20015)"
                className="w-full p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={onClose}
              className="rounded-xl font-semibold text-xs h-9.5 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-semibold text-xs h-9.5 cursor-pointer"
            >
              {loading ? "Processing..." : department ? "Update Department" : "Register Department"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export { DepartmentDialog };
