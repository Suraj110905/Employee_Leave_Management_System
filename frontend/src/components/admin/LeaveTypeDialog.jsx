import { useState, useEffect } from "react";
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validationUtils } from "@/utils/validationUtils";

/**
 * Presentational LeaveTypeDialog.
 * Configuration form for modifying or creating leave types policy rules.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Renders dialog.
 * @param {Function} props.onClose - Closes modal.
 * @param {Function} props.onSubmit - Submission callback triggers with form payload.
 * @param {Object} [props.policy] - Existing policy details (null for creation).
 * @param {boolean} [props.loading=false] - Submission pending state.
 */
export default function LeaveTypeDialog({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  policy = null,
  loading = false,
}) {
  const [type, setType] = useState("");
  const [annualLimit, setAnnualLimit] = useState(10);
  const [carryForward, setCarryForward] = useState(false);
  const [genderPolicy, setGenderPolicy] = useState("All");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (policy) {
      setType(policy.type || "");
      setAnnualLimit(policy.annualLimit || 10);
      setCarryForward(policy.carryForward || false);
      setGenderPolicy(policy.genderPolicy || "All");
    } else {
      setType("");
      setAnnualLimit(10);
      setCarryForward(false);
      setGenderPolicy("All");
    }
    setErrorMsg("");
  }, [policy, isOpen]);

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

    if (!validationUtils.validateMinLength(type, 3)) {
      setErrorMsg("Leave Type Name must be at least 3 characters long.");
      return;
    }

    if (annualLimit < 1 || annualLimit > 365) {
      setErrorMsg("Annual limit days must be between 1 and 365.");
      return;
    }

    onSubmit({
      type,
      annualLimit: Number(annualLimit),
      carryForward,
      genderPolicy,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-dialog-title"
    >
      <div
        className="w-full max-w-md bg-card border border-border p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 text-left flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start justify-between border-b border-border pb-3">
            <h3 id="policy-dialog-title" className="text-base font-extrabold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary shrink-0" />
              {policy ? "Modify Leave Type Policy" : "Register Leave Type Policy"}
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
            {/* Type Name */}
            <div className="space-y-1">
              <label htmlFor="policy-type" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Leave Type Name
              </label>
              <input
                required
                type="text"
                id="policy-type"
                disabled={loading}
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="Maternity Leave"
                className="w-full p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Annual Limit */}
            <div className="space-y-1">
              <label htmlFor="annual-limit" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Max Annual Limit (Days)
              </label>
              <input
                required
                type="number"
                id="annual-limit"
                disabled={loading}
                min={1}
                max={365}
                value={annualLimit}
                onChange={(e) => {
                  setAnnualLimit(e.target.value);
                  setErrorMsg("");
                }}
                className="w-full p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Gender policy options */}
            <div className="space-y-1">
              <label htmlFor="gender-policy" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Gender Eligibility
              </label>
              <select
                id="gender-policy"
                disabled={loading}
                value={genderPolicy}
                onChange={(e) => {
                  setGenderPolicy(e.target.value);
                  setErrorMsg("");
                }}
                className="w-full p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="All">All Staff Members</option>
                <option value="Female Only">Female Staff Only</option>
                <option value="Male Only">Male Staff Only</option>
              </select>
            </div>

            {/* Carry forward rules */}
            <div className="flex items-center gap-2 pt-2 select-none">
              <input
                type="checkbox"
                id="carry-forward"
                disabled={loading}
                checked={carryForward}
                onChange={(e) => {
                  setCarryForward(e.target.checked);
                  setErrorMsg("");
                }}
                className="h-4 w-4 rounded-md border border-border bg-accent/20 text-primary focus:ring-1 focus:ring-ring cursor-pointer"
              />
              <label htmlFor="carry-forward" className="text-xs font-semibold text-foreground cursor-pointer">
                Allow Carry Forward of Unused Balances
              </label>
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
              {loading ? "Processing..." : policy ? "Update Policy" : "Register Policy"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export { LeaveTypeDialog };
