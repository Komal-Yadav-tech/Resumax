import React from 'react';

export const AtsSimpleTemplate = ({ answers = {}, generatedContent }) => {
  const {
    fullName = 'Alex Morgan',
    contact = {},
    targetJobTitle = 'Frontend Engineer',
    experience = [],
    education = [],
    skills = []
  } = answers;

  const summary =
    generatedContent?.summary ||
    `Motivated and detail-oriented ${targetJobTitle} possessing a robust academic foundation and hands-on project experience in modern software architectures. Eager to contribute technical skills and collaborative energy to high-impact initiatives.`;

  return (
    <div className="resume-paper ats-simple-template" id="resume-export-target">
      {/* Generous Whitespace Fresher Header */}
      <header className="ats-simple-header">
        <h1 className="ats-simple-name">{fullName || 'Alex Morgan'}</h1>
        <p className="ats-simple-target">{targetJobTitle || 'Junior Software Engineer'}</p>
        <div className="ats-simple-contact">
          {[
            contact.email || 'alex.morgan@example.com',
            contact.phone || '+1 (555) 234-5678',
            contact.location || 'San Francisco, CA',
            contact.website
          ]
            .filter(Boolean)
            .join('  •  ')}
        </div>
      </header>

      {/* Career Objective / Summary */}
      <section className="ats-simple-section">
        <h2 className="ats-simple-heading">Career Objective</h2>
        <p className="ats-simple-text">{summary}</p>
      </section>

      {/* Education First (Fresher Friendly) */}
      <section className="ats-simple-section">
        <h2 className="ats-simple-heading">Education</h2>
        {education.length === 0 ? (
          <div className="ats-simple-item">
            <div className="ats-simple-row">
              <span className="ats-simple-title">B.S. in Computer Science</span>
              <span className="ats-simple-meta">2020 – 2024</span>
            </div>
            <div className="ats-simple-sub">University of California, Berkeley</div>
          </div>
        ) : (
          education.map((edu, idx) => (
            <div key={edu.id || idx} className="ats-simple-item">
              <div className="ats-simple-row">
                <span className="ats-simple-title">{edu.degree || 'Degree'}</span>
                <span className="ats-simple-meta">{edu.year || 'Graduation Year'}</span>
              </div>
              <div className="ats-simple-sub">
                {edu.school || 'University Name'}{edu.location ? `, ${edu.location}` : ''}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Projects (Fresher Friendly - Above Experience) */}
      <section className="ats-simple-section">
        <h2 className="ats-simple-heading">Key Projects</h2>
        <div className="ats-simple-item">
          <div className="ats-simple-row">
            <span className="ats-simple-title">Enterprise Analytics Dashboard</span>
            <span className="ats-simple-meta">React, TypeScript, Recharts</span>
          </div>
          <ul className="ats-simple-bullets">
            <li>Engineered an interactive real-time telemetry dashboard visualizing system throughput and latency metrics.</li>
            <li>Implemented responsive layouts and optimized rendering performance for datasets exceeding 10,000 data points.</li>
          </ul>
        </div>
        <div className="ats-simple-item">
          <div className="ats-simple-row">
            <span className="ats-simple-title">Collaborative Task Orchestrator</span>
            <span className="ats-simple-meta">Node.js, Express, REST APIs</span>
          </div>
          <ul className="ats-simple-bullets">
            <li>Designed and deployed RESTful microservices managing concurrent task queues with automatic retries.</li>
          </ul>
        </div>
      </section>

      {/* Work Experience */}
      <section className="ats-simple-section">
        <h2 className="ats-simple-heading">Experience & Internships</h2>
        {experience.length === 0 ? (
          <p className="ats-simple-text" style={{ fontStyle: 'italic', color: '#666' }}>
            Academic projects and extracurricular leadership detailed above.
          </p>
        ) : (
          experience.map((exp, idx) => {
            const bullets =
              exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [
                    `Assisted in developing frontend components as ${exp.role || 'Contributor'} at ${exp.company || 'Tech Org'}.`,
                    `Participated in code reviews, daily standups, and documentation sprints.`
                  ]);

            return (
              <div key={exp.id || idx} className="ats-simple-item">
                <div className="ats-simple-row">
                  <span className="ats-simple-title">{exp.role || 'Software Intern'}</span>
                  <span className="ats-simple-meta">{exp.duration || '2023 – 2024'}</span>
                </div>
                <div className="ats-simple-sub">
                  {exp.company || 'Company'}{exp.location ? ` | ${exp.location}` : ''}
                </div>
                <ul className="ats-simple-bullets">
                  {bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </section>

      {/* Technical Skills */}
      <section className="ats-simple-section">
        <h2 className="ats-simple-heading">Technical & Core Skills</h2>
        <p className="ats-simple-text">
          {skills.length > 0
            ? skills.join(', ')
            : 'JavaScript, TypeScript, React, HTML5, CSS3, Git, REST APIs, Problem Solving, Team Collaboration'}
        </p>
      </section>
    </div>
  );
};
