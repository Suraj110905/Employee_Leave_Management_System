import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

/**
 * Reusable Dialog Modal for capturing comments before rejecting requests.
 * Uses a pure CSS overlay with Escape exit and overlay clicks handling.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Controls dialogue rendering.
 * @param {Function} props.onClose - Handles close actions.
 * @param {Function} props.onSubmit - Rejection remarks submit callback.
 * @param {boolean} [props.loading=false] - Submission pending state.
 */
export default function RejectRemarksDialog({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  loading = false,
}) {
  const [remarks, setRemarks] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Handle Escape key layout closure
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!remarks || remarks.trim().length < 10) {
      setErrorMsg("Remarks must be at least 10 characters long.");
      return;
    }

    onSubmit(remarks.trim());
    setRemarks("");
  };

  const handleClose = () => {
    setRemarks("");
    setErrorMsg("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-dialog-title"
    >
      {/* Modal Dialog Card */}
      <div
        className="w-full max-w-md bg-card border border-border p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 text-left flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()} // Stop click bubbling
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start justify-between">
            <h3
              id="reject-dialog-title"
              className="text-base font-extrabold text-foreground flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              Rejection Remarks Required
            </h3>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            All leave request rejections mandate explaining the reason to the applicant. Please provide comments (minimum 10 characters).
          </p>

          {errorMsg && (
            <p className="text-[10px] font-bold text-rose-500 animate-fadeIn">
              {errorMsg}
            </p>
          )}

          <div>
            <textarea
              required
              disabled={loading}
              rows={3}
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
                setErrorMsg("");
              }}
              placeholder="Provide comments regarding rejection..."
              className="w-full p-3 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none min-h-[80px]"
            />
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block mt-1.5">
              Current length: {remarks.length} (min 10)
            </span>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleClose}
              className="rounded-xl font-semibold text-xs h-9 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs h-9 cursor-pointer border border-rose-600 shadow-xs"
            >
              {loading ? "Saving..." : "Confirm Rejection"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export { RejectRemarksDialog };
