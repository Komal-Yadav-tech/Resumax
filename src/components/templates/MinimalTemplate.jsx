import React from 'react';

export const MinimalTemplate = ({ answers, generatedContent }) => {
  const {
    fullName = 'Alex Morgan',
    contact = {},
    targetJobTitle = 'Senior Frontend Engineer',
    experience = [],
    education = [],
    skills = []
  } = answers;

  const summary =
    generatedContent?.summary ||
    `Experienced ${targetJobTitle} specializing in high-performance application development, systematic problem resolution, and cross-functional leadership.`;

  return (
    <div className="resume-paper minimal-template" id="resume-export-target">
      {/* Minimal Header */}
      <header className="minimal-header">
        <h1 className="minimal-name">{fullName || 'Alex Morgan'}</h1>
        <p className="minimal-title">{targetJobTitle || 'Senior Frontend Engineer'}</p>
        <div className="minimal-contact">
          {[
            contact.email || 'alex.morgan@example.com',
            contact.phone || '+1 (555) 234-5678',
            contact.location || 'San Francisco, CA',
            contact.website
          ]
            .filter(Boolean)
            .join(' • ')}
        </div>
      </header>

      {/* Summary */}
      <section className="minimal-section">
        <h2 className="minimal-heading">Summary</h2>
        <p className="minimal-summary-text">{summary}</p>
      </section>

      {/* Experience */}
      <section className="minimal-section">
        <h2 className="minimal-heading">Experience</h2>
        {experience.length === 0 ? (
          <p className="minimal-muted">No experience entries provided.</p>
        ) : (
          experience.map((exp, idx) => {
            const bullets =
              exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [
                    `Managed development lifecycle as ${exp.role || 'Role'} at ${exp.company || 'Company'}, improving sprint velocity by 25%.`,
                    `Engineered reliable solutions and collaborated with engineering leadership.`
                  ]);

            return (
              <div key={exp.id || idx} className="minimal-entry">
                <div className="minimal-entry-header">
                  <div>
                    <span className="minimal-entry-role">{exp.role || 'Role'}</span>
                    <span className="minimal-entry-company">, {exp.company || 'Company'}</span>
                  </div>
                  <span className="minimal-entry-date">{exp.duration || '2022 – Present'}</span>
                </div>
                {exp.location && <div className="minimal-muted">{exp.location}</div>}
                <ul className="minimal-bullets">
                  {bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </section>

      {/* Education */}
      <section className="minimal-section">
        <h2 className="minimal-heading">Education</h2>
        {education.length === 0 ? (
          <p className="minimal-muted">No education entries provided.</p>
        ) : (
          education.map((edu, idx) => (
            <div key={edu.id || idx} className="minimal-entry">
              <div className="minimal-entry-header">
                <div>
                  <span className="minimal-entry-role">{edu.degree || 'Degree / Major'}</span>
                  <span className="minimal-entry-company">, {edu.school || 'School'}</span>
                </div>
                <span className="minimal-entry-date">{edu.year || '2020 – 2024'}</span>
              </div>
              {edu.location && <div className="minimal-muted">{edu.location}</div>}
            </div>
          ))
        )}
      </section>

      {/* Skills */}
      <section className="minimal-section">
        <h2 className="minimal-heading">Skills</h2>
        <p className="minimal-skills-text">
          {skills.length > 0
            ? skills.join('  /  ')
            : 'JavaScript  /  React  /  TypeScript  /  Node.js  /  System Architecture'}
        </p>
      </section>
    </div>
  );
};
