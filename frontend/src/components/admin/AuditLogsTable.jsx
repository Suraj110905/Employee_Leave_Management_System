import CrudTable from "@/components/admin/CrudTable";

/**
 * Presentational AuditLogsTable.
 * Displays system action trail logs.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.logs - Array of logs.
 * @param {Object} props.pagination - Pager details config.
 * @param {Function} props.onPageChange - Page change navigation callback.
 */
export default function AuditLogsTable({
  logs = [],
  pagination = { page: 1, totalPages: 1, total: 0 },
  onPageChange = () => {},
}) {
  const headers = [
    { key: "timestamp", label: "Timestamp" },
    { key: "actor", label: "Actor" },
    { key: "action", label: "Action Summary" },
    { key: "target", label: "Target Record" },
    { key: "type", label: "Log Type" },
  ];

  const renderRow = (log, index) => {
    const logTypeColor =
      log.type === "Security"
        ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40"
        : log.type === "Policy"
        ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/40"
        : "bg-accent text-foreground border-border";

    return (
      <tr key={index} className="hover:bg-accent/15 transition-colors">
        <td className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
          {new Date(log.timestamp).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        <td className="px-4 py-3 font-bold text-foreground">{log.actor}</td>
        <td className="px-4 py-3 font-medium text-foreground">{log.action}</td>
        <td className="px-4 py-3 font-medium text-muted-foreground">{log.target}</td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border tracking-wider leading-none ${logTypeColor}`}>
            {log.type}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <CrudTable
      headers={headers}
      items={logs}
      renderRow={renderRow}
      pagination={pagination}
      onPageChange={onPageChange}
    />
  );
}
export { AuditLogsTable };
