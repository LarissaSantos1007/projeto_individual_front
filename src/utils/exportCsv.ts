export function toCSV(items: any[], columns?: string[]) {
  if (!items || items.length === 0) return '';
  const keys = columns && columns.length > 0 ? columns : Object.keys(items[0]);
  const header = keys.join(',');
  const lines = items.map((it) => keys.map(k => {
    const v = it[k] === null || it[k] === undefined ? '' : String(it[k]).replace(/"/g, '""');
    return `"${v}"`;
  }).join(','));
  return [header, ...lines].join('\n');
}

export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
