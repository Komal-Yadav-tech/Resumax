import React from 'react';
import { ResumeCanvasWrapper } from './ResumeCanvasWrapper';
import { normalizeResumeData, isSectionVisible } from './templateData';

export const AtsProTemplate = ({ answers, generatedContent, customizations = {} }) => {
  const data = normalizeResumeData(answers, generatedContent);
  const {
    fullName,
    targetJobTitle,
    contact,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    coreCompetencies,
    toolsAndTech,
    awards,
    photo
  } = data;

  const showPhoto = customizations.showPhoto && (customizations.photoUrl || photo);
  const photoSrc = customizations.photoUrl || photo;

  return (
    <ResumeCanvasWrapper templateId="ats-pro" customizations={customizations} className="ats-pro-template">
      {/* ATS Pro Left-Aligned Bold Header */}
      <header className="ats-pro-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="ats-pro-name">{fullName}</h1>
            <div className="ats-pro-target-role">{targetJobTitle}</div>
          </div>
          {showPhoto && (
            <img src={photoSrc} alt={fullName} className="resume-candidate-photo" />
          )}
        </div>
        <div className="ats-pro-contact">
          {[contact.email, contact.phone, contact.location, contact.website, contact.github]
            .filter(Boolean)
            .join(' | ')}
        </div>
      </header>

      {/* ATS Pro Extra: PROFESSIONAL SUMMARY */}
      {isSectionVisible('summary', customizations) && summary && (
        <section className="ats-pro-section">
          <h2 className="ats-pro-heading">PROFESSIONAL SUMMARY</h2>
          <p className="ats-pro-text">{summary}</p>
        </section>
      )}

      {/* ATS Pro Extra: CORE COMPETENCIES (Keyword Grid) */}
      {isSectionVisible('extras', customizations) && isSectionVisible('coreCompetencies', customizations) && coreCompetencies?.length > 0 && (
        <section className="ats-pro-section">
          <h2 className="ats-pro-heading">CORE COMPETENCIES</h2>
          <div className="ats-pro-competencies-grid">
            {coreCompetencies.map((comp, idx) => (
              <span key={idx} className="ats-pro-competency-item">
                ▪ {comp}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Base: PROFESSIONAL EXPERIENCE */}
      {isSectionVisible('experience', customizations) && experience?.length > 0 && (
        <section className="ats-pro-section">
          <h2 className="ats-pro-heading">PROFESSIONAL EXPERIENCE</h2>
          {experience.map((exp, idx) => {
            const bullets = exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [`Drove technical architecture for ${exp.company || 'Enterprise'}, increasing platform stability by 30%.`]);

            return (
              <div key={exp.id || idx} className="ats-pro-item">
                <div className="ats-pro-row">
                  <span className="ats-pro-row-title">{exp.role}</span>
                  <span className="ats-pro-row-date">{exp.duration}</span>
                </div>
                <div className="ats-pro-row ats-pro-subrow">
                  <span className="ats-pro-company">{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                <ul className="ats-pro-bullets">
                  {bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {/* Base: EDUCATION */}
      {isSectionVisible('education', customizations) && education?.length > 0 && (
        <section className="ats-pro-section">
          <h2 className="ats-pro-heading">EDUCATION</h2>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="ats-pro-item">
              <div className="ats-pro-row">
                <span className="ats-pro-row-title">{edu.degree}</span>
                <span className="ats-pro-row-date">{edu.year}</span>
              </div>
              <div className="ats-pro-row ats-pro-subrow">
                <span>{edu.school}</span>
                {edu.location && <span>{edu.location}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ATS Pro Extra: TOOLS & TECHNOLOGIES / SKILLS */}
      {isSectionVisible('skills', customizations) && (
        <section className="ats-pro-section">
          <h2 className="ats-pro-heading">TOOLS & TECHNOLOGIES</h2>
          <p className="ats-pro-dense-line">
            <strong>Key Skills:</strong> {skills?.join(' • ')}
          </p>
          {toolsAndTech?.length > 0 && isSectionVisible('extras', customizations) && (
            <p className="ats-pro-dense-line">
              <strong>Tools:</strong> {toolsAndTech.join(' • ')}
            </p>
          )}
        </section>
      )}

      {/* Base: KEY PROJECTS */}
      {isSectionVisible('projects', customizations) && projects?.length > 0 && (
        <section className="ats-pro-section">
          <h2 className="ats-pro-heading">KEY PROJECTS</h2>
          {projects.map((proj, idx) => (
            <div key={proj.id || idx} className="ats-pro-item">
              <div className="ats-pro-row">
                <span className="ats-pro-row-title">{proj.title}</span>
                <span className="ats-pro-row-date">{proj.duration || ''}</span>
              </div>
              <p className="ats-pro-text">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Base: CERTIFICATIONS */}
      {isSectionVisible('certifications', customizations) && certifications?.length > 0 && (
        <section className="ats-pro-section">
          <h2 className="ats-pro-heading">CERTIFICATIONS</h2>
          <div className="ats-pro-inline-list">
            {certifications.map((c, idx) => (
              <span key={c.id || idx} className="ats-pro-inline-badge">
                ▪ {c.name} — {c.issuer} ({c.year})
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ATS Pro Extra: AWARDS & ACHIEVEMENTS */}
      {((isSectionVisible('awards', customizations) && awards?.length > 0) ||
        (isSectionVisible('achievements', customizations) && achievements?.length > 0)) && (
        <section className="ats-pro-section">
          <h2 className="ats-pro-heading">AWARDS & ACHIEVEMENTS</h2>
          <ul className="ats-pro-bullets">
            {awards?.map((aw, idx) => (
              <li key={`aw-${idx}`}>
                <strong>{aw.title}</strong> — {aw.issuer} ({aw.year})
              </li>
            ))}
            {achievements?.map((ach, idx) => (
              <li key={`ach-${idx}`}>
                <strong>{ach.title}</strong> — {ach.metric || ach.organization} ({ach.year})
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Base: LANGUAGES */}
      {isSectionVisible('languages', customizations) && languages?.length > 0 && (
        <section className="ats-pro-section">
          <h2 className="ats-pro-heading">LANGUAGES</h2>
          <p className="ats-pro-text">
            {languages.map((l) => `${l.language}: ${l.proficiency}`).join(' | ')}
          </p>
        </section>
      )}
    </ResumeCanvasWrapper>
  );
};
