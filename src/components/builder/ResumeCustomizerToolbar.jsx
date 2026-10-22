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
  Edit3,
  RotateCcw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  GripVertical
} from 'lucide-react';
import { BASE_SECTIONS } from '../templates/templateData';
import { DEFAULT_DESIGN_CUSTOMIZATIONS } from '../../services/resumeStorageService';

const FONT_OPTIONS = [
  { id: 'Inter', name: 'Inter (Modern Sans)' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Crisp Modern)' },
  { id: 'Roboto', name: 'Roboto (Clean Geometric)' },
  { id: 'Outfit', name: 'Outfit (Contemporary Editorial)' },
  { id: 'Arial', name: 'Arial (ATS Standard Sans)' },
  { id: 'Calibri', name: 'Calibri (Executive Classic)' },
  { id: 'Times New Roman', name: 'Times New Roman (Academic Serif)' },
  { id: 'Georgia', name: 'Georgia (Distinguished Serif)' },
  { id: 'Playfair Display', name: 'Playfair Display (Luxury Serif)' },
  { id: 'JetBrains Mono', name: 'JetBrains Mono (Developer Tech)' }
];

const COLOR_OPTIONS = [
  { id: 'blue', label: 'Royal Blue', hex: '#2563EB' },
  { id: 'navy', label: 'Deep Navy', hex: '#1E3A8A' },
  { id: 'teal', label: 'Teal Cyan', hex: '#0D9488' },
  { id: 'green', label: 'Emerald Green', hex: '#059669' },
  { id: 'purple', label: 'Violet Purple', hex: '#7C3AED' },
  { id: 'crimson', label: 'Ruby Crimson', hex: '#E11D48' },
  { id: 'amber', label: 'Warm Amber', hex: '#D97706' },
  { id: 'black', label: 'Slate Black', hex: '#0F172A' }
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
  const [activeTab, setActiveTab] = useState('styles'); // 'styles' | 'sections'
  const [styleSubTab, setStyleSubTab] = useState('colors'); // 'colors' | 'typography' | 'layout' | 'decoration'
  const [isExpanded, setIsExpanded] = useState(false);
  const [customHexInput, setCustomHexInput] = useState(customizations?.customHexColor || '');
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);

  // Update customization field
  const updateCustomization = (key, value) => {
    setCustomizations((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset to template defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all design settings to clean template defaults? Your resume text will not be changed.')) {
      setCustomizations(DEFAULT_DESIGN_CUSTOMIZATIONS);
      setCustomHexInput('');
    }
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

  // Drag and drop handlers for section reordering
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    const list = [...(customizations.sectionOrder || BASE_SECTIONS.map((s) => s.id))];
    const item = list.splice(draggedIdx, 1)[0];
    list.splice(index, 0, item);
    setDraggedIdx(index);
    updateCustomization('sectionOrder', list);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  // Add custom section
  const handleAddCustomSection = (e) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    const customId = `custom_${Date.now()}`;
    const newSection = {
      id: customId,
      name: newSectionTitle.trim(),
      content: ''
    };

    if (setAnswers) {
      setAnswers((prev) => ({
        ...prev,
        customSections: [...(prev.customSections || []), newSection]
      }));
    }

    const currentOrder = customizations.sectionOrder || BASE_SECTIONS.map((s) => s.id);
    updateCustomization('sectionOrder', [...currentOrder, customId]);
    setNewSectionTitle('');
    setShowAddCustomModal(false);
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

  // Custom HEX change
  const handleHexInput = (hexVal) => {
    setCustomHexInput(hexVal);
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hexVal)) {
      updateCustomization('customHexColor', hexVal);
    }
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
            <span>Design Studio</span>
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
            <span>Sections & Layout</span>
          </button>
        </div>

        {/* Right Controls: Reset Defaults & Zoom */}
        <div className="customizer-right-controls">
          <button
            type="button"
            className="btn btn-outline btn-xs"
            onClick={handleResetDefaults}
            title="Reset all styling options to template defaults"
          >
            <RotateCcw size={12} />
            <span>Reset Defaults</span>
          </button>

          <div className="zoom-controls-group">
            <button
              type="button"
              className="zoom-btn"
              onClick={() => setZoomLevel && setZoomLevel((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="zoom-label">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              className="zoom-btn"
              onClick={() => setZoomLevel && setZoomLevel((z) => Math.min(1.4, Number((z + 0.1).toFixed(2))))}
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              className="zoom-btn"
              onClick={() => {
                if (!setZoomLevel) return;
                const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
                if (width <= 480) setZoomLevel(0.45);
                else if (width <= 768) setZoomLevel(0.60);
                else if (width <= 1024) setZoomLevel(0.72);
                else setZoomLevel(0.85);
              }}
              title="Fit to Screen"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Controls Drawer */}
      {isExpanded && (
        <div className="customizer-drawer">
          {/* TAB 1: DESIGN STUDIO */}
          {activeTab === 'styles' && (
            <div>
              {/* Subnav Tabs */}
              <div className="customizer-subnav">
                <button
                  type="button"
                  className={`customizer-subnav-btn ${styleSubTab === 'colors' ? 'active' : ''}`}
                  onClick={() => setStyleSubTab('colors')}
                >
                  <Palette size={13} />
                  <span>Colors</span>
                </button>
                <button
                  type="button"
                  className={`customizer-subnav-btn ${styleSubTab === 'typography' ? 'active' : ''}`}
                  onClick={() => setStyleSubTab('typography')}
                >
                  <Type size={13} />
                  <span>Typography</span>
                </button>
                <button
                  type="button"
                  className={`customizer-subnav-btn ${styleSubTab === 'layout' ? 'active' : ''}`}
                  onClick={() => setStyleSubTab('layout')}
                >
                  <LayoutIcon size={13} />
                  <span>Page & Spacing</span>
                </button>
                <button
                  type="button"
                  className={`customizer-subnav-btn ${styleSubTab === 'decoration' ? 'active' : ''}`}
                  onClick={() => setStyleSubTab('decoration')}
                >
                  <Sparkles size={13} />
                  <span>Headings & Dividers</span>
                </button>
              </div>

              {/* Sub-tab 1: Colors */}
              {styleSubTab === 'colors' && (
                <div className="customizer-grid">
                  <div className="customizer-group" style={{ gridColumn: 'span 2' }}>
                    <label className="customizer-label">Theme Color Presets</label>
                    <div className="customizer-color-row">
                      <div className="customizer-color-swatches">
                        {COLOR_OPTIONS.map((c) => {
                          const isSelected =
                            !customizations.customHexColor && (customizations.themeColor || 'blue') === c.id;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              className={`color-swatch-btn ${isSelected ? 'selected' : ''}`}
                              style={{ backgroundColor: c.hex }}
                              onClick={() => {
                                updateCustomization('themeColor', c.id);
                                updateCustomization('customHexColor', '');
                                setCustomHexInput('');
                              }}
                              title={c.label}
                            >
                              {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom HEX Color Picker */}
                      <div className="custom-hex-input-group" title="Choose custom HEX color">
                        <input
                          type="color"
                          className="custom-hex-picker"
                          value={customizations.customHexColor || '#2563EB'}
                          onChange={(e) => handleHexInput(e.target.value)}
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>HEX</span>
                        <input
                          type="text"
                          className="custom-hex-text-input"
                          placeholder="#2563EB"
                          value={customHexInput}
                          onChange={(e) => handleHexInput(e.target.value)}
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Typography */}
              {styleSubTab === 'typography' && (
                <div className="customizer-grid">
                  {/* Font Family */}
                  <div className="customizer-group">
                    <label className="customizer-label">
                      <Type size={13} /> Font Family
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

                  {/* Font Size */}
                  <div className="customizer-group">
                    <label className="customizer-label">Font Scale</label>
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

                  {/* Font Weight: Body */}
                  <div className="customizer-group">
                    <label className="customizer-label">Body Text Weight</label>
                    <div className="customizer-pill-group">
                      {['Normal', 'Medium', 'Semi-Bold'].map((wt) => (
                        <button
                          key={wt}
                          type="button"
                          className={`customizer-pill-btn ${(customizations.fontWeight || 'Normal') === wt ? 'active' : ''}`}
                          onClick={() => updateCustomization('fontWeight', wt)}
                        >
                          {wt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Weight: Headings */}
                  <div className="customizer-group">
                    <label className="customizer-label">Headings Weight</label>
                    <div className="customizer-pill-group">
                      {['Normal', 'Semi-Bold', 'Bold', 'Extra-Bold'].map((wt) => (
                        <button
                          key={wt}
                          type="button"
                          className={`customizer-pill-btn ${(customizations.headingWeight || 'Bold') === wt ? 'active' : ''}`}
                          onClick={() => updateCustomization('headingWeight', wt)}
                        >
                          {wt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Line Spacing */}
                  <div className="customizer-group">
                    <label className="customizer-label">Line Spacing</label>
                    <div className="customizer-pill-group">
                      {['Tight', 'Normal', 'Relaxed'].map((lh) => (
                        <button
                          key={lh}
                          type="button"
                          className={`customizer-pill-btn ${(customizations.lineHeight || 'Normal') === lh ? 'active' : ''}`}
                          onClick={() => updateCustomization('lineHeight', lh)}
                        >
                          {lh}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Page & Spacing */}
              {styleSubTab === 'layout' && (
                <div className="customizer-grid">
                  {/* Page Size: A4 vs Letter */}
                  <div className="customizer-group">
                    <label className="customizer-label">Page Paper Format</label>
                    <div className="customizer-pill-group">
                      <button
                        type="button"
                        className={`customizer-pill-btn ${(customizations.pageSize || 'a4') === 'a4' ? 'active' : ''}`}
                        onClick={() => updateCustomization('pageSize', 'a4')}
                      >
                        A4 (International)
                      </button>
                      <button
                        type="button"
                        className={`customizer-pill-btn ${(customizations.pageSize || 'a4') === 'letter' ? 'active' : ''}`}
                        onClick={() => updateCustomization('pageSize', 'letter')}
                      >
                        US Letter (USA/CA)
                      </button>
                    </div>
                  </div>

                  {/* Page Margins */}
                  <div className="customizer-group">
                    <label className="customizer-label">Page Margins</label>
                    <div className="customizer-pill-group">
                      {['Narrow', 'Normal', 'Wide'].map((mg) => (
                        <button
                          key={mg}
                          type="button"
                          className={`customizer-pill-btn ${(customizations.pageMargin || 'Normal') === mg ? 'active' : ''}`}
                          onClick={() => updateCustomization('pageMargin', mg)}
                        >
                          {mg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section Spacing */}
                  <div className="customizer-group">
                    <label className="customizer-label">Section Spacing</label>
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

                  {/* Column Layout */}
                  <div className="customizer-group">
                    <label className="customizer-label">Column Layout</label>
                    <div className="customizer-pill-group">
                      <button
                        type="button"
                        className={`customizer-pill-btn ${(customizations.layout || 'default') === 'default' ? 'active' : ''}`}
                        onClick={() => updateCustomization('layout', 'default')}
                      >
                        Default
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
                </div>
              )}

              {/* Sub-tab 4: Headings, Dividers, Icons & Header */}
              {styleSubTab === 'decoration' && (
                <div className="customizer-grid">
                  {/* Heading Style */}
                  <div className="customizer-group">
                    <label className="customizer-label">Heading Style</label>
                    <select
                      className="customizer-select"
                      value={customizations.headingStyle || 'standard'}
                      onChange={(e) => updateCustomization('headingStyle', e.target.value)}
                    >
                      <option value="standard">Standard (Default)</option>
                      <option value="uppercase">ALL-CAPS Uppercase</option>
                      <option value="underline">Accent Underline</option>
                      <option value="left-accent">Left Accent Bar</option>
                      <option value="highlight-badge">Soft Highlight Badge</option>
                    </select>
                  </div>

                  {/* Divider Style */}
                  <div className="customizer-group">
                    <label className="customizer-label">Divider Lines</label>
                    <select
                      className="customizer-select"
                      value={customizations.dividerStyle || 'solid'}
                      onChange={(e) => updateCustomization('dividerStyle', e.target.value)}
                    >
                      <option value="solid">Solid Line</option>
                      <option value="dashed">Dashed Line</option>
                      <option value="dotted">Dotted Line</option>
                      <option value="gradient">Gradient Fade</option>
                      <option value="double">Double Line</option>
                      <option value="none">No Divider Lines</option>
                    </select>
                  </div>

                  {/* Header Alignment */}
                  <div className="customizer-group">
                    <label className="customizer-label">Header Alignment</label>
                    <div className="customizer-pill-group">
                      <button
                        type="button"
                        className={`customizer-pill-btn ${(customizations.headerAlign || 'center') === 'left' ? 'active' : ''}`}
                        onClick={() => updateCustomization('headerAlign', 'left')}
                      >
                        <AlignLeft size={12} /> Left
                      </button>
                      <button
                        type="button"
                        className={`customizer-pill-btn ${(customizations.headerAlign || 'center') === 'center' ? 'active' : ''}`}
                        onClick={() => updateCustomization('headerAlign', 'center')}
                      >
                        <AlignCenter size={12} /> Center
                      </button>
                      <button
                        type="button"
                        className={`customizer-pill-btn ${(customizations.headerAlign || 'center') === 'right' ? 'active' : ''}`}
                        onClick={() => updateCustomization('headerAlign', 'right')}
                      >
                        <AlignRight size={12} /> Right
                      </button>
                    </div>
                  </div>

                  {/* Icons Toggle & Style */}
                  <div className="customizer-group">
                    <label className="customizer-label">Icons Visibility & Style</label>
                    <div className="customizer-pill-group">
                      <button
                        type="button"
                        className={`customizer-pill-btn ${customizations.showIcons !== false ? 'active' : ''}`}
                        onClick={() => updateCustomization('showIcons', true)}
                      >
                        Show Icons
                      </button>
                      <button
                        type="button"
                        className={`customizer-pill-btn ${customizations.showIcons === false ? 'active' : ''}`}
                        onClick={() => updateCustomization('showIcons', false)}
                      >
                        Hide Icons
                      </button>
                    </div>
                  </div>

                  {/* Candidate Photo */}
                  <div className="customizer-group customizer-photo-group" style={{ gridColumn: 'span 2' }}>
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
            </div>
          )}

          {/* TAB 2: SECTIONS & DRAG REORDERING */}
          {activeTab === 'sections' && (
            <div className="customizer-sections-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <p className="customizer-help-text" style={{ margin: 0 }}>
                  Drag items or use the arrows to reorder sections. Toggle eye icon to skip.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-xs"
                  onClick={() => setShowAddCustomModal(true)}
                >
                  <Plus size={12} /> Add Custom Section
                </button>
              </div>

              {/* Add Custom Section Form Modal / Banner */}
              {showAddCustomModal && (
                <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '0.75rem' }}>
                  <form onSubmit={handleAddCustomSection} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.825rem', padding: '0.35rem 0.6rem' }}
                      placeholder="e.g. Volunteer Work, Publications, Patents..."
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="btn btn-primary btn-sm">
                      Add
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setShowAddCustomModal(false)}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}

              <div className="customizer-sections-list">
                {currentOrder.map((sectionId, idx) => {
                  const baseSec = BASE_SECTIONS.find((s) => s.id === sectionId);
                  const customSec = (answers?.customSections || []).find((s) => s.id === sectionId);
                  const sectionName = baseSec ? baseSec.name : customSec ? customSec.name : sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
                  const isHidden = Boolean(customizations.hiddenSections?.[sectionId]);

                  return (
                    <div
                      key={sectionId}
                      className={`drag-section-item ${draggedIdx === idx ? 'dragging' : ''} ${isHidden ? 'is-skipped' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="section-item-left" style={{ display: 'flex', alignItems: 'center' }}>
                        <GripVertical size={14} className="drag-handle" title="Drag to reorder" />
                        <button
                          type="button"
                          className={`section-visibility-toggle ${!isHidden ? 'visible' : 'skipped'}`}
                          onClick={() => toggleSection(sectionId)}
                          title={isHidden ? 'Click to Include section' : 'Click to Skip section'}
                        >
                          {!isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <span className="section-item-name" style={{ marginLeft: '0.4rem', fontSize: '0.825rem' }}>
                          {sectionName}
                          {isHidden && <span className="skipped-tag" style={{ marginLeft: '0.3rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>(Skipped)</span>}
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

              <div className="customizer-panel-footer" style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
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
                  Reset Section Order
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
