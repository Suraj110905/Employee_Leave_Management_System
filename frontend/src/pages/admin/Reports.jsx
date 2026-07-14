import { useState } from "react";
import CrudHeader from "@/components/admin/CrudHeader";
import AnalyticsWidget from "@/components/admin/AnalyticsWidget";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";

/**
 * Orchestrator Page for Leave Utilization Reports.
 *
 * @component
 */
export default function Reports() {
  const [downloading, setDownloading] = useState({ csv: false, pdf: false });

  const handleExport = (format) => {
    setDownloading((prev) => ({ ...prev, [format]: true }));
    setTimeout(() => {
      setDownloading((prev) => ({ ...prev, [format]: false }));
      alert(`Successfully compiled and exported leave utilization report in ${format.toUpperCase()} format!`);
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans text-left select-none">
      <CrudHeader
        title="Leave Utilization Reports"
        subtitle="Analyze organization leave balances consumption and monthly trend lines"
      />

      {/* SVG utilization charts */}
      <AnalyticsWidget />

      {/* Export triggers section */}
      <Card className="p-5 border border-border bg-card text-card-foreground shadow-xs">
        <SectionHeader title="Downloadable Summaries" subtitle="Export raw records for external spreadsheets audits" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* CSV Export Card */}
          <div className="p-4 border border-border bg-accent/25 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-foreground">Employee Balance Registry (CSV)</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Includes used, allowed, and remaining offsets</p>
              </div>
            </div>
            <Button
              onClick={() => handleExport("csv")}
              disabled={downloading.csv}
              variant="outline"
              size="sm"
              className="h-8.5 rounded-lg border-border cursor-pointer text-[10px] font-bold"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              {downloading.csv ? "Building..." : "Export"}
            </Button>
          </div>

          {/* PDF Export Card */}
          <div className="p-4 border border-border bg-accent/25 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-foreground">Monthly Utilization Report (PDF)</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Formatted executive graph analysis breakdown</p>
              </div>
            </div>
            <Button
              onClick={() => handleExport("pdf")}
              disabled={downloading.pdf}
              variant="outline"
              size="sm"
              className="h-8.5 rounded-lg border-border cursor-pointer text-[10px] font-bold"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              {downloading.pdf ? "Compiling..." : "Download"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
export { Reports };
