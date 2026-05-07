import { useState, useRef, useEffect } from 'react';
import { FiDownload, FiChevronDown, FiFileText, FiGrid, FiFile } from 'react-icons/fi';
import Button from './Button';

export default function ExportMenu({ onExport, isExporting }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format) => {
    setIsOpen(false);
    onExport(format);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        variant="outline"
        icon={isExporting ? undefined : FiDownload}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
      >
        {isExporting ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></span>
            Exporting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Export Report <FiChevronDown />
          </span>
        )}
      </Button>

      {isOpen && !isExporting && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <button
              onClick={() => handleExport('csv')}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
            >
              <FiFileText /> CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
            >
              <FiGrid /> Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
            >
              <FiFile /> PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
