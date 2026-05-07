import { useState, useContext } from 'react';
import { AlertContext } from '../contexts/AlertContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

export const useReportExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { error: showError, success } = useContext(AlertContext);

  const exportData = async ({ data, columns, filename, format }) => {
    if (!data || data.length === 0) {
      showError('No data available to export.');
      return;
    }

    setIsExporting(true);
    try {
      // Simulate slight delay for loading state visibility
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (format === 'csv') {
        exportCSV(data, columns, filename);
      } else if (format === 'excel') {
        exportExcel(data, columns, filename);
      } else if (format === 'pdf') {
        exportPDF(data, columns, filename);
      }
      success(`Report exported successfully as ${format.toUpperCase()}`);
    } catch (err) {
      console.error('Export failed:', err);
      showError(`Failed to export report as ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  const getExportableData = (data, columns) => {
    return data.map(row => {
      const exportRow = {};
      columns.forEach(col => {
        if (col.key) {
          // If the column has a specific export string representation, use it
          // Else try to fallback to raw data
          let val = row[col.key];
          
          if (col.exportRender) {
            val = col.exportRender(val, row);
          } else if (col.render) {
            const rendered = col.render(val, row);
            if (typeof rendered === 'string' || typeof rendered === 'number') {
              val = rendered;
            }
          }
          
          exportRow[col.label] = val;
        }
      });
      return exportRow;
    });
  };

  const exportCSV = (data, columns, filename) => {
    const exportableData = getExportableData(data, columns);
    const worksheet = XLSX.utils.json_to_sheet(exportableData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  };

  const exportExcel = (data, columns, filename) => {
    const exportableData = getExportableData(data, columns);
    const worksheet = XLSX.utils.json_to_sheet(exportableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const exportPDF = (data, columns, filename) => {
    const doc = new jsPDF();
    const tableColumn = columns.filter(col => col.key).map(col => col.label);
    
    const tableRows = data.map(row => {
      return columns.filter(col => col.key).map(col => {
        let val = row[col.key];
        if (col.exportRender) {
          val = col.exportRender(val, row);
        } else if (col.render) {
          const rendered = col.render(val, row);
          if (typeof rendered === 'string' || typeof rendered === 'number') {
            val = rendered;
          }
        }
        return val !== undefined && val !== null ? String(val) : '';
      });
    });

    doc.text(filename, 14, 15);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save(`${filename}.pdf`);
  };

  return { exportData, isExporting };
};
