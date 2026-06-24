export function exportToCSV(data: any[], filename: string) {
  if (!data || !data.length) {
    console.warn('No data available to export');
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);

  // Convert objects to CSV string
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map((row) =>
      headers
        .map((fieldName) => {
          let cellValue = row[fieldName] ?? '';
          
          // Stringify if it's an object
          if (typeof cellValue === 'object') {
            cellValue = JSON.stringify(cellValue);
          } else {
            cellValue = String(cellValue);
          }

          // Escape quotes and wrap in quotes if there's a comma or quote
          if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
            cellValue = `"${cellValue.replace(/"/g, '""')}"`;
          }

          return cellValue;
        })
        .join(',')
    ),
  ].join('\n');

  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
