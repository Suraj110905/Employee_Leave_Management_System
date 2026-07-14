import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Send } from "lucide-react";
import { leaveUtils } from "@/services/mock/leaveService";

/**
 * Presentational LeaveForm.
 * Handles user form inputs, runs basic client-side checks,
 * and bubbles up value changes and submissions.
 *
 * @component
 */
export default function LeaveForm({
  balances = [],
  onSubmit = () => {},
  onChange = () => {},
  loading = false,
}) {
  const [formData, setFormData] = useState({
    leaveType: "Annual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [formError, setFormError] = useState("");

  // Notify parent component of field changes on mount and state updates
  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    const { leaveType, startDate, endDate, reason } = formData;

    // Client-side quick validations
    const dateError = leaveUtils.validateDates(startDate, endDate);
    if (dateError) {
      setFormError(dateError);
      return;
    }

    if (!reason || reason.trim().length < 10) {
      setFormError("Reason must be at least 10 characters long.");
      return;
    }

    // Bubble up valid data payload
    onSubmit({
      leaveType,
      startDate,
      endDate,
      reason: reason.trim(),
    });
  };

  return (
    <Card className="p-6 border border-border bg-card text-card-foreground shadow-xs text-left">
      {formError && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/25 text-destructive text-xs rounded-xl font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Leave Type Select Dropdown */}
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Leave Category Type
          </label>
          <select
            value={formData.leaveType}
            onChange={(e) => handleFieldChange("leaveType", e.target.value)}
            disabled={loading}
            className="w-full h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring select-none cursor-pointer"
          >
            {balances.map((bal) => (
              <option key={bal.type} value={bal.type}>
                {bal.type} Leave
              </option>
            ))}
          </select>
        </div>

        {/* Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Start Date
            </label>
            <Input
              type="date"
              required
              disabled={loading}
              value={formData.startDate}
              onChange={(e) => handleFieldChange("startDate", e.target.value)}
              className="h-10 w-full rounded-xl bg-accent/20 border-border focus:bg-accent/45 cursor-pointer font-semibold text-xs"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              End Date
            </label>
            <Input
              type="date"
              required
              disabled={loading}
              value={formData.endDate}
              onChange={(e) => handleFieldChange("endDate", e.target.value)}
              className="h-10 w-full rounded-xl bg-accent/20 border-border focus:bg-accent/45 cursor-pointer font-semibold text-xs"
            />
          </div>
        </div>

        {/* Reason Text Area */}
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Reason / Comments
          </label>
          <textarea
            required
            disabled={loading}
            rows={4}
            value={formData.reason}
            onChange={(e) => handleFieldChange("reason", e.target.value)}
            placeholder="Please detail why you are requesting this leave..."
            className="w-full p-3.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all resize-none min-h-[100px]"
          />
          <span className="text-[10px] text-muted-foreground font-semibold mt-1.5 block">
            Min 10 characters required. Current: {formData.reason.length}
          </span>
        </div>

        {/* Submit Actions Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-xl font-semibold cursor-pointer flex items-center justify-center gap-2 text-xs"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              Submit Application
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
