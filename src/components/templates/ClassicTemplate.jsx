import React from 'react';
import { ResumeCanvasWrapper } from './ResumeCanvasWrapper';
import { normalizeResumeData, isSectionVisible } from './templateData';

export const ClassicTemplate = ({ answers, generatedContent, customizations = {} }) => {
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
    extracurriculars,
    photo
  } = data;

  const showPhoto = customizations.showPhoto && (customizations.photoUrl || photo);
  const photoSrc = customizations.photoUrl || photo;

  return (
    <ResumeCanvasWrapper templateId="classic" customizations={customizations} className="classic-template">
      {/* ATS Header: Centered with full contact */}
      <header className="classic-header">
        {showPhoto && (
          <div className="classic-photo-wrapper">
            <img src={photoSrc} alt={fullName} className="resume-candidate-photo" />
          </div>
        )}
        <h1 className="classic-name">{fullName}</h1>
        <div className="classic-role-subtitle">{targetJobTitle}</div>
        <div className="classic-contact">
          {[contact.email, contact.phone, contact.location, contact.website, contact.github]
            .filter(Boolean)
            .join(' | ')}
        </div>
      </header>

      {/* Base: Professional Summary */}
      {isSectionVisible('summary', customizations) && summary && (
        <section className="classic-section">
          <h2 className="classic-heading">Professional Summary</h2>
          <p className="classic-text">{summary}</p>
        </section>
      )}

      {/* Base: Experience */}
      {isSectionVisible('experience', customizations) && experience?.length > 0 && (
        <section className="classic-section">
          <h2 className="classic-heading">Work Experience</h2>
          {experience.map((exp, idx) => {
            const bullets = exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [`Executed strategic initiatives as ${exp.role || 'Specialist'} at ${exp.company || 'Organization'}, driving 25% efficiency.`]);

            return (
              <div key={exp.id || idx} className="classic-item">
                <div className="classic-row">
                  <strong>{exp.role}</strong>
                  <span>{exp.duration}</span>
                </div>
                <div className="classic-row classic-subrow">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                <ul className="classic-bullets">
                  {bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {/* Base: Education */}
      {isSectionVisible('education', customizations) && education?.length > 0 && (
        <section className="classic-section">
          <h2 className="classic-heading">Education</h2>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="classic-item">
              <div className="classic-row">
                <strong>{edu.school}</strong>
                <span>{edu.year}</span>
              </div>
              <div className="classic-row classic-subrow">
                <span>{edu.degree}</span>
                {edu.location && <span>{edu.location}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Base: Skills */}
      {isSectionVisible('skills', customizations) && skills?.length > 0 && (
        <section className="classic-section">
          <h2 className="classic-heading">Skills</h2>
          <p className="classic-text">{skills.join(', ')}</p>
        </section>
      )}

      {/* Base: Projects */}
      {isSectionVisible('projects', customizations) && projects?.length > 0 && (
        <section className="classic-section">
          <h2 className="classic-heading">Key Projects</h2>
          {projects.map((proj, idx) => (
            <div key={proj.id || idx} className="classic-item">
              <div className="classic-row">
                <strong>{proj.title}</strong>
                <span>{proj.duration || ''}</span>
              </div>
              <p className="classic-text">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Base: Certifications */}
      {isSectionVisible('certifications', customizations) && certifications?.length > 0 && (
        <section className="classic-section">
          <h2 className="classic-heading">Certifications</h2>
          <div className="classic-list-inline">
            {certifications.map((cert, idx) => (
              <span key={cert.id || idx} className="classic-inline-item">
                • <strong>{cert.name}</strong> ({cert.issuer}, {cert.year})
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Base: Achievements */}
      {isSectionVisible('achievements', customizations) && achievements?.length > 0 && (
        <section className="classic-section">
          <h2 className="classic-heading">Key Achievements</h2>
          <ul className="classic-bullets">
            {achievements.map((ach, idx) => (
              <li key={ach.id || idx}>
                <strong>{ach.title}</strong> — {ach.metric || ach.organization} ({ach.year})
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Base: Languages */}
      {isSectionVisible('languages', customizations) && languages?.length > 0 && (
        <section className="classic-section">
          <h2 className="classic-heading">Languages</h2>
          <p className="classic-text">
            {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
          </p>
        </section>
      )}

      {/* Classic Extra: Extracurriculars */}
      {isSectionVisible('extras', customizations) && isSectionVisible('extracurriculars', customizations) && extracurriculars?.length > 0 && (
        <section className="classic-section">
          <h2 className="classic-heading">Extracurricular Activities</h2>
          <ul className="classic-bullets">
            {extracurriculars.map((extra, idx) => (
              <li key={idx}>{extra}</li>
            ))}
          </ul>
        </section>
      )}
    </ResumeCanvasWrapper>
  );
};
