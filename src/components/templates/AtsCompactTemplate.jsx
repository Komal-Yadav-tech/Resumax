import React from 'react';
import { ResumeCanvasWrapper } from './ResumeCanvasWrapper';
import { normalizeResumeData, isSectionVisible } from './templateData';

export const AtsCompactTemplate = ({ answers, generatedContent, customizations = {} }) => {
  const data = normalizeResumeData(answers, generatedContent);
  const {
    fullName,
    targetJobTitle,
    contact,
    summary,
    keySkills,
    skills,
    experience,
    education,
    projects,
    certifications,
    achievements,
    languages,
    publications,
    training,
    references,
    photo
  } = data;

  const showPhoto = customizations.showPhoto && (customizations.photoUrl || photo);
  const photoSrc = customizations.photoUrl || photo;

  return (
    <ResumeCanvasWrapper templateId="ats-compact" customizations={customizations} className="ats-compact-template">
      {/* Compact Top Header */}
      <header className="ats-compact-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="ats-compact-name">{fullName}</span>
            <span className="ats-compact-divider-pipe"> | </span>
            <span className="ats-compact-role">{targetJobTitle}</span>
          </div>
          {showPhoto && (
            <img src={photoSrc} alt={fullName} className="resume-candidate-photo ats-compact-photo" />
          )}
        </div>
        <div className="ats-compact-contact">
          {[contact.email, contact.phone, contact.location, contact.website, contact.github]
            .filter(Boolean)
            .join(' • ')}
        </div>
      </header>

      {/* ATS Compact Extra: KEY SKILLS INLINE SEPARATED BY | */}
      {isSectionVisible('skills', customizations) && (
        <section className="ats-compact-section">
          <div className="ats-compact-skills-inline">
            <span className="ats-compact-label">KEY SKILLS:</span>{' '}
            {(keySkills?.length > 0 ? keySkills : skills)?.join(' | ')}
          </div>
        </section>
      )}

      {/* Base: Summary */}
      {isSectionVisible('summary', customizations) && summary && (
        <section className="ats-compact-section">
          <h2 className="ats-compact-heading">PROFESSIONAL SUMMARY</h2>
          <p className="ats-compact-text">{summary}</p>
        </section>
      )}

      {/* Base: Work Experience with 2-Column Bullets */}
      {isSectionVisible('experience', customizations) && experience?.length > 0 && (
        <section className="ats-compact-section">
          <h2 className="ats-compact-heading">EXPERIENCE</h2>
          {experience.map((exp, idx) => {
            const bullets = exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [`Drove core engineering deliverables at ${exp.company || 'Enterprise'}, increasing output by 20%.`]);

            return (
              <div key={exp.id || idx} className="ats-compact-entry">
                <div className="ats-compact-row">
                  <strong>{exp.role} — {exp.company}</strong>
                  <span>{exp.duration}</span>
                </div>
                {exp.location && <div className="ats-compact-subrow">{exp.location}</div>}
                <ul className="ats-compact-two-col-bullets">
                  {bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {/* Base: Education */}
      {isSectionVisible('education', customizations) && education?.length > 0 && (
        <section className="ats-compact-section">
          <h2 className="ats-compact-heading">EDUCATION</h2>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="ats-compact-row">
              <span><strong>{edu.degree}</strong>, {edu.school}</span>
              <span>{edu.year}</span>
            </div>
          ))}
        </section>
      )}

      {/* Base: Projects */}
      {isSectionVisible('projects', customizations) && projects?.length > 0 && (
        <section className="ats-compact-section">
          <h2 className="ats-compact-heading">SELECTED PROJECTS</h2>
          <div className="ats-compact-projects-grid">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="ats-compact-proj-item">
                <strong>{proj.title}:</strong> {proj.description}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Base & Extras: Certifications, Training & Publications */}
      <div className="ats-compact-multi-col">
        {isSectionVisible('certifications', customizations) && certifications?.length > 0 && (
          <div className="ats-compact-col-half">
            <h2 className="ats-compact-heading">CERTIFICATIONS</h2>
            <ul className="ats-compact-list-tight">
              {certifications.map((c, idx) => (
                <li key={idx}>{c.name} ({c.year})</li>
              ))}
            </ul>
          </div>
        )}
        {isSectionVisible('extras', customizations) && isSectionVisible('training', customizations) && training?.length > 0 && (
          <div className="ats-compact-col-half">
            <h2 className="ats-compact-heading">TRAINING</h2>
            <ul className="ats-compact-list-tight">
              {training.map((t, idx) => (
                <li key={idx}>{t.program} — {t.provider}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ATS Compact Extra: Publications */}
      {isSectionVisible('extras', customizations) && isSectionVisible('publications', customizations) && publications?.length > 0 && (
        <section className="ats-compact-section">
          <h2 className="ats-compact-heading">PUBLICATIONS</h2>
          <ul className="ats-compact-list-tight">
            {publications.map((pub, idx) => (
              <li key={idx}>"{pub.title}" — {pub.journal} ({pub.year})</li>
            ))}
          </ul>
        </section>
      )}

      {/* Base: Achievements & Languages */}
      <div className="ats-compact-footer-row">
        {isSectionVisible('achievements', customizations) && achievements?.length > 0 && (
          <div style={{ flex: 1 }}>
            <span className="ats-compact-label">HONORS:</span>{' '}
            {achievements.map((a) => a.title).join(' • ')}
          </div>
        )}
        {isSectionVisible('languages', customizations) && languages?.length > 0 && (
          <div style={{ flex: 1, textAlign: 'right' }}>
            <span className="ats-compact-label">LANGUAGES:</span>{' '}
            {languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
          </div>
        )}
      </div>

      {/* ATS Compact Extra: References */}
      {isSectionVisible('extras', customizations) && isSectionVisible('references', customizations) && (
        <div className="ats-compact-references">
          <em>References: {references}</em>
        </div>
      )}
    </ResumeCanvasWrapper>
  );
};
