import React from 'react';
import { ResumeCanvasWrapper } from './ResumeCanvasWrapper';
import { normalizeResumeData, isSectionVisible } from './templateData';

export const CorporateTemplate = ({ answers, generatedContent, customizations = {} }) => {
  const data = normalizeResumeData(answers, generatedContent);
  const {
    fullName,
    targetJobTitle,
    contact,
    summary,
    leadership,
    achievements,
    training,
    awards,
    experience,
    education,
    projects,
    skills,
    certifications,
    languages,
    photo
  } = data;

  const showPhoto = customizations.showPhoto && (customizations.photoUrl || photo);
  const photoSrc = customizations.photoUrl || photo;

  return (
    <ResumeCanvasWrapper templateId="corporate" customizations={customizations} className="corporate-template">
      {/* Corporate Navy Header Bar */}
      <header className="corporate-header-bar">
        <div className="corporate-header-inner">
          <div className="corporate-name-title">
            <h1 className="corporate-name">{fullName}</h1>
            <div className="corporate-role">{targetJobTitle}</div>
          </div>
          {showPhoto && (
            <img src={photoSrc} alt={fullName} className="resume-candidate-photo corporate-photo" />
          )}
        </div>
        <div className="corporate-gold-divider" />
        <div className="corporate-contact-line">
          {[contact.email, contact.phone, contact.location, contact.website, contact.github]
            .filter(Boolean)
            .join('  •  ')}
        </div>
      </header>

      {/* Corporate Extra: Executive Summary */}
      {isSectionVisible('summary', customizations) && summary && (
        <section className="corporate-section">
          <h2 className="corporate-heading">Executive Summary</h2>
          <p className="corporate-text">{summary}</p>
        </section>
      )}

      {/* Corporate Extra: Key Achievements with Metrics */}
      {isSectionVisible('achievements', customizations) && achievements?.length > 0 && (
        <section className="corporate-section">
          <h2 className="corporate-heading">Key Achievements & Value Metrics</h2>
          <div className="corporate-achievements-grid">
            {achievements.map((ach, idx) => (
              <div key={idx} className="corporate-achievement-card">
                <div className="corporate-achievement-title">{ach.title}</div>
                <div className="corporate-achievement-metric">{ach.metric || ach.organization}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Base: Professional Experience */}
      {isSectionVisible('experience', customizations) && experience?.length > 0 && (
        <section className="corporate-section">
          <h2 className="corporate-heading">Leadership & Executive Experience</h2>
          {experience.map((exp, idx) => {
            const bullets = exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [`Directed operational engineering and cross-functional teams at ${exp.company || 'Enterprise'}.`]);

            return (
              <div key={exp.id || idx} className="corporate-job">
                <div className="corporate-job-header">
                  <strong>{exp.role}</strong>
                  <span className="corporate-date">{exp.duration}</span>
                </div>
                <div className="corporate-company">{exp.company} {exp.location && `| ${exp.location}`}</div>
                <ul className="corporate-bullets">
                  {bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {/* Corporate Extra: Leadership Initiatives */}
      {isSectionVisible('extras', customizations) && isSectionVisible('leadership', customizations) && leadership?.length > 0 && (
        <section className="corporate-section">
          <h2 className="corporate-heading">Strategic Leadership</h2>
          <ul className="corporate-bullets">
            {leadership.map((lead, idx) => (
              <li key={idx}>
                <strong>{lead.role}:</strong> {lead.description}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Base: Education & Projects */}
      <div className="corporate-dual-row">
        {isSectionVisible('education', customizations) && education?.length > 0 && (
          <div className="corporate-col">
            <h2 className="corporate-heading">Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="corporate-edu">
                <strong>{edu.degree}</strong>
                <div>{edu.school} ({edu.year})</div>
              </div>
            ))}
          </div>
        )}
        {isSectionVisible('projects', customizations) && projects?.length > 0 && (
          <div className="corporate-col">
            <h2 className="corporate-heading">Enterprise Projects</h2>
            {projects.slice(0, 2).map((p, idx) => (
              <div key={idx} className="corporate-edu">
                <strong>{p.title}</strong>
                <p className="corporate-text" style={{ fontSize: '0.8rem' }}>{p.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Base & Extras: Training, Awards, Certifications & Skills */}
      <div className="corporate-dual-row">
        {isSectionVisible('skills', customizations) && skills?.length > 0 && (
          <div className="corporate-col">
            <h2 className="corporate-heading">Core Competencies</h2>
            <p className="corporate-text">{skills.join(', ')}</p>
          </div>
        )}
        <div className="corporate-col">
          <h2 className="corporate-heading">Credentials & Honors</h2>
          <div className="corporate-text">
            {certifications?.slice(0, 2).map((c) => c.name).join(' • ')}
            {awards?.length > 0 && ` • ${awards[0].title}`}
            {languages?.length > 0 && ` • ${languages.map((l) => l.language).join(', ')}`}
          </div>
        </div>
      </div>
    </ResumeCanvasWrapper>
  );
};
