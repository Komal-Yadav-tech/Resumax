import React from 'react';
import { ResumeCanvasWrapper } from './ResumeCanvasWrapper';
import { normalizeResumeData, isSectionVisible } from './templateData';

export const AcademicTemplate = ({ answers, generatedContent, customizations = {} }) => {
  const data = normalizeResumeData(answers, generatedContent);
  const {
    fullName,
    targetJobTitle,
    contact,
    summary,
    education,
    research,
    publications,
    teaching,
    conferences,
    grants,
    memberships,
    experience,
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
    <ResumeCanvasWrapper templateId="academic" customizations={customizations} className="academic-template">
      {/* Centered Academic Curriculum Vitae Header */}
      <header className="academic-header">
        {showPhoto && (
          <div className="academic-photo-wrapper">
            <img src={photoSrc} alt={fullName} className="resume-candidate-photo" />
          </div>
        )}
        <h1 className="academic-name">{fullName}</h1>
        <div className="academic-affiliation">{targetJobTitle}</div>
        <div className="academic-contact">
          {[contact.email, contact.phone, contact.location, contact.website, contact.github]
            .filter(Boolean)
            .join(' • ')}
        </div>
      </header>

      {/* Academic Profile */}
      {isSectionVisible('summary', customizations) && summary && (
        <section className="academic-section">
          <h2 className="academic-heading">Academic Profile</h2>
          <p className="academic-text">{summary}</p>
        </section>
      )}

      {/* Base: Education */}
      {isSectionVisible('education', customizations) && education?.length > 0 && (
        <section className="academic-section">
          <h2 className="academic-heading">Education</h2>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="academic-item">
              <div className="academic-row">
                <strong>{edu.school}</strong>
                <span>{edu.year}</span>
              </div>
              <div className="academic-subrow">
                <span>{edu.degree}</span>
                {edu.location && <span>, {edu.location}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Academic Extra: Research Experience */}
      {isSectionVisible('extras', customizations) && isSectionVisible('research', customizations) && research?.length > 0 && (
        <section className="academic-section">
          <h2 className="academic-heading">Research Experience</h2>
          {research.map((res, idx) => (
            <div key={idx} className="academic-item">
              <div className="academic-row">
                <strong>{res.title}</strong>
                <span>{res.year}</span>
              </div>
              <p className="academic-text">Advisor: {res.advisor} | {res.institution}</p>
            </div>
          ))}
        </section>
      )}

      {/* Academic Extra: Peer-Reviewed Publications */}
      {isSectionVisible('extras', customizations) && isSectionVisible('publications', customizations) && publications?.length > 0 && (
        <section className="academic-section">
          <h2 className="academic-heading">Publications</h2>
          <ul className="academic-list">
            {publications.map((pub, idx) => (
              <li key={idx}>
                {fullName}. "{pub.title}." <em>{pub.journal}</em>, {pub.year}.
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Academic Extra: Teaching & Mentorship */}
      {isSectionVisible('extras', customizations) && isSectionVisible('teaching', customizations) && teaching?.length > 0 && (
        <section className="academic-section">
          <h2 className="academic-heading">Teaching & Pedagogy</h2>
          {teaching.map((tch, idx) => (
            <div key={idx} className="academic-item">
              <div className="academic-row">
                <strong>{tch.role}</strong>
                <span>{tch.year}</span>
              </div>
              <p className="academic-text">{tch.institution} — {tch.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Academic Extra: Conferences & Presentations */}
      {isSectionVisible('extras', customizations) && isSectionVisible('conferences', customizations) && conferences?.length > 0 && (
        <section className="academic-section">
          <h2 className="academic-heading">Conferences & Keynotes</h2>
          <ul className="academic-list">
            {conferences.map((conf, idx) => (
              <li key={idx}>
                <strong>{conf.name}</strong> — {conf.role} ({conf.year})
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Academic Extra: Grants & Fellowships */}
      {isSectionVisible('extras', customizations) && isSectionVisible('grants', customizations) && grants?.length > 0 && (
        <section className="academic-section">
          <h2 className="academic-heading">Grants & Fellowships</h2>
          <ul className="academic-list">
            {grants.map((g, idx) => (
              <li key={idx}>
                <strong>{g.name}</strong> ({g.amount}) — {g.year}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Base: Professional Experience */}
      {isSectionVisible('experience', customizations) && experience?.length > 0 && (
        <section className="academic-section">
          <h2 className="academic-heading">Professional Appointments</h2>
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} className="academic-item">
              <div className="academic-row">
                <strong>{exp.role}</strong> — {exp.company}
                <span>{exp.duration}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Base: Projects & Skills */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {isSectionVisible('skills', customizations) && skills?.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 className="academic-heading">Technical Proficiencies</h2>
            <p className="academic-text">{skills.join(', ')}</p>
          </div>
        )}
        {isSectionVisible('languages', customizations) && languages?.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 className="academic-heading">Scholarly Languages</h2>
            <p className="academic-text">
              {languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Academic Extra: Professional Memberships */}
      {isSectionVisible('extras', customizations) && isSectionVisible('memberships', customizations) && memberships?.length > 0 && (
        <section className="academic-section">
          <h2 className="academic-heading">Professional Memberships</h2>
          <p className="academic-text">{memberships.join(' • ')}</p>
        </section>
      )}
    </ResumeCanvasWrapper>
  );
};
