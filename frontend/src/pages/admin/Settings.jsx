import { useState } from "react";
import CrudHeader from "@/components/admin/CrudHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/dashboard/SectionHeader";

/**
 * Orchestrator Page for HR System Settings.
 * Configures policy switches and company workflows parameters.
 *
 * @component
 */
export default function Settings() {
  const [formData, setFormData] = useState({
    companyName: "Acme Corporation Ltd",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    multiLevelApprovals: true,
    emailNotifications: true,
  });

  const [saving, setSaving] = useState(false);

  const handleToggleWorkDay = (day) => {
    setFormData((prev) => {
      const active = prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day];
      return { ...prev, workingDays: active };
    });
  };

  const handleToggleSwitch = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Company settings modified and saved successfully.");
    }, 1000);
  };

  const weekDaysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="space-y-6 font-sans text-left select-none">
      <CrudHeader
        title="Settings & Policies"
        subtitle="Configure corporate metadata workflows and active operations parameters"
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Settings Card */}
        <Card className="p-5 border border-border bg-card text-card-foreground shadow-xs">
          <SectionHeader title="Organization Profile" subtitle="General corporate details" />

          <div className="space-y-4 mt-6">
            <div className="space-y-1">
              <label htmlFor="company-name" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Company Name
              </label>
              <input
                required
                type="text"
                id="company-name"
                disabled={saving}
                value={formData.companyName}
                onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                className="w-full max-w-md p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </Card>

        {/* Operational parameters options Card */}
        <Card className="p-5 border border-border bg-card text-card-foreground shadow-xs">
          <SectionHeader title="Working Days & Workflow" subtitle="Select default operational work days and approval limits" />

          <div className="space-y-6 mt-6">
            {/* Week days selectors */}
            <div className="space-y-2">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Active Weekly Work Days
              </span>
              <div className="flex flex-wrap gap-2">
                {weekDaysList.map((day) => {
                  const isActive = formData.workingDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={saving}
                      onClick={() => handleToggleWorkDay(day)}
                      className={`h-8 px-3 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-accent/25 text-muted-foreground border-border hover:bg-accent/50"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Switch configs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              {/* Approval Stages Switch */}
              <div className="flex items-center justify-between gap-4 p-3 bg-accent/15 border border-border rounded-xl">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">Multi-Stage Approvals</h4>
                  <p className="text-[10px] text-muted-foreground">Enforces both Line Manager and Director reviews</p>
                </div>
                <input
                  type="checkbox"
                  disabled={saving}
                  checked={formData.multiLevelApprovals}
                  onChange={() => handleToggleSwitch("multiLevelApprovals")}
                  className="h-4 w-4 rounded-md border border-border bg-accent/20 text-primary cursor-pointer"
                />
              </div>

              {/* Notification Toggles Switch */}
              <div className="flex items-center justify-between gap-4 p-3 bg-accent/15 border border-border rounded-xl">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">Email Notifications</h4>
                  <p className="text-[10px] text-muted-foreground">Dispatches immediate emails alert triggers on updates</p>
                </div>
                <input
                  type="checkbox"
                  disabled={saving}
                  checked={formData.emailNotifications}
                  onChange={() => handleToggleSwitch("emailNotifications")}
                  className="h-4 w-4 rounded-md border border-border bg-accent/20 text-primary cursor-pointer"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-bold text-xs h-10 px-6 cursor-pointer shadow-md"
          >
            {saving ? "Saving Changes..." : "Save Config Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
export { Settings };
