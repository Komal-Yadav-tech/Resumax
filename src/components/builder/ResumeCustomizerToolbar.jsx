import React, { useState } from 'react';
import {
  Palette,
  Sliders,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Camera,
  Image,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Check,
  Type,
  Layout as LayoutIcon,
  Columns,
  Square,
  FileCheck2,
  Edit3
} from 'lucide-react';
import { BASE_SECTIONS } from '../templates/templateData';

const FONT_OPTIONS = [
  { id: 'Inter', name: 'Inter (Modern Sans)' },
  { id: 'Arial', name: 'Arial (Clean ATS)' },
  { id: 'Calibri', name: 'Calibri (Professional)' },
  { id: 'Times New Roman', name: 'Times New Roman (Classic Serif)' },
  { id: 'Georgia', name: 'Georgia (Editorial)' },
  { id: 'Roboto', name: 'Roboto (Geometric)' },
  { id: 'Outfit', name: 'Outfit (Contemporary)' },
  { id: 'JetBrains Mono', name: 'JetBrains Mono (Tech Code)' }
];

const COLOR_OPTIONS = [
  { id: 'blue', label: 'Royal Blue', hex: '#2563EB' },
  { id: 'black', label: 'Slate Black', hex: '#0F172A' },
  { id: 'green', label: 'Emerald Green', hex: '#059669' },
  { id: 'purple', label: 'Violet Purple', hex: '#7C3AED' },
  { id: 'teal', label: 'Teal Cyan', hex: '#0D9488' },
  { id: 'navy', label: 'Deep Navy', hex: '#1E3A8A' }
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
];

