export default function Table({
  columns = [],
  data = [],
  loading = false,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  sortable = false,
  onSort,
  sortColumn,
  sortOrder,
  hover = true,
  striped = true,
  compact = false,
}) {
  const paddingClass = compact ? 'px-4 py-2' : 'px-6 py-4';

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-secondary-200">
      <table className="w-full">
        <thead className="bg-secondary-50 border-b border-secondary-200">
          <tr>
            {selectable && (
              <th className={`${paddingClass} text-left`}>
                <input
                  type="checkbox"
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  checked={selectedRows.length === data.length && data.length > 0}
                  className="rounded border-secondary-300"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${paddingClass} text-left font-semibold text-secondary-700 cursor-pointer hover:bg-secondary-100 transition-colors`}
                onClick={() => sortable && onSort?.(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {sortable && sortColumn === column.key && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className={`${paddingClass} text-center text-secondary-500`}>
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className={`${paddingClass} text-center text-secondary-500`}
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  border-b border-secondary-200 transition-colors
                  ${striped && rowIndex % 2 === 1 ? 'bg-secondary-50' : 'bg-white'}
                  ${hover ? 'hover:bg-primary-50' : ''}
                `}
              >
                {selectable && (
                  <td className={paddingClass}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(rowIndex)}
                      onChange={(e) => onSelectRow?.(rowIndex, e.target.checked)}
                      className="rounded border-secondary-300"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column.key}`} className={`${paddingClass} text-secondary-900`}>
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
