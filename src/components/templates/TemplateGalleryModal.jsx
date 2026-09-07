import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, AlertCircle, Check, Search, Sparkles, Filter, ArrowLeft } from 'lucide-react';
import { TEMPLATES } from './templateConstants';
import { TemplateThumbnail } from './TemplateThumbnail';

export const TemplateGalleryModal = ({
  isOpen,
  onClose,
  selectedTemplate,
  onSelectTemplate,
  isFullScreenPage = false
}) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'ats' | 'creative'
  const [searchQuery, setSearchQuery] = useState('');
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll only if rendered as an overlay popup, not when full-screen page
  useEffect(() => {
    if (isOpen && !isFullScreenPage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isFullScreenPage]);

  if (!isOpen) return null;

  // Filter templates
  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'ats'
        ? t.isAtsSafe
        : !t.isAtsSafe;

    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.tagline.toLowerCase().includes(query) ||
      (t.structure && t.structure.toLowerCase().includes(query));

    return matchesFilter && matchesQuery;
  });

  const handleSelect = (templateId) => {
    onSelectTemplate(templateId);
    onClose();
  };

  const content = (
    <div
      className={isFullScreenPage ? 'template-fullscreen-container' : 'template-modal-container'}
      ref={modalRef}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal / Page Header */}
      <div className={isFullScreenPage ? 'template-fullscreen-header' : 'template-modal-header'}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

          <div className="template-modal-title-group">
            <div className="template-modal-badge">
              <Sparkles size={14} /> Resume Gallery
            </div>
            <h1 id="template-gallery-title" className="template-modal-title">
              Choose Your Resume Template
            </h1>
            <p className="template-modal-subtitle">
              Select from 12 ATS-optimized and visually engaging layouts. All layouts dynamically render your live resume data.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="template-modal-close-btn"
          onClick={onClose}
          aria-label="Close template gallery"
          title="Close and return to Builder"
        >
          <X size={20} />
        </button>
      </div>

      {/* Filter Controls & Search */}
      <div className="template-modal-toolbar">
        <div className="template-filter-tabs">
          <button
            type="button"
            className={`template-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Templates <span className="filter-count">12</span>
          </button>
          <button
            type="button"
            className={`template-filter-btn ${filter === 'ats' ? 'active' : ''}`}
            onClick={() => setFilter('ats')}
          >
            <ShieldCheck size={13} /> ATS Safe <span className="filter-count">5</span>
          </button>
          <button
            type="button"
            className={`template-filter-btn ${filter === 'creative' ? 'active' : ''}`}
            onClick={() => setFilter('creative')}
          >
            <AlertCircle size={13} /> Modern & Visual <span className="filter-count">7</span>
          </button>
        </div>

        <div className="template-search-wrapper">
          <Search size={14} className="template-search-icon" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="template-search-input"
          />
        </div>
      </div>

      {/* Gallery Grid (3-4 desktop, 1-2 mobile) */}
      <div className={isFullScreenPage ? 'template-fullscreen-body' : 'template-modal-body'}>
        <div className="template-gallery-grid">
          {filteredTemplates.map((tmpl) => {
            const isSelected = selectedTemplate === tmpl.id;

            return (
              <div
                key={tmpl.id}
                className={`template-gallery-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(tmpl.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelect(tmpl.id);
                  }
                }}
              >
                {/* Thumbnail Preview Wireframe */}
                <div className="template-gallery-thumb-box">
                  <TemplateThumbnail templateId={tmpl.id} />
                  {isSelected && (
                    <div className="template-selected-overlay">
                      <span className="template-selected-chip">
                        <Check size={13} strokeWidth={3} /> Active Template
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="template-gallery-card-content">
                  <div className="template-gallery-card-top">
                    <h3 className="template-gallery-name">{tmpl.name}</h3>
                    {tmpl.isAtsSafe ? (
                      <span className="ats-safe-badge" title="Guaranteed ATS Compliant">
                        <ShieldCheck size={11} /> ATS Safe
                      </span>
                    ) : (
                      <span className="ats-unsafe-badge" title="Stylized visual layout - not ATS guaranteed">
                        <AlertCircle size={11} /> Not ATS Safe
                      </span>
                    )}
                  </div>

                  <p className="template-gallery-tagline">"{tmpl.tagline}"</p>
                  <p className="template-gallery-desc">{tmpl.description}</p>

                  <button
                    type="button"
                    className={`template-select-action-btn ${isSelected ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(tmpl.id);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Check size={13} strokeWidth={3} /> Selected
                      </>
                    ) : (
                      'Use This Template'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="template-empty-state">
            <p>No templates found matching "{searchQuery}".</p>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Modal / Page Footer Note */}
      <div className="template-modal-footer">
        <div className="template-footer-tip">
          <ShieldCheck size={15} color="var(--success)" />
          <span>
            <strong>ATS Tip:</strong> ATS-Safe templates use single-column layouts and standard header conventions to guarantee 99%+ parsing accuracy.
          </span>
        </div>
      </div>
    </div>
  );

  if (isFullScreenPage) {
    return <div className="template-fullscreen-page">{content}</div>;
  }

  return (
    <div
      className="template-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-gallery-title"
    >
      {content}
    </div>
  );
};
