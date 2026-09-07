import React from 'react';

export const AtsCompactTemplate = ({ answers = {}, generatedContent }) => {
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
    `Seasoned ${targetJobTitle} with proven history of optimizing application performance, leading cross-functional engineering teams, and shipping resilient production platforms under aggressive delivery timelines.`;

  return (
    <div className="resume-paper ats-compact-template" id="resume-export-target">
      {/* Compact Inline Header */}
      <header className="ats-compact-header">
        <div className="ats-compact-top-row">
          <h1 className="ats-compact-name">{fullName || 'Alex Morgan'}</h1>
          <span className="ats-compact-title-tag">{targetJobTitle || 'Lead Engineer'}</span>
        </div>
        <div className="ats-compact-contact-line">
          {[
            contact.email || 'alex.morgan@example.com',
            contact.phone || '+1 (555) 234-5678',
            contact.location || 'San Francisco, CA',
            contact.website
          ]
            .filter(Boolean)
            .join(' | ')}
        </div>
      </header>

      {/* Summary */}
      <section className="ats-compact-section">
        <h2 className="ats-compact-heading">SUMMARY</h2>
        <p className="ats-compact-summary-text">{summary}</p>
      </section>

      {/* Skills Bar */}
      <section className="ats-compact-section">
        <h2 className="ats-compact-heading">CORE SKILLS</h2>
        <p className="ats-compact-skills">
          {skills.length > 0
            ? skills.join(', ')
            : 'JavaScript, TypeScript, React.js, Next.js, HTML5/CSS3, Tailwind, REST APIs, Git, Agile, Performance Optimization'}
        </p>
      </section>

      {/* Work Experience */}
      <section className="ats-compact-section">
        <h2 className="ats-compact-heading">PROFESSIONAL EXPERIENCE</h2>
        {experience.length === 0 ? (
          <p className="ats-compact-text">No experience listed yet.</p>
        ) : (
          experience.map((exp, idx) => {
            const bullets =
              exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [
                    `Spearheaded development as ${exp.role || 'Role'} at ${exp.company || 'Company'}, improving load speed by 35%.`,
                    `Automated CI/CD pipelines to shorten deployment cycles by 2 days.`
                  ]);

            return (
              <div key={exp.id || idx} className="ats-compact-item">
                <div className="ats-compact-item-header">
                  <div>
                    <strong className="ats-compact-role">{exp.role || 'Role'}</strong>
                    <span className="ats-compact-company"> — {exp.company || 'Company'}</span>
                    {exp.location && <span className="ats-compact-location"> ({exp.location})</span>}
                  </div>
                  <span className="ats-compact-date">{exp.duration || '2022 – Present'}</span>
                </div>
                <ul className="ats-compact-bullets">
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
      <section className="ats-compact-section">
        <h2 className="ats-compact-heading">EDUCATION</h2>
        {education.length === 0 ? (
          <div className="ats-compact-item-header">
            <div>
              <strong>B.S. in Computer Science</strong>
              <span> — UC Berkeley</span>
            </div>
            <span>2016 – 2020</span>
          </div>
        ) : (
          education.map((edu, idx) => (
            <div key={edu.id || idx} className="ats-compact-item">
              <div className="ats-compact-item-header">
                <div>
                  <strong className="ats-compact-role">{edu.degree || 'Degree'}</strong>
                  <span className="ats-compact-company"> — {edu.school || 'School'}</span>
                  {edu.location && <span className="ats-compact-location"> ({edu.location})</span>}
                </div>
                <span className="ats-compact-date">{edu.year || 'Graduation Year'}</span>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