export const ResumeCustomizerToolbar = ({
  customizations,
  setCustomizations,
  answers,
  setAnswers,
  zoomLevel = 1,
  setZoomLevel
}) => {
  const [activeTab, setActiveTab] = useState('styles'); // 'styles' | 'sections' | 'edit'
  const [isExpanded, setIsExpanded] = useState(false);

  // Update customization field
  const updateCustomization = (key, value) => {
    setCustomizations((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Toggle section visibility (skip / show)
  const toggleSection = (sectionId) => {
    setCustomizations((prev) => {
      const hidden = { ...(prev.hiddenSections || {}) };
      hidden[sectionId] = !hidden[sectionId];
      return {
        ...prev,
        hiddenSections: hidden
      };
    });
  };

  // Reorder sections
  const moveSection = (index, direction) => {
    const list = [...(customizations.sectionOrder || BASE_SECTIONS.map((s) => s.id))];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    updateCustomization('sectionOrder', list);
  };

  // Photo upload handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateCustomization('photoUrl', reader.result);
        updateCustomization('showPhoto', true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updateCustomization('showPhoto', false);
    updateCustomization('photoUrl', '');
  };

  const currentOrder = customizations.sectionOrder || BASE_SECTIONS.map((s) => s.id);

  return (
    <div className="resume-customizer-root">
      {/* Top Quick Bar */}
      <div className="customizer-quick-bar">
        <div className="customizer-tab-buttons">
          <button
            type="button"
            className={`customizer-tab-btn ${isExpanded && activeTab === 'styles' ? 'active' : ''}`}
            onClick={() => {
              if (isExpanded && activeTab === 'styles') {
                setIsExpanded(false);
              } else {
                setIsExpanded(true);
                setActiveTab('styles');
              }
            }}
          >
            <Palette size={14} />
            <span>Customize Styling</span>
          </button>

          <button
            type="button"
            className={`customizer-tab-btn ${isExpanded && activeTab === 'sections' ? 'active' : ''}`}
            onClick={() => {
              if (isExpanded && activeTab === 'sections') {
                setIsExpanded(false);
              } else {
                setIsExpanded(true);
                setActiveTab('sections');
              }
            }}
          >
            <Sliders size={14} />
            <span>Sections & Skip</span>
          </button>
        </div>

        {/* 1-Page Guaranteed Badge & Zoom */}
        <div className="customizer-right-controls">
          <span className="one-page-badge" title="Guaranteed single-page A4 canvas with dynamic auto-shrink">
            <FileCheck2 size={13} color="#10B981" />
            <span>1-Page Guaranteed</span>
          </span>

          <div className="zoom-controls-group">
            <button
              type="button"
              className="zoom-btn"
              onClick={() => setZoomLevel && setZoomLevel((z) => Math.max(0.5, z - 0.1))}
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="zoom-label">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              className="zoom-btn"
              onClick={() => setZoomLevel && setZoomLevel((z) => Math.min(1.3, z + 0.1))}
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              className="zoom-btn"
              onClick={() => setZoomLevel && setZoomLevel(1)}
              title="Reset Zoom to 100%"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Controls Drawer */}
      {isExpanded && (
        <div className="customizer-drawer">
          {/* TAB 1: STYLES */}
          {activeTab === 'styles' && (
            <div className="customizer-grid">
              {/* 1. Font Style */}
              <div className="customizer-group">
                <label className="customizer-label">
                  <Type size={13} /> Font Style
                </label>
                <select
                  className="customizer-select"
                  value={customizations.fontStyle || 'Inter'}
                  onChange={(e) => updateCustomization('fontStyle', e.target.value)}
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Font Size */}
              <div className="customizer-group">
                <label className="customizer-label">Font Size</label>
                <div className="customizer-pill-group">
                  {['Small', 'Medium', 'Large'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      className={`customizer-pill-btn ${(customizations.fontSize || 'Medium') === sz ? 'active' : ''}`}
                      onClick={() => updateCustomization('fontSize', sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Theme Color */}
              <div className="customizer-group">
                <label className="customizer-label">Theme Color</label>
                <div className="customizer-color-swatches">
                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = (customizations.themeColor || 'blue') === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        className={`color-swatch-btn ${isSelected ? 'selected' : ''}`}
                        style={{ backgroundColor: c.hex }}
                        onClick={() => updateCustomization('themeColor', c.id)}
                        title={c.label}
                      >
                        {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Layout */}
              <div className="customizer-group">
                <label className="customizer-label">
                  <LayoutIcon size={13} /> Layout Mode
                </label>
                <div className="customizer-pill-group">
                  <button
                    type="button"
                    className={`customizer-pill-btn ${(customizations.layout || 'default') === 'default' ? 'active' : ''}`}
                    onClick={() => updateCustomization('layout', 'default')}
                  >
                    Template Default
                  </button>
                  <button
                    type="button"
                    className={`customizer-pill-btn ${(customizations.layout || 'default') === 'single' ? 'active' : ''}`}
                    onClick={() => updateCustomization('layout', 'single')}
                  >
                    <Square size={12} /> Single
                  </button>
                  <button
                    type="button"
                    className={`customizer-pill-btn ${(customizations.layout || 'default') === 'two-column' ? 'active' : ''}`}
                    onClick={() => updateCustomization('layout', 'two-column')}
                  >
                    <Columns size={12} /> Two-Column
                  </button>
                </div>
              </div>

              {/* 5. Spacing */}
              <div className="customizer-group">
                <label className="customizer-label">Spacing & Margins</label>
                <div className="customizer-pill-group">
                  {['Compact', 'Normal', 'Spacious'].map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      className={`customizer-pill-btn ${(customizations.spacing || 'Normal') === sp ? 'active' : ''}`}
                      onClick={() => updateCustomization('spacing', sp)}
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Photo: Add or Remove */}
              <div className="customizer-group customizer-photo-group">
                <label className="customizer-label">
                  <Camera size={13} /> Candidate Photo
                </label>
                <div className="photo-actions-row">
                  <label className="btn btn-outline btn-xs photo-upload-btn">
                    <Image size={12} />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {customizations.showPhoto && customizations.photoUrl ? (
                    <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      onClick={removePhoto}
                      title="Remove Photo"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      onClick={() => {
                        updateCustomization('photoUrl', PRESET_AVATARS[0]);
                        updateCustomization('showPhoto', true);
                      }}
                    >
                      Use Avatar
                    </button>
                  )}
                </div>

                {customizations.showPhoto && customizations.photoUrl && (
                  <div className="photo-preview-thumbnail">
                    <img src={customizations.photoUrl} alt="Candidate" />
                    <span className="photo-active-tag">Active on resume</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SECTIONS & SKIP */}
          {activeTab === 'sections' && (
            <div className="customizer-sections-panel">
              <p className="customizer-help-text">
                Toggle any section on or off to skip it. Use the arrows to reorder sections.
              </p>
              <div className="customizer-sections-list">
                {currentOrder.map((sectionId, idx) => {
                  const secObj = BASE_SECTIONS.find((s) => s.id === sectionId) || {
                    id: sectionId,
                    name: sectionId.charAt(0).toUpperCase() + sectionId.slice(1)
                  };
                  const isHidden = Boolean(customizations.hiddenSections?.[sectionId]);

                  return (
                    <div
                      key={sectionId}
                      className={`customizer-section-item ${isHidden ? 'is-skipped' : ''}`}
                    >
                      <div className="section-item-left">
                        <button
                          type="button"
                          className={`section-visibility-toggle ${!isHidden ? 'visible' : 'skipped'}`}
                          onClick={() => toggleSection(sectionId)}
                          title={isHidden ? 'Click to Include section' : 'Click to Skip section'}
                        >
                          {!isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <span className="section-item-name">
                          {secObj.name}
                          {isHidden && <span className="skipped-tag">(Skipped)</span>}
                        </span>
                      </div>

                      <div className="section-order-btns">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveSection(idx, -1)}
                          className="order-btn"
                          title="Move Up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === currentOrder.length - 1}
                          onClick={() => moveSection(idx, 1)}
                          className="order-btn"
                          title="Move Down"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="customizer-panel-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-xs"
                  onClick={() => updateCustomization('hiddenSections', {})}
                >
                  Show All Sections
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-xs"
                  onClick={() =>
                    updateCustomization(
                      'sectionOrder',
                      BASE_SECTIONS.map((s) => s.id)
                    )
                  }
                >
                  Reset Order
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
