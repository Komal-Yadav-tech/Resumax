import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, FileCode, FileCheck, Loader2 } from 'lucide-react';

export const DownloadDropdown = ({ onExport, isExporting, activeFormat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelectFormat = (format) => {
    setIsOpen(false);
    onExport(format);
  };

  return (
    <div className="download-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="btn btn-primary btn-sm download-dropdown-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isExporting}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Download resume in multiple formats"
      >
        {isExporting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>
              {activeFormat === 'pdf'
                ? 'Exporting PDF...'
                : activeFormat === 'docx'
                ? 'Building DOCX...'
                : 'Saving TXT...'}
            </span>
          </>
        ) : (
          <>
            <Download size={14} />
            <span>Download</span>
            <ChevronDown size={14} className={`chevron-icon ${isOpen ? 'open' : ''}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div className="download-dropdown-menu" role="menu">
          <div className="dropdown-menu-header">Export Format</div>

          <button
            type="button"
            className="dropdown-menu-item"
            role="menuitem"
            onClick={() => handleSelectFormat('pdf')}
          >
            <div className="menu-item-icon pdf-icon">
              <FileCheck size={16} />
            </div>
            <div className="menu-item-info">
              <span className="menu-item-title">Download as PDF</span>
              <span className="menu-item-desc">ATS-friendly layout & high-res print document</span>
            </div>
            <span className="menu-item-badge">.pdf</span>
          </button>

          <button
            type="button"
            className="dropdown-menu-item"
            role="menuitem"
            onClick={() => handleSelectFormat('docx')}
          >
            <div className="menu-item-icon docx-icon">
              <FileText size={16} />
            </div>
            <div className="menu-item-info">
              <span className="menu-item-title">Download as DOCX</span>
              <span className="menu-item-desc">Editable in Microsoft Word & Google Docs</span>
            </div>
            <span className="menu-item-badge">.docx</span>
          </button>

          <button
            type="button"
            className="dropdown-menu-item"
            role="menuitem"
            onClick={() => handleSelectFormat('txt')}
          >
            <div className="menu-item-icon txt-icon">
              <FileCode size={16} />
            </div>
            <div className="menu-item-info">
              <span className="menu-item-title">Download as TXT</span>
              <span className="menu-item-desc">Raw plain text for online job portals</span>
            </div>
            <span className="menu-item-badge">.txt</span>
          </button>
        </div>
      )}
    </div>
  );
};
