import { useEffect, useState } from "react";
import { adminService } from "@/services/mock/adminService";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CrudHeader from "@/components/admin/CrudHeader";
import CrudTable from "@/components/admin/CrudTable";
import DepartmentDialog from "@/components/admin/DepartmentDialog";

/**
 * Orchestrator Page for Departments Management.
 *
 * @component
 */
export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await adminService.getDepartments();
      setDepartments(data);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenAdd = () => {
    setSelectedDept(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setSelectedDept(dept);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedDept(null);
    setDialogOpen(false);
  };

  const handleSaveSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (selectedDept) {
        // Mock update in memory (simulated success)
        alert(`Department updated: ${formData.name}`);
      } else {
        await adminService.createDepartment(formData);
      }
      handleDialogClose();
      fetchDepartments();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await adminService.deleteDepartment(id);
      fetchDepartments();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const headers = [
    { key: "id", label: "Department ID" },
    { key: "name", label: "Department Name" },
    { key: "headcount", label: "Staff Headcount" },
    { key: "manager", label: "Assigned Director" },
    { key: "actions", label: "Actions", className: "text-right" },
  ];

  const renderRow = (dept) => {
    return (
      <tr key={dept.id} className="hover:bg-accent/20 transition-colors">
        <td className="px-6 py-3.5 font-bold text-foreground">{dept.id}</td>
        <td className="px-4 py-3.5 font-semibold text-foreground">{dept.name}</td>
        <td className="px-4 py-3.5 font-semibold text-foreground">{dept.headcount} employees</td>
        <td className="px-4 py-3.5 text-muted-foreground">{dept.manager || "Unassigned"}</td>
        <td className="px-4 py-3.5 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => handleOpenEdit(dept)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              title="Edit Department"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(dept.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete Department"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    );
  };


  return (
    <div className="space-y-6 font-sans text-left select-none">
      <CrudHeader
        title="Departments Configuration"
        subtitle="Manage organization division heads and headcount logs"
        actionLabel="Add Department"
        onActionClick={handleOpenAdd}
      />

      {errorMsg && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 bg-card border border-border rounded-2xl">
          <AlertCircle className="w-10 h-10 text-destructive mb-4" />
          <h3 className="text-base font-bold text-foreground mb-1">Database Error</h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-6">{errorMsg}</p>
          <button
            onClick={fetchDepartments}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs shadow-md hover:bg-primary/90 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Query
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
          items={departments}
          renderRow={renderRow}
          pagination={{ page: 1, totalPages: 1, total: departments.length }}
        />
      )}

      <DepartmentDialog
        isOpen={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleSaveSubmit}
        department={selectedDept}
        loading={submitting}
      />
    </div>
  );
}
export { Departments };
