import { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validationUtils } from "@/utils/validationUtils";

/**
 * Presentational HolidayDialog.
 * Registers public calendar holiday dates.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Renders dialog.
 * @param {Function} props.onClose - Closes modal.
 * @param {Function} props.onSubmit - Submission trigger callback.
 * @param {Object} [props.holiday] - Existing holiday data (null for creation).
 * @param {boolean} [props.loading=false] - Submission pending state.
 */
export default function HolidayDialog({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  holiday = null,
  loading = false,
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("National");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (holiday) {
      setName(holiday.name || "");
      setDate(holiday.date || "");
      setType(holiday.type || "National");
    } else {
      setName("");
      setDate("");
      setType("National");
    }
    setErrorMsg("");
  }, [holiday, isOpen]);

  // Support Escape close action
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
      setErrorMsg("Holiday Name must be at least 3 characters long.");
      return;
    }

    if (!date) {
      setErrorMsg("Please select a valid calendar date.");
      return;
    }

    onSubmit({ name, date, type });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="holiday-dialog-title"
    >
      <div
        className="w-full max-w-md bg-card border border-border p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 text-left flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start justify-between border-b border-border pb-3">
            <h3 id="holiday-dialog-title" className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              {holiday ? "Modify Calendar Holiday" : "Register Holiday Event"}
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
            {/* Holiday Name */}
            <div className="space-y-1">
              <label htmlFor="hol-name" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Holiday Title
              </label>
              <input
                required
                type="text"
                id="hol-name"
                disabled={loading}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="Thanksgiving Break"
                className="w-full p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Date selection picker */}
            <div className="space-y-1">
              <label htmlFor="hol-date" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Calendar Date
              </label>
              <input
                required
                type="date"
                id="hol-date"
                disabled={loading}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setErrorMsg("");
                }}
                className="w-full p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
              />
            </div>

            {/* Classification type selector */}
            <div className="space-y-1">
              <label htmlFor="hol-type" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Holiday Type
              </label>
              <select
                id="hol-type"
                disabled={loading}
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setErrorMsg("");
                }}
                className="w-full p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="National">National Holiday</option>
                <option value="Company">Company Holiday</option>
                <option value="Optional">Optional Holiday</option>
              </select>
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
              {loading ? "Processing..." : holiday ? "Update Event" : "Register Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export { HolidayDialog };
