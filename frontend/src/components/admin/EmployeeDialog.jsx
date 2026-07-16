import { useState, useEffect } from "react";
import { X, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validationUtils } from "@/utils/validationUtils";

/**
 * Presentational EmployeeDialog Form.
 * Handles adding and editing employee profiles.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Renders dialog when true.
 * @param {Function} props.onClose - Closes modal.
 * @param {Function} props.onSubmit - Trigger callback with form dataset.
 * @param {Object} [props.employee] - Existing employee profile data (null for creation).
 * @param {boolean} [props.loading=false] - Submission pending state.
 */
export default function EmployeeDialog({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  employee = null,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "employee",
    department: "Engineering",
    designation: "",
    managerId: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  // Sync state with selected employee record on edit open
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        role: employee.role || "employee",
        department: employee.department || "Engineering",
        designation: employee.designation || "",
        managerId: employee.managerId || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "employee",
        department: "Engineering",
        designation: "",
        managerId: "",
      });
    }
    setErrorMsg("");
  }, [employee, isOpen]);

  // Support Escape close action
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validationUtils.validateMinLength(formData.name, 3)) {
      setErrorMsg("Full name must be at least 3 characters long.");
      return;
    }

    if (!validationUtils.validateEmail(formData.email)) {
      setErrorMsg("Please enter a valid company email address.");
      return;
    }

    if (!validationUtils.validateMinLength(formData.designation, 2)) {
      setErrorMsg("Please provide a valid designation.");
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-dialog-title"
    >
      <div
        className="w-full max-w-lg bg-card border border-border p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 text-left flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start justify-between border-b border-border pb-3">
            <h3 id="employee-dialog-title" className="text-base font-extrabold text-foreground flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary shrink-0" />
              {employee ? "Modify Staff Member Profile" : "Register New Employee Profile"}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <input
                required
                type="text"
                id="name"
                name="name"
                disabled={loading}
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <input
                required
                type="email"
                id="email"
                name="email"
                disabled={loading}
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@company.com"
                className="w-full p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label htmlFor="role" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                System Role
              </label>
              <select
                id="role"
                name="role"
                disabled={loading}
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="hr_admin">HR Admin</option>
              </select>
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label htmlFor="department" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Department
              </label>
              <select
                id="department"
                name="department"
                disabled={loading}
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product & UI">Product & UI</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            {/* Designation */}
            <div className="space-y-1">
              <label htmlFor="designation" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Designation
              </label>
              <input
                required
                type="text"
                id="designation"
                name="designation"
                disabled={loading}
                value={formData.designation}
                onChange={handleChange}
                placeholder="Senior Architect"
                className="w-full p-2.5 rounded-xl border border-border bg-accent/20 focus:bg-accent/30 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Direct Manager */}
            <div className="space-y-1">
              <label htmlFor="managerId" className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Direct Manager
              </label>
              <input
                type="text"
                id="managerId"
                name="managerId"
                disabled={loading}
                value={formData.managerId}
                onChange={handleChange}
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
              {loading ? "Processing..." : employee ? "Update Profile" : "Register Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export { EmployeeDialog };
