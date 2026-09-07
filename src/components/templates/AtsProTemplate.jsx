import React from 'react';

export const AtsProTemplate = ({ answers = {}, generatedContent }) => {
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
    `High-performing ${targetJobTitle} equipped with extensive expertise in scalable software design, performance optimization, and cross-functional team leadership. Proven track record of architecting mission-critical systems and delivering measurable business outcomes.`;

  return (
    <div className="resume-paper ats-pro-template" id="resume-export-target">
      {/* ATS Pro Plain-Text Header */}
      <header className="ats-pro-header">
        <h1 className="ats-pro-name">{fullName || 'Alex Morgan'}</h1>
        <div className="ats-pro-contact">
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

      {/* PROFESSIONAL SUMMARY */}
      <section className="ats-pro-section">
        <h2 className="ats-pro-heading">PROFESSIONAL SUMMARY</h2>
        <p className="ats-pro-text">{summary}</p>
      </section>

      {/* CORE COMPETENCIES / KEYWORDS */}
      <section className="ats-pro-section">
        <h2 className="ats-pro-heading">CORE COMPETENCIES & KEYWORDS</h2>
        <p className="ats-pro-skills-dense">
          {skills.length > 0
            ? skills.join(' • ')
            : 'JavaScript • TypeScript • React.js • Next.js • Node.js • Cloud Architecture • Agile Methodologies • CI/CD Pipelines • System Optimization • API Integration'}
        </p>
      </section>

      {/* PROFESSIONAL EXPERIENCE */}
      <section className="ats-pro-section">
        <h2 className="ats-pro-heading">PROFESSIONAL EXPERIENCE</h2>
        {experience.length === 0 ? (
          <p className="ats-pro-text" style={{ fontStyle: 'italic', color: '#555' }}>
            No work experience listed yet.
          </p>
        ) : (
          experience.map((exp, idx) => {
            const bullets =
              exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [
                    `Architected high-throughput solutions as ${exp.role || 'Engineer'} at ${exp.company || 'Enterprise Corp'}, boosting reliability by 35%.`,
                    `Spearheaded automated testing workflows to reduce release defects by 40%.`
                  ]);

            return (
              <div key={exp.id || idx} className="ats-pro-item">
                <div className="ats-pro-row ats-pro-row-title">
                  <span className="ats-pro-role">{exp.role || 'Software Engineer'}</span>
                  <span className="ats-pro-date">{exp.duration || '2022 – Present'}</span>
                </div>
                <div className="ats-pro-row ats-pro-row-sub">
                  <span className="ats-pro-company">{exp.company || 'Organization'}</span>
                  {exp.location && <span className="ats-pro-location">{exp.location}</span>}
                </div>
                <ul className="ats-pro-bullets">
                  {bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </section>

      {/* EDUCATION */}
      <section className="ats-pro-section">
        <h2 className="ats-pro-heading">EDUCATION & CREDENTIALS</h2>
        {education.length === 0 ? (
          <p className="ats-pro-text" style={{ fontStyle: 'italic', color: '#555' }}>
            No education entries listed.
          </p>
        ) : (
          education.map((edu, idx) => (
            <div key={edu.id || idx} className="ats-pro-item">
              <div className="ats-pro-row ats-pro-row-title">
                <span className="ats-pro-role">{edu.degree || 'Bachelor of Science in Computer Science'}</span>
                <span className="ats-pro-date">{edu.year || '2016 – 2020'}</span>
              </div>
              <div className="ats-pro-row ats-pro-row-sub">
                <span className="ats-pro-company">{edu.school || 'University of California, Berkeley'}</span>
                {edu.location && <span className="ats-pro-location">{edu.location}</span>}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
