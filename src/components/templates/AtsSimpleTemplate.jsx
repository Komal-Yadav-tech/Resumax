import React from 'react';
import { ResumeCanvasWrapper } from './ResumeCanvasWrapper';
import { normalizeResumeData, isSectionVisible } from './templateData';

export const AtsSimpleTemplate = ({ answers, generatedContent, customizations = {} }) => {
  const data = normalizeResumeData(answers, generatedContent);
  const {
    fullName,
    targetJobTitle,
    contact,
    objective,
    summary,
    education,
    coursework,
    academicProjects,
    projects,
    experience,
    skills,
    certifications,
    achievements,
    languages,
    volunteering,
    hobbies,
    photo
  } = data;

  const showPhoto = customizations.showPhoto && (customizations.photoUrl || photo);
  const photoSrc = customizations.photoUrl || photo;

  return (
    <ResumeCanvasWrapper templateId="ats-simple" customizations={customizations} className="ats-simple-template">
      {/* Light Header with Left Accent Line styling */}
      <header className="ats-simple-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="ats-simple-name">{fullName}</h1>
            <div className="ats-simple-subtitle">{targetJobTitle}</div>
          </div>
          {showPhoto && (
            <img src={photoSrc} alt={fullName} className="resume-candidate-photo" />
          )}
        </div>
        <div className="ats-simple-contact">
          {[contact.email, contact.phone, contact.location, contact.website, contact.github]
            .filter(Boolean)
            .join(' • ')}
        </div>
      </header>

      {/* ATS Simple Extra: Career Objective */}
      {isSectionVisible('summary', customizations) && (objective || summary) && (
        <section className="ats-simple-section">
          <h2 className="ats-simple-heading">Career Objective</h2>
          <p className="ats-simple-text">{objective || summary}</p>
        </section>
      )}

      {/* Fresher Priority: Education */}
      {isSectionVisible('education', customizations) && education?.length > 0 && (
        <section className="ats-simple-section">
          <h2 className="ats-simple-heading">Education</h2>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="ats-simple-item">
              <div className="ats-simple-row">
                <strong>{edu.school}</strong>
                <span>{edu.year}</span>
              </div>
              <div className="ats-simple-subrow">
                <span>{edu.degree}</span>
                {edu.location && <span> | {edu.location}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ATS Simple Extra: Relevant Coursework */}
      {isSectionVisible('extras', customizations) && isSectionVisible('coursework', customizations) && coursework?.length > 0 && (
        <section className="ats-simple-section">
          <h2 className="ats-simple-heading">Relevant Coursework</h2>
          <p className="ats-simple-text">{coursework.join(' • ')}</p>
        </section>
      )}

      {/* ATS Simple Extra & Base: Academic & Personal Projects */}
      {isSectionVisible('projects', customizations) && (
        <section className="ats-simple-section">
          <h2 className="ats-simple-heading">Academic & Technical Projects</h2>
          {academicProjects?.map((ap, idx) => (
            <div key={`ap-${idx}`} className="ats-simple-item">
              <div className="ats-simple-row">
                <strong>{ap.title}</strong>
                <span>{ap.year}</span>
              </div>
              <p className="ats-simple-text">{ap.description}</p>
            </div>
          ))}
          {projects?.map((proj, idx) => (
            <div key={`proj-${idx}`} className="ats-simple-item">
              <div className="ats-simple-row">
                <strong>{proj.title}</strong>
                <span>{proj.duration || ''}</span>
              </div>
              <p className="ats-simple-text">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Base: Work Experience */}
      {isSectionVisible('experience', customizations) && experience?.length > 0 && (
        <section className="ats-simple-section">
          <h2 className="ats-simple-heading">Experience & Internships</h2>
          {experience.map((exp, idx) => {
            const bullets = exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [`Contributed to core development at ${exp.company || 'Organization'}, enhancing test coverage and delivery.`]);

            return (
              <div key={exp.id || idx} className="ats-simple-item">
                <div className="ats-simple-row">
                  <strong>{exp.role}</strong>
                  <span>{exp.duration}</span>
                </div>
                <div className="ats-simple-subrow">
                  <span>{exp.company}</span>
                  {exp.location && <span> | {exp.location}</span>}
                </div>
                <ul className="ats-simple-bullets">
                  {bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {/* Base: Skills */}
      {isSectionVisible('skills', customizations) && skills?.length > 0 && (
        <section className="ats-simple-section">
          <h2 className="ats-simple-heading">Technical & Soft Skills</h2>
          <p className="ats-simple-text">{skills.join(', ')}</p>
        </section>
      )}

      {/* Base: Certifications & Achievements */}
      {((isSectionVisible('certifications', customizations) && certifications?.length > 0) ||
        (isSectionVisible('achievements', customizations) && achievements?.length > 0)) && (
        <section className="ats-simple-section">
          <h2 className="ats-simple-heading">Certifications & Achievements</h2>
          <ul className="ats-simple-bullets">
            {certifications?.map((c, idx) => (
              <li key={`c-${idx}`}>
                <strong>{c.name}</strong> — {c.issuer} ({c.year})
              </li>
            ))}
            {achievements?.map((a, idx) => (
              <li key={`a-${idx}`}>
                <strong>{a.title}</strong> ({a.year})
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ATS Simple Extra: Volunteering */}
      {isSectionVisible('extras', customizations) && isSectionVisible('volunteering', customizations) && volunteering?.length > 0 && (
        <section className="ats-simple-section">
          <h2 className="ats-simple-heading">Volunteering & Community Service</h2>
          {volunteering.map((vol, idx) => (
            <div key={idx} className="ats-simple-item">
              <div className="ats-simple-row">
                <strong>{vol.role} — {vol.organization}</strong>
                <span>{vol.year}</span>
              </div>
              {vol.description && <p className="ats-simple-text">{vol.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Base: Languages & Extras: Hobbies */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {isSectionVisible('languages', customizations) && languages?.length > 0 && (
          <section className="ats-simple-section" style={{ flex: 1 }}>
            <h2 className="ats-simple-heading">Languages</h2>
            <p className="ats-simple-text">
              {languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
            </p>
          </section>
        )}
        {isSectionVisible('extras', customizations) && isSectionVisible('hobbies', customizations) && hobbies?.length > 0 && (
          <section className="ats-simple-section" style={{ flex: 1 }}>
            <h2 className="ats-simple-heading">Hobbies & Interests</h2>
            <p className="ats-simple-text">{hobbies.join(', ')}</p>
          </section>
        )}
      </div>
    </ResumeCanvasWrapper>
  );
};
