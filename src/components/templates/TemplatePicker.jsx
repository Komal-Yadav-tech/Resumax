import React, { useState } from 'react';
import { Layout, Check, ShieldCheck, AlertCircle, LayoutGrid, Sparkles } from 'lucide-react';
import { TEMPLATES, POPULAR_TEMPLATE_IDS } from './templateConstants';
import { TemplateGalleryModal } from './TemplateGalleryModal';
import { DownloadDropdown } from './DownloadDropdown';

export { TEMPLATES };

export const TemplatePicker = ({
  selectedTemplate,
  onSelectTemplate,
  onExport,
  isExporting,
  activeFormat,
  onOpenGallery
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenGallery = () => {
    if (onOpenGallery) {
      onOpenGallery();
    } else {
      setIsModalOpen(true);
    }
  };

  // Top 4 popular templates: Classic, Modern, Minimal, ATS Pro
  const popularTemplates = POPULAR_TEMPLATE_IDS.map((id) =>
    TEMPLATES.find((t) => t.id === id)
  ).filter(Boolean);

  const currentTemplateObj = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];
  const isCustomSelected = !POPULAR_TEMPLATE_IDS.includes(selectedTemplate);

  return (
    <div className="template-picker-container">
      <div className="template-picker-header">
        <div className="template-picker-title-group">
          <Layout size={16} color="var(--accent)" />
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Select Template</span>
          {isCustomSelected && (
            <span className="current-template-pill" title="Currently selected from gallery">
              Active: <strong>{currentTemplateObj.name}</strong>
            </span>
          )}
        </div>

        <div className="template-picker-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm view-all-btn-header"
            onClick={handleOpenGallery}
            title="Browse all 12 templates in full-screen gallery"
          >
            <LayoutGrid size={14} />
            <span>View All Templates (12)</span>
          </button>

          <DownloadDropdown
            onExport={onExport}
            isExporting={isExporting}
            activeFormat={activeFormat}
          />
        </div>
      </div>

      <div className="template-cards-grid">
        {popularTemplates.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;

          return (
            <button
              key={tmpl.id}
              type="button"
              className={`template-thumb-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectTemplate(tmpl.id)}
            >
              <div className="template-thumb-top">
                <span className="template-thumb-name">{tmpl.name}</span>
                {tmpl.isAtsSafe ? (
                  <span className="ats-safe-badge" title="Guaranteed ATS Compliant">
                    <ShieldCheck size={11} /> ATS Safe
                  </span>
                ) : (
                  <span className="ats-unsafe-badge" title="Stylized visual layout - not ATS guaranteed">
                    <AlertCircle size={11} /> Not ATS Safe
                  </span>
                )}
                {isSelected && (
                  <span className="template-selected-check">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              <span className="template-thumb-tagline">{tmpl.tagline}</span>
            </button>
          );
        })}

        {/* If user selected a template from the modal outside the 4 popular ones, display it as active */}
        {isCustomSelected && (
          <button
            type="button"
            className="template-thumb-card selected custom-active-card"
            onClick={handleOpenGallery}
            title="Active template selected from gallery. Click to change."
          >
            <div className="template-thumb-top">
              <span className="template-thumb-name">{currentTemplateObj.name}</span>
              {currentTemplateObj.isAtsSafe ? (
                <span className="ats-safe-badge" title="Guaranteed ATS Compliant">
                  <ShieldCheck size={11} /> ATS Safe
                </span>
              ) : (
                <span className="ats-unsafe-badge" title="Stylized visual layout - not ATS guaranteed">
                  <AlertCircle size={11} /> Not ATS Safe
                </span>
              )}
              <span className="template-selected-check">
                <Check size={12} strokeWidth={3} />
              </span>
            </div>
            <span className="template-thumb-tagline">{currentTemplateObj.tagline}</span>
          </button>
        )}

        {/* Dedicated "View All Templates" button card placed next to template cards */}
        <button
          type="button"
          className="template-thumb-card view-all-card-btn"
          onClick={handleOpenGallery}
          title="Browse all 12 templates in full gallery"
        >
          <div className="view-all-card-inner">
            <div className="view-all-icon-circle">
              <LayoutGrid size={16} />
            </div>
            <div className="view-all-text-group">
              <span className="view-all-card-title">View All Templates</span>
              <span className="view-all-card-sub">12 Modern & ATS Layouts</span>
            </div>
          </div>
        </button>
      </div>

      {/* Full Gallery Modal */}
      <TemplateGalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={onSelectTemplate}
      />
    </div>
  );
};
