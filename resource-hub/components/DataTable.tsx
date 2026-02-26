interface Column {
  key: string;
  header: string;
}

interface DataTableProps {
  columns: Column[];
  rows: Record<string, string | number>[];
  className?: string;
}

export default function DataTable({ columns, rows, className = "" }: DataTableProps) {
  return (
    <div
      className={`overflow-x-auto rounded-lg border border-white/10 ${className}`}
      style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
    >
      <table className="w-full min-w-[400px] border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-sm font-medium text-wise-white/80 border-b border-white/10"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex === rows.length - 1 && "Average" in row
                  ? "bg-white/5 font-medium"
                  : "border-b border-white/5"
              }
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm text-wise-white/90"
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
