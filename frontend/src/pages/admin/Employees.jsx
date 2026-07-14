import { useEffect, useState } from "react";
import { adminService } from "@/services/mock/adminService";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CrudHeader from "@/components/admin/CrudHeader";
import CrudTable from "@/components/admin/CrudTable";
import EmployeeDialog from "@/components/admin/EmployeeDialog";
import FiltersPanel from "@/components/leave-history/FiltersPanel";

/**
 * Orchestrator Page for Employees Management CRUD directory.
 *
 * @component
 */
export default function Employees() {
  const [employeesData, setEmployeesData] = useState({ data: [], total: 0, page: 1, limit: 5, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: "", leaveType: "", search: "" });
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog configurations
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployeesList = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const options = {
        page,
        limit: 5,
        filters: {
          search: filters.search,
          role: filters.leaveType, // Map leaveType selection as Role select dropdown
          department: filters.status, // Map status selection as Department select dropdown
        },
      };
      const result = await adminService.getEmployees(options);
      setEmployeesData(result);
    } catch (err) {
      setErrorMsg(err.message || "Failed to query employees list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesList();
  }, [page, filters]);

  // Debounce search name keywords changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchQuery }));
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleFilterChange = (field, val) => {
    if (field === "search") {
      setSearchQuery(val);
    } else {
      setFilters((prev) => ({ ...prev, [field]: val }));
      setPage(1);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({ status: "", leaveType: "", search: "" });
    setPage(1);
  };

  const handleOpenAdd = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedEmployee(null);
    setDialogOpen(false);
  };

  const handleSaveSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (selectedEmployee) {
        await adminService.updateEmployee(selectedEmployee.id, formData);
      } else {
        await adminService.createEmployee(formData);
      }
      handleDialogClose();
      fetchEmployeesList();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to soft-delete this employee profile?")) return;
    try {
      await adminService.softDeleteEmployee(id);
      fetchEmployeesList();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const headers = [
    { key: "employee", label: "Employee" },
    { key: "email", label: "Email Address" },
    { key: "department", label: "Department" },
    { key: "designation", label: "Designation" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", className: "text-right" },
  ];


  const renderRow = (emp) => {
    const initials = emp.name.split(" ").map((n) => n[0]).join("").toUpperCase();
    const isActive = emp.status !== "Inactive";

    return (
      <tr key={emp.id} className="hover:bg-accent/20 transition-colors">
        <td className="px-6 py-3.5">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-border shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-foreground leading-none">{emp.name}</p>
              <span className="text-[10px] text-muted-foreground block mt-0.5">{emp.id}</span>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5 font-medium text-muted-foreground">{emp.email}</td>
        <td className="px-4 py-3.5 font-medium text-foreground">{emp.department}</td>
        <td className="px-4 py-3.5 font-medium text-foreground">{emp.designation}</td>
        <td className="px-4 py-3.5">
          <span className={`badge ${isActive ? "badge-approved" : "badge-cancelled"}`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </td>
        <td className="px-4 py-3.5 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => handleOpenEdit(emp)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              title="Edit Profile"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(emp.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete"
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
        title="Staff Directory"
        subtitle="Manage, configure, and register corporate employee accounts"
        actionLabel="Register Employee"
        onActionClick={handleOpenAdd}
      />

      {/* Roster Filters panel */}
      <FiltersPanel
        filters={{ ...filters, search: searchQuery }}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        searchLabel="Employee Name"
        searchPlaceholder="Filter name or email..."
      />

      {errorMsg && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 bg-card border border-border rounded-2xl">
          <AlertCircle className="w-10 h-10 text-destructive mb-4" />
          <h3 className="text-base font-bold text-foreground mb-1">Database Error</h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-6">{errorMsg}</p>
          <button
            onClick={fetchEmployeesList}
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
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      )}

      {!loading && !errorMsg && (
        <CrudTable
          headers={headers}
          items={employeesData.data}
          renderRow={renderRow}
          pagination={{
            page: employeesData.page,
            totalPages: employeesData.totalPages,
            total: employeesData.total,
          }}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {/* CRUD dialog overlay */}
      <EmployeeDialog
        isOpen={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleSaveSubmit}
        employee={selectedEmployee}
        loading={submitting}
      />
    </div>
  );
}
export { Employees };
