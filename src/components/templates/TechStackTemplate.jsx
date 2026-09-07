import React from 'react';
import { Terminal, Code2, Cpu, Globe, Mail, Phone, MapPin } from 'lucide-react';

export const TechStackTemplate = ({ answers = {}, generatedContent }) => {
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
    `Full-lifecycle ${targetJobTitle} specializing in high-performance frontend architectures, distributed systems integration, and modular component ecosystems. Committed to code quality, CI/CD automation, and developer ergonomics.`;

  return (
    <div className="resume-paper techstack-template" id="resume-export-target">
      {/* Dev Header */}
      <header className="techstack-header">
        <div className="techstack-header-top">
          <div>
            <div className="techstack-badge-dev">
              <Terminal size={12} /> DEVELOPER PROFILE
            </div>
            <h1 className="techstack-name">{fullName || 'Alex Morgan'}</h1>
            <p className="techstack-role">{targetJobTitle || 'Full Stack Engineer'}</p>
          </div>
          <div className="techstack-terminal-icon">
            <Code2 size={36} />
          </div>
        </div>

        <div className="techstack-contact-strip">
          {(contact.email || 'alex.morgan@example.com') && (
            <span className="techstack-contact-item">
              <Mail size={12} /> {contact.email || 'alex.morgan@example.com'}
            </span>
          )}
          {(contact.phone || '+1 (555) 234-5678') && (
            <span className="techstack-contact-item">
              <Phone size={12} /> {contact.phone || '+1 (555) 234-5678'}
            </span>
          )}
          {(contact.location || 'San Francisco, CA') && (
            <span className="techstack-contact-item">
              <MapPin size={12} /> {contact.location || 'San Francisco, CA'}
            </span>
          )}
          {contact.website && (
            <span className="techstack-contact-item">
              <Globe size={12} /> {contact.website}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      <section className="techstack-section">
        <h2 className="techstack-heading">
          <span className="techstack-prompt">$</span> cat about_me.txt
        </h2>
        <p className="techstack-summary-text">{summary}</p>
      </section>

      {/* SKILLS AS TAGS/PILLS NEAR TOP (BEFORE EXPERIENCE) */}
      <section className="techstack-section techstack-skills-highlight">
        <h2 className="techstack-heading">
          <span className="techstack-prompt">$</span> npm run list-stack --core
        </h2>
        <div className="techstack-tags-cloud">
          {skills.length > 0 ? (
            skills.map((skill, sIdx) => (
              <span key={sIdx} className="techstack-pill">
                <span className="techstack-dot" /> {skill}
              </span>
            ))
          ) : (
            <>
              <span className="techstack-pill"><span className="techstack-dot" /> React.js</span>
              <span className="techstack-pill"><span className="techstack-dot" /> TypeScript</span>
              <span className="techstack-pill"><span className="techstack-dot" /> JavaScript ES6+</span>
              <span className="techstack-pill"><span className="techstack-dot" /> Next.js</span>
              <span className="techstack-pill"><span className="techstack-dot" /> Node.js</span>
              <span className="techstack-pill"><span className="techstack-dot" /> GraphQL / REST</span>
              <span className="techstack-pill"><span className="techstack-dot" /> Docker</span>
              <span className="techstack-pill"><span className="techstack-dot" /> Tailwind CSS</span>
            </>
          )}
        </div>
      </section>

      {/* Experience */}
      <section className="techstack-section">
        <h2 className="techstack-heading">
          <span className="techstack-prompt">$</span> git log --work-experience
        </h2>
        {experience.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No commitments logged yet.</p>
        ) : (
          experience.map((exp, idx) => {
            const bullets =
              exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [
                    `Spearheaded core feature development as ${exp.role || 'Engineer'} at ${exp.company || 'TechCorp'}.`,
                    `Optimized bundle build times by 45% and authored comprehensive unit test suites.`
                  ]);

            return (
              <div key={exp.id || idx} className="techstack-exp-card">
                <div className="techstack-exp-top">
                  <div>
                    <span className="techstack-role-title">{exp.role || 'Staff Engineer'}</span>
                    <span className="techstack-company-name"> @ {exp.company || 'Scale Corp'}</span>
                  </div>
                  <span className="techstack-duration-badge">{exp.duration || '2022 – Present'}</span>
                </div>
                {exp.location && <div className="techstack-loc">{exp.location}</div>}
                <ul className="techstack-bullets">
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
      <section className="techstack-section">
        <h2 className="techstack-heading">
          <span className="techstack-prompt">$</span> cat credentials.json
        </h2>
        {education.length === 0 ? (
          <div className="techstack-exp-card">
            <span className="techstack-role-title">B.S. in Computer Science</span>
            <span className="techstack-company-name"> — UC Berkeley (2016 – 2020)</span>
          </div>
        ) : (
          education.map((edu, idx) => (
            <div key={edu.id || idx} className="techstack-exp-card">
              <div className="techstack-exp-top">
                <div>
                  <span className="techstack-role-title">{edu.degree || 'Degree'}</span>
                  <span className="techstack-company-name"> — {edu.school || 'University'}</span>
                </div>
                <span className="techstack-duration-badge">{edu.year || '2020'}</span>
              </div>
              {edu.location && <div className="techstack-loc">{edu.location}</div>}
            </div>
          ))
        )}
      </section>
    </div>
  );
};
