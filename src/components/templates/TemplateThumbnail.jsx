import React from 'react';

/**
 * Renders an ultra-crisp miniature wireframe thumbnail of a resume template
 * showing its distinctive layout architecture (single-column, sidebar, timeline, header bars, etc.)
 */
export const TemplateThumbnail = ({ templateId }) => {
  switch (templateId) {
    case 'classic':
      return (
        <div className="thumb-wireframe thumb-classic">
          <div className="thumb-line thumb-name-center" />
          <div className="thumb-line thumb-contact-center" />
          <div className="thumb-divider" />
          <div className="thumb-heading" />
          <div className="thumb-block" />
          <div className="thumb-divider" />
          <div className="thumb-heading" />
          <div className="thumb-bullet-item" />
          <div className="thumb-bullet-item" />
          <div className="thumb-divider" />
          <div className="thumb-heading" />
          <div className="thumb-line thumb-short" />
        </div>
      );

    case 'ats-pro':
      return (
        <div className="thumb-wireframe thumb-ats-pro">
          <div className="thumb-line thumb-name-bold" />
          <div className="thumb-line thumb-contact-plain" />
          <div className="thumb-bar-header" />
          <div className="thumb-dense-block" />
          <div className="thumb-bar-header" />
          <div className="thumb-dense-item" />
          <div className="thumb-dense-item" />
          <div className="thumb-bar-header" />
          <div className="thumb-dense-item" />
        </div>
      );

    case 'ats-simple':
      return (
        <div className="thumb-wireframe thumb-ats-simple">
          <div className="thumb-line thumb-name-left" />
          <div className="thumb-line thumb-contact-plain" />
          <div className="thumb-spacer" />
          <div className="thumb-subhead-fresher">
            <span className="thumb-tag-small">EDUCATION</span>
          </div>
          <div className="thumb-block-fresher" />
          <div className="thumb-subhead-fresher">
            <span className="thumb-tag-small">PROJECTS</span>
          </div>
          <div className="thumb-block-fresher" />
          <div className="thumb-subhead-fresher">EXPERIENCE</div>
          <div className="thumb-bullet-item" />
        </div>
      );

    case 'ats-compact':
      return (
        <div className="thumb-wireframe thumb-ats-compact">
          <div className="thumb-compact-header">
            <div className="thumb-name-compact" />
            <div className="thumb-contact-inline" />
          </div>
          <div className="thumb-compact-divider" />
          <div className="thumb-compact-row"><div className="thumb-bar-mini" /><div className="thumb-bar-mini right" /></div>
          <div className="thumb-compact-bullet" />
          <div className="thumb-compact-bullet" />
          <div className="thumb-compact-divider" />
          <div className="thumb-compact-row"><div className="thumb-bar-mini" /><div className="thumb-bar-mini right" /></div>
          <div className="thumb-compact-bullet" />
          <div className="thumb-compact-bullet" />
          <div className="thumb-compact-divider" />
          <div className="thumb-compact-pills">
            <span className="thumb-micro-pill" /><span className="thumb-micro-pill" /><span className="thumb-micro-pill" />
          </div>
        </div>
      );

    case 'modern':
      return (
        <div className="thumb-wireframe thumb-modern">
          <div className="thumb-accent-band" />
          <div className="thumb-modern-header">
            <div className="thumb-name-modern" />
            <div className="thumb-role-modern" />
            <div className="thumb-pills-row">
              <span className="thumb-pill-chip" />
              <span className="thumb-pill-chip" />
            </div>
          </div>
          <div className="thumb-modern-section-pill" />
          <div className="thumb-card-block" />
          <div className="thumb-modern-section-pill" />
          <div className="thumb-card-block" />
        </div>
      );

    case 'minimal':
      return (
        <div className="thumb-wireframe thumb-minimal">
          <div className="thumb-name-minimal" />
          <div className="thumb-sub-minimal" />
          <div className="thumb-spacer-lg" />
          <div className="thumb-minimal-heading" />
          <div className="thumb-minimal-line" />
          <div className="thumb-minimal-line short" />
          <div className="thumb-spacer" />
          <div className="thumb-minimal-heading" />
          <div className="thumb-minimal-line" />
          <div className="thumb-minimal-line short" />
        </div>
      );

    case 'techstack':
      return (
        <div className="thumb-wireframe thumb-techstack">
          <div className="thumb-tech-header">
            <div className="thumb-name-tech" />
            <div className="thumb-tech-badge">DEV</div>
          </div>
          <div className="thumb-tech-pills-grid">
            <span className="thumb-tech-pill active" />
            <span className="thumb-tech-pill" />
            <span className="thumb-tech-pill" />
            <span className="thumb-tech-pill" />
            <span className="thumb-tech-pill" />
          </div>
          <div className="thumb-tech-divider" />
          <div className="thumb-heading-tech" />
          <div className="thumb-bullet-item" />
          <div className="thumb-bullet-item" />
          <div className="thumb-heading-tech" />
          <div className="thumb-bullet-item" />
        </div>
      );

    case 'corporate':
      return (
        <div className="thumb-wireframe thumb-corporate">
          <div className="thumb-corp-header-bar">
            <div className="thumb-corp-name" />
            <div className="thumb-corp-role" />
          </div>
          <div className="thumb-corp-body">
            <div className="thumb-corp-heading" />
            <div className="thumb-corp-block" />
            <div className="thumb-corp-heading" />
            <div className="thumb-corp-block" />
            <div className="thumb-corp-heading" />
            <div className="thumb-compact-pills">
              <span className="thumb-micro-pill" /><span className="thumb-micro-pill" />
            </div>
          </div>
        </div>
      );

    case 'sidebar-pro':
      return (
        <div className="thumb-wireframe thumb-sidebar-pro">
          <div className="thumb-sidebar-left">
            <div className="thumb-side-avatar" />
            <div className="thumb-side-line" />
            <div className="thumb-side-line short" />
            <div className="thumb-side-divider" />
            <div className="thumb-side-heading" />
            <div className="thumb-side-skill" />
            <div className="thumb-side-skill" />
            <div className="thumb-side-skill" />
          </div>
          <div className="thumb-sidebar-right">
            <div className="thumb-name-bold" />
            <div className="thumb-role-modern" />
            <div className="thumb-main-heading" />
            <div className="thumb-card-block" />
            <div className="thumb-main-heading" />
            <div className="thumb-bullet-item" />
          </div>
        </div>
      );

    case 'timeline':
      return (
        <div className="thumb-wireframe thumb-timeline">
          <div className="thumb-timeline-header">
            <div className="thumb-name-modern" />
            <div className="thumb-contact-inline" />
          </div>
          <div className="thumb-timeline-container">
            <div className="thumb-timeline-track">
              <div className="thumb-node node-1" />
              <div className="thumb-node node-2" />
              <div className="thumb-node node-3" />
            </div>
            <div className="thumb-timeline-content">
              <div className="thumb-timeline-item">
                <div className="thumb-badge-mini" />
                <div className="thumb-bullet-item" />
              </div>
              <div className="thumb-timeline-item">
                <div className="thumb-badge-mini" />
                <div className="thumb-bullet-item" />
              </div>
              <div className="thumb-timeline-item">
                <div className="thumb-badge-mini" />
                <div className="thumb-bullet-item" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'academic':
      return (
        <div className="thumb-wireframe thumb-academic">
          <div className="thumb-academic-header">
            <div className="thumb-academic-crest" />
            <div className="thumb-academic-title" />
          </div>
          <div className="thumb-academic-divider-double" />
          <div className="thumb-academic-heading">EDUCATION & DEGREES</div>
          <div className="thumb-academic-entry" />
          <div className="thumb-academic-heading">PUBLICATIONS & RESEARCH</div>
          <div className="thumb-academic-entry italic" />
          <div className="thumb-academic-entry italic" />
          <div className="thumb-academic-heading">TEACHING & APPOINTMENTS</div>
          <div className="thumb-academic-entry" />
        </div>
      );

    case 'creative':
      return (
        <div className="thumb-wireframe thumb-creative">
          <div className="thumb-creative-top">
            <div className="thumb-creative-box">
              <div className="thumb-name-bold" />
              <div className="thumb-creative-badge">PORTFOLIO</div>
            </div>
            <div className="thumb-creative-accent-box" />
          </div>
          <div className="thumb-creative-split">
            <div className="thumb-creative-col-left">
              <div className="thumb-color-card" />
              <div className="thumb-color-card light" />
            </div>
            <div className="thumb-creative-col-right">
              <div className="thumb-creative-header" />
              <div className="thumb-bullet-item" />
              <div className="thumb-bullet-item" />
              <div className="thumb-creative-header" />
              <div className="thumb-compact-pills">
                <span className="thumb-creative-chip" /><span className="thumb-creative-chip" />
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="thumb-wireframe thumb-classic">
          <div className="thumb-line thumb-name-center" />
          <div className="thumb-line thumb-contact-center" />
          <div className="thumb-divider" />
          <div className="thumb-heading" />
          <div className="thumb-block" />
        </div>
      );
  }
};
