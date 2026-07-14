import { useEffect, useState } from "react";
import { adminService } from "@/services/mock/adminService";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CrudHeader from "@/components/admin/CrudHeader";
import CrudTable from "@/components/admin/CrudTable";
import LeaveTypeDialog from "@/components/admin/LeaveTypeDialog";

/**
 * Orchestrator Page for Leave Types Policy Management.
 *
 * @component
 */
export default function LeaveTypes() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchLeavePolicies = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await adminService.getLeaveTypes();
      setLeaveTypes(data);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load leave types.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeavePolicies();
  }, []);

  const handleOpenAdd = () => {
    setSelectedPolicy(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (policy) => {
    setSelectedPolicy(policy);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedPolicy(null);
    setDialogOpen(false);
  };

  const handleSaveSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (selectedPolicy) {
        await adminService.updateLeaveType(selectedPolicy.id, formData);
      } else {
        await adminService.createLeaveType(formData);
      }
      handleDialogClose();
      fetchLeavePolicies();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const headers = [
    { key: "type", label: "Leave Classification" },
    { key: "annualLimit", label: "Max Annual Limit" },
    { key: "carryForward", label: "Carry Forward" },
    { key: "genderPolicy", label: "Gender Policy Rules" },
    { key: "actions", label: "Actions", className: "text-right" },
  ];

  const renderRow = (lt) => {
    return (
      <tr key={lt.id} className="hover:bg-accent/20 transition-colors">
        <td className="px-6 py-3.5 font-bold text-foreground">{lt.type} Leave</td>
        <td className="px-4 py-3.5 font-semibold text-foreground">{lt.annualLimit} days</td>
        <td className="px-4 py-3.5">
          <span className={`badge ${lt.carryForward ? "badge-approved" : "badge-cancelled"}`}>
            {lt.carryForward ? "Allowed" : "Not Allowed"}
          </span>
        </td>
        <td className="px-4 py-3.5 text-muted-foreground">{lt.genderPolicy}</td>
        <td className="px-4 py-3.5 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => handleOpenEdit(lt)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              title="Edit Policy"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    );
  };


  return (
    <div className="space-y-6 font-sans text-left select-none">
      <CrudHeader
        title="Leave Types Policy Management"
        subtitle="Configure company parameters, allocations, and rollover constraints"
        actionLabel="Configure New Type"
        onActionClick={handleOpenAdd}
      />

      {errorMsg && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 bg-card border border-border rounded-2xl">
          <AlertCircle className="w-10 h-10 text-destructive mb-4" />
          <h3 className="text-base font-bold text-foreground mb-1">Database Error</h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-6">{errorMsg}</p>
          <button
            onClick={fetchLeavePolicies}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs shadow-md hover:bg-primary/90 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Connection
          </button>
        </div>
      )}

      {loading && !errorMsg && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      )}

      {!loading && !errorMsg && (
        <CrudTable
          headers={headers}
          items={leaveTypes}
          renderRow={renderRow}
          pagination={{ page: 1, totalPages: 1, total: leaveTypes.length }}
        />
      )}

      <LeaveTypeDialog
        isOpen={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleSaveSubmit}
        policy={selectedPolicy}
        loading={submitting}
      />
    </div>
  );
}
export { LeaveTypes };
