import React from 'react';
import { ResumeCanvasWrapper } from './ResumeCanvasWrapper';
import { normalizeResumeData, isSectionVisible } from './templateData';

export const TimelineTemplate = ({ answers, generatedContent, customizations = {} }) => {
  const data = normalizeResumeData(answers, generatedContent);
  const {
    fullName,
    targetJobTitle,
    contact,
    summary,
    experience,
    education,
    milestones,
    volunteering,
    awards,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    photo
  } = data;

  const showPhoto = customizations.showPhoto && (customizations.photoUrl || photo);
  const photoSrc = customizations.photoUrl || photo;

  return (
    <ResumeCanvasWrapper templateId="timeline" customizations={customizations} className="timeline-template">
      {/* Timeline Header */}
      <header className="timeline-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="timeline-name">{fullName}</h1>
            <div className="timeline-role">{targetJobTitle}</div>
          </div>
          {showPhoto && (
            <img src={photoSrc} alt={fullName} className="resume-candidate-photo timeline-photo" />
          )}
        </div>
        <div className="timeline-contact">
          {[contact.email, contact.phone, contact.location, contact.website, contact.github]
            .filter(Boolean)
            .join('  •  ')}
        </div>
      </header>

      {/* Base: Summary */}
      {isSectionVisible('summary', customizations) && summary && (
        <section className="timeline-section-plain">
          <p className="timeline-summary-text">{summary}</p>
        </section>
      )}

      {/* Timeline Extra: Career Timeline Nodes with Vertical Track & Year Dots */}
      {isSectionVisible('experience', customizations) && experience?.length > 0 && (
        <section className="timeline-section">
          <h2 className="timeline-heading">CAREER TIMELINE</h2>
          <div className="timeline-track">
            {experience.map((exp, idx) => {
              const bullets = exp.generatedBullets ||
                (exp.achievements
                  ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                  : [`Led system implementations and team delivery at ${exp.company || 'Enterprise'}.`]);

              return (
                <div key={exp.id || idx} className="timeline-node">
                  <div className="timeline-node-dot" />
                  <div className="timeline-node-content">
                    <div className="timeline-node-header">
                      <strong className="timeline-node-title">{exp.role}</strong>
                      <span className="timeline-year-badge">{exp.duration}</span>
                    </div>
                    <div className="timeline-node-sub">{exp.company} {exp.location && `| ${exp.location}`}</div>
                    <ul className="timeline-bullets">
                      {bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Timeline Extra: Education Timeline */}
      {isSectionVisible('education', customizations) && education?.length > 0 && (
        <section className="timeline-section">
          <h2 className="timeline-heading">EDUCATION TIMELINE</h2>
          <div className="timeline-track">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="timeline-node">
                <div className="timeline-node-dot timeline-dot-secondary" />
                <div className="timeline-node-content">
                  <div className="timeline-node-header">
                    <strong className="timeline-node-title">{edu.degree}</strong>
                    <span className="timeline-year-badge">{edu.year}</span>
                  </div>
                  <div className="timeline-node-sub">{edu.school} {edu.location && `| ${edu.location}`}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Timeline Extra: Milestones & Volunteering */}
      <div className="timeline-dual-row">
        {isSectionVisible('extras', customizations) && isSectionVisible('milestones', customizations) && milestones?.length > 0 && (
          <div className="timeline-col">
            <h2 className="timeline-heading">CAREER MILESTONES</h2>
            <div className="timeline-milestones-list">
              {milestones.map((m, idx) => (
                <div key={idx} className="timeline-milestone-item">
                  <span className="timeline-milestone-year">{m.year}</span>
                  <div>
                    <strong>{m.title}:</strong> {m.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isSectionVisible('extras', customizations) && isSectionVisible('volunteering', customizations) && volunteering?.length > 0 && (
          <div className="timeline-col">
            <h2 className="timeline-heading">VOLUNTEERING & COMMUNITY</h2>
            {volunteering.map((v, idx) => (
              <div key={idx} className="timeline-milestone-item">
                <span className="timeline-milestone-year">{v.year}</span>
                <div>
                  <strong>{v.role}</strong> — {v.organization}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Base: Skills, Projects, Awards & Languages */}
      <div className="timeline-dual-row">
        {isSectionVisible('skills', customizations) && skills?.length > 0 && (
          <div className="timeline-col">
            <h2 className="timeline-heading">SKILLS & COMPETENCIES</h2>
            <p className="timeline-text">{skills.join(' • ')}</p>
          </div>
        )}
        <div className="timeline-col">
          <h2 className="timeline-heading">HONORS & LANGUAGES</h2>
          <div className="timeline-text">
            {awards?.slice(0, 1).map((a) => `${a.title} (${a.year})`).join('')}
            {certifications?.length > 0 && ` • ${certifications[0].name}`}
            {languages?.length > 0 && ` • ${languages.map((l) => l.language).join(', ')}`}
          </div>
        </div>
      </div>
    </ResumeCanvasWrapper>
  );
};
