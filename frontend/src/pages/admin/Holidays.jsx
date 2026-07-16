import { useEffect, useState } from "react";
import { adminService } from "@/services/mock/adminService";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CrudHeader from "@/components/admin/CrudHeader";
import CrudTable from "@/components/admin/CrudTable";
import HolidayDialog from "@/components/admin/HolidayDialog";

/**
 * Orchestrator Page for Holidays Calendar management.
 *
 * @component
 */
export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchHolidays = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await adminService.getHolidays();
      setHolidays(data);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load holiday calendar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleOpenAdd = () => {
    setSelectedHoliday(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (holiday) => {
    setSelectedHoliday(holiday);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedHoliday(null);
    setDialogOpen(false);
  };

  const handleSaveSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (selectedHoliday) {
        await adminService.updateHoliday(selectedHoliday._id || selectedHoliday.id, formData);
      } else {
        await adminService.createHoliday(formData);
      }
      handleDialogClose();
      fetchHolidays();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this holiday event?")) return;
    try {
      await adminService.deleteHoliday(id);
      fetchHolidays();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const headers = [
    { key: "name", label: "Holiday Title" },
    { key: "date", label: "Scheduled Date" },
    { key: "type", label: "Classification" },
    { key: "actions", label: "Actions", className: "text-right" },
  ];

  const renderRow = (h) => {
    const badgeClass =
      h.type === "National"
        ? "badge badge-onhold"
        : h.type === "Company"
        ? "badge badge-approved"
        : "badge badge-cancelled";

    const id = h._id || h.id;

    return (
      <tr key={id} className="hover:bg-accent/20 transition-colors">
        <td className="px-6 py-3.5 font-bold text-foreground">{h.name}</td>
        <td className="px-4 py-3.5 font-semibold text-muted-foreground">
          {new Date(h.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </td>
        <td className="px-4 py-3.5">
          <span className={badgeClass}>
            {h.type}
          </span>
        </td>
        <td className="px-4 py-3.5 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => handleOpenEdit(h)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              title="Edit Holiday"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Remove Holiday"
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
        title="Public Holiday Calendar"
        subtitle="Manage national shutdown indicators and optional calendar breaks"
        actionLabel="Register Break Event"
        onActionClick={handleOpenAdd}
      />

      {errorMsg && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 bg-card border border-border rounded-2xl">
          <AlertCircle className="w-10 h-10 text-destructive mb-4" />
          <h3 className="text-base font-bold text-foreground mb-1">Database Error</h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-6">{errorMsg}</p>
          <button
            onClick={fetchHolidays}
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
          items={holidays}
          renderRow={renderRow}
          pagination={{ page: 1, totalPages: 1, total: holidays.length }}
        />
      )}

      <HolidayDialog
        isOpen={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleSaveSubmit}
        holiday={selectedHoliday}
        loading={submitting}
      />
    </div>
  );
}
export { Holidays };
