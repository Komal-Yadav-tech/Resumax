import React from 'react';
import { ResumeCanvasWrapper } from './ResumeCanvasWrapper';
import { normalizeResumeData, isSectionVisible } from './templateData';

export const MinimalTemplate = ({ answers, generatedContent, customizations = {} }) => {
  const data = normalizeResumeData(answers, generatedContent);
  const {
    fullName,
    targetJobTitle,
    contact,
    summary,
    quote,
    experience,
    education,
    projects,
    skills,
    awards,
    certifications,
    achievements,
    languages,
    photo
  } = data;

  const showPhoto = customizations.showPhoto && (customizations.photoUrl || photo);
  const photoSrc = customizations.photoUrl || photo;

  return (
    <ResumeCanvasWrapper templateId="minimal" customizations={customizations} className="minimal-template">
      {/* Minimalist Editorial Header */}
      <header className="minimal-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="minimal-name">{fullName}</h1>
            <p className="minimal-title">{targetJobTitle}</p>
          </div>
          {showPhoto && (
            <img src={photoSrc} alt={fullName} className="resume-candidate-photo minimal-photo" />
          )}
        </div>
        <div className="minimal-contact">
          {[contact.email, contact.phone, contact.location, contact.website, contact.github]
            .filter(Boolean)
            .join('  /  ')}
        </div>
        {/* Minimal Extra: Summary Quote */}
        {isSectionVisible('extras', customizations) && quote && (
          <div className="minimal-quote-box">{quote}</div>
        )}
      </header>

      {/* Base: Summary */}
      {isSectionVisible('summary', customizations) && summary && (
        <section className="minimal-section">
          <div className="minimal-grid-row">
            <div className="minimal-left-col">
              <span className="minimal-section-tag">About</span>
            </div>
            <div className="minimal-right-col">
              <p className="minimal-text">{summary}</p>
            </div>
          </div>
        </section>
      )}

      {/* Base: Experience with narrow left date column */}
      {isSectionVisible('experience', customizations) && experience?.length > 0 && (
        <section className="minimal-section">
          <div className="minimal-grid-row">
            <div className="minimal-left-col">
              <span className="minimal-section-tag">Experience</span>
            </div>
            <div className="minimal-right-col">
              {experience.map((exp, idx) => {
                const bullets = exp.generatedBullets ||
                  (exp.achievements
                    ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                    : [`Engineered scalable architectures at ${exp.company || 'Enterprise'}.`]);

                return (
                  <div key={exp.id || idx} className="minimal-entry">
                    <div className="minimal-entry-top">
                      <span className="minimal-role">{exp.role}</span>
                      <span className="minimal-date">{exp.duration}</span>
                    </div>
                    <div className="minimal-company">{exp.company} {exp.location && `— ${exp.location}`}</div>
                    <ul className="minimal-bullets">
                      {bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Base: Education */}
      {isSectionVisible('education', customizations) && education?.length > 0 && (
        <section className="minimal-section">
          <div className="minimal-grid-row">
            <div className="minimal-left-col">
              <span className="minimal-section-tag">Education</span>
            </div>
            <div className="minimal-right-col">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="minimal-entry">
                  <div className="minimal-entry-top">
                    <span className="minimal-role">{edu.degree}</span>
                    <span className="minimal-date">{edu.year}</span>
                  </div>
                  <div className="minimal-company">{edu.school} {edu.location && `— ${edu.location}`}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Minimal Extra: Selected Projects */}
      {isSectionVisible('projects', customizations) && projects?.length > 0 && (
        <section className="minimal-section">
          <div className="minimal-grid-row">
            <div className="minimal-left-col">
              <span className="minimal-section-tag">Projects</span>
            </div>
            <div className="minimal-right-col">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="minimal-entry">
                  <div className="minimal-entry-top">
                    <span className="minimal-role">{proj.title}</span>
                    <span className="minimal-date">{proj.duration || ''}</span>
                  </div>
                  <p className="minimal-text">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Base: Skills */}
      {isSectionVisible('skills', customizations) && skills?.length > 0 && (
        <section className="minimal-section">
          <div className="minimal-grid-row">
            <div className="minimal-left-col">
              <span className="minimal-section-tag">Skills</span>
            </div>
            <div className="minimal-right-col">
              <p className="minimal-text minimal-skills-line">{skills.join('  •  ')}</p>
            </div>
          </div>
        </section>
      )}

      {/* Minimal Extra: Awards & Achievements */}
      {((isSectionVisible('awards', customizations) && awards?.length > 0) ||
        (isSectionVisible('achievements', customizations) && achievements?.length > 0)) && (
        <section className="minimal-section">
          <div className="minimal-grid-row">
            <div className="minimal-left-col">
              <span className="minimal-section-tag">Awards</span>
            </div>
            <div className="minimal-right-col">
              <div className="minimal-inline-list">
                {awards?.map((aw, idx) => (
                  <span key={`aw-${idx}`}>
                    {aw.title} ({aw.year})
                  </span>
                ))}
                {achievements?.map((ach, idx) => (
                  <span key={`ach-${idx}`}>
                    {ach.title} ({ach.year})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Minimal Extra: Languages & Certifications */}
      <section className="minimal-section">
        <div className="minimal-grid-row">
          <div className="minimal-left-col">
            <span className="minimal-section-tag">Credentials</span>
          </div>
          <div className="minimal-right-col minimal-flex-cols">
            {isSectionVisible('certifications', customizations) && certifications?.length > 0 && (
              <div>
                <strong>Certifications:</strong>{' '}
                {certifications.map((c) => `${c.name} (${c.year})`).join(', ')}
              </div>
            )}
            {isSectionVisible('languages', customizations) && languages?.length > 0 && (
              <div>
                <strong>Languages:</strong>{' '}
                {languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
              </div>
            )}
          </div>
        </div>
      </section>
    </ResumeCanvasWrapper>
  );
};
