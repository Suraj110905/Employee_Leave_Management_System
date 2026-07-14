import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";

/**
 * Generic Paginated Grid Presenter.
 * Centralizes columns mappings, row callbacks, and standard pager actions.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.headers - Array of header configs: { key, label, className }.
 * @param {Array<Object>} props.items - Roster data items.
 * @param {Function} props.renderRow - Row markup callback function: (item) => ReactNode.
 * @param {Object} props.pagination - Page configuration details.
 * @param {number} props.pagination.page - Current page.
 * @param {number} props.pagination.totalPages - Total pages.
 * @param {number} props.pagination.total - Total elements.
 * @param {Function} props.onPageChange - Callback triggered on page transitions.
 */
export default function CrudTable({
  headers = [],
  items = [],
  renderRow = () => {},
  pagination = { page: 1, totalPages: 1, total: 0 },
  onPageChange = () => {},
}) {
  const { page, totalPages, total } = pagination;

  return (
    <div className="space-y-4 select-none text-left font-sans">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-border border-dashed rounded-2xl bg-card text-muted-foreground text-center">
          <Inbox className="w-12 h-12 text-muted-foreground/35 mb-3 animate-pulse" />
          <h4 className="text-sm font-bold text-foreground">No Records Found</h4>
          <p className="text-[11px] text-muted-foreground max-w-sm mt-0.5">
            There are no active database records matching your current filter selections.
          </p>
        </div>
      ) : (
        <>
          {/* Main Tabular Container */}
          <div className="overflow-x-auto border border-border rounded-xl shadow-xs">
            <table className="w-full text-left text-xs text-muted-foreground">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {headers.map((h) => (
                    <th key={h.key} className={`px-6 py-3 ${h.className || ""}`}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {items.map((item, index) => renderRow(item, index))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controllers */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border border-border p-4 bg-card rounded-xl shadow-xs">
              <span className="text-xs text-muted-foreground">
                Showing page {page} of {totalPages} &bull; {total} total records
              </span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 rounded-lg text-xs cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Prev
                </Button>
                <span className="text-xs font-semibold text-foreground">{page} / {totalPages}</span>
                <Button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 rounded-lg text-xs cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export { CrudTable };
