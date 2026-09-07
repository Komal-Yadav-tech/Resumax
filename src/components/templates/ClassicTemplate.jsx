import React from 'react';

export const ClassicTemplate = ({ answers, generatedContent }) => {
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
    `Results-driven ${targetJobTitle} with proven experience in building scalable solutions, collaborating across cross-functional teams, and achieving operational efficiency.`;

  return (
    <div className="resume-paper classic-template" id="resume-export-target">
      {/* ATS Header: Name + Contact Line */}
      <div className="classic-header">
        <h1 className="classic-name">{fullName || 'Alex Morgan'}</h1>
        <div className="classic-contact">
          {[
            contact.email || 'alex.morgan@example.com',
            contact.phone || '+1 (555) 234-5678',
            contact.location || 'San Francisco, CA',
            contact.website
          ]
            .filter(Boolean)
            .join(' | ')}
        </div>
      </div>

      {/* Professional Summary */}
      <section className="classic-section">
        <h2 className="classic-heading">Professional Summary</h2>
        <p className="classic-text">{summary}</p>
      </section>

      {/* Work Experience */}
      <section className="classic-section">
        <h2 className="classic-heading">Work Experience</h2>
        {experience.length === 0 ? (
          <p className="classic-text" style={{ fontStyle: 'italic', color: '#666' }}>
            No work experience added yet.
          </p>
        ) : (
          experience.map((exp, idx) => {
            const bullets =
              exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [
                    `Executed key initiatives as ${exp.role || 'Professional'} at ${exp.company || 'Company'}, boosting operational efficiency by 25%.`,
                    `Collaborated with cross-functional stakeholders to deliver project milestones on schedule.`
                  ]);

            return (
              <div key={exp.id || idx} className="classic-item">
                <div className="classic-row">
                  <strong>{exp.role || 'Job Role'}</strong>
                  <span>{exp.duration || '2022 – Present'}</span>
                </div>
                <div className="classic-row" style={{ fontStyle: 'italic', marginBottom: '0.35rem' }}>
                  <span>{exp.company || 'Company Name'}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                <ul className="classic-bullets">
                  {bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </section>

      {/* Education */}
      <section className="classic-section">
        <h2 className="classic-heading">Education</h2>
        {education.length === 0 ? (
          <p className="classic-text" style={{ fontStyle: 'italic', color: '#666' }}>
            No education added yet.
          </p>
        ) : (
          education.map((edu, idx) => (
            <div key={edu.id || idx} className="classic-item">
              <div className="classic-row">
                <strong>{edu.school || 'University Name'}</strong>
                <span>{edu.year || '2020 – 2024'}</span>
              </div>
              <div className="classic-row" style={{ fontStyle: 'italic' }}>
                <span>{edu.degree || 'Degree / Major'}</span>
                {edu.location && <span>{edu.location}</span>}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Skills */}
      <section className="classic-section">
        <h2 className="classic-heading">Skills</h2>
        <p className="classic-text">
          {skills.length > 0 ? skills.join(', ') : 'JavaScript, React, TypeScript, Node.js, Project Management'}
        </p>
      </section>
    </div>
  );
};
