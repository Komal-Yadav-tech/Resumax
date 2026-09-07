import React from 'react';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Calendar } from 'lucide-react';

export const TimelineTemplate = ({ answers = {}, generatedContent }) => {
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
    `Proven ${targetJobTitle} with a demonstrated history of delivering scalable frontend and full-stack solutions. Experienced in mentoring engineers, architecting design systems, and driving continuous improvement across development lifecycles.`;

  return (
    <div className="resume-paper timeline-template" id="resume-export-target">
      {/* Header */}
      <header className="timeline-header">
        <h1 className="timeline-name">{fullName || 'Alex Morgan'}</h1>
        <p className="timeline-role">{targetJobTitle || 'Senior Software Engineer'}</p>

        <div className="timeline-contact-bar">
          {(contact.email || 'alex.morgan@example.com') && (
            <span className="timeline-contact-badge">
              <Mail size={12} /> {contact.email || 'alex.morgan@example.com'}
            </span>
          )}
          {(contact.phone || '+1 (555) 234-5678') && (
            <span className="timeline-contact-badge">
              <Phone size={12} /> {contact.phone || '+1 (555) 234-5678'}
            </span>
          )}
          {(contact.location || 'San Francisco, CA') && (
            <span className="timeline-contact-badge">
              <MapPin size={12} /> {contact.location || 'San Francisco, CA'}
            </span>
          )}
          {contact.website && (
            <span className="timeline-contact-badge">
              <Globe size={12} /> {contact.website}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      <section className="timeline-summary-section">
        <h2 className="timeline-section-title">Career Synopsis</h2>
        <p className="timeline-summary-text">{summary}</p>
      </section>

      {/* Chronological Timeline: Experience */}
      <section className="timeline-section">
        <h2 className="timeline-section-title">
          <Briefcase size={15} /> Career Trajectory
        </h2>

        <div className="timeline-track-wrapper">
          {experience.length === 0 ? (
            <div className="timeline-node-entry">
              <div className="timeline-marker">
                <span className="timeline-dot" />
              </div>
              <div className="timeline-node-content">
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No experience records present.</p>
              </div>
            </div>
          ) : (
            experience.map((exp, idx) => {
              const bullets =
                exp.generatedBullets ||
                (exp.achievements
                  ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                  : [
                      `Led core engineering efforts as ${exp.role || 'Lead'} at ${exp.company || 'Innovate Inc'}, improving system uptime to 99.98%.`,
                      `Streamlined deployment processes and coached team members in modern frameworks.`
                    ]);

              return (
                <div key={exp.id || idx} className="timeline-node-entry">
                  {/* Vertical line dot */}
                  <div className="timeline-marker">
                    <span className="timeline-dot" />
                    <span className="timeline-connector-line" />
                  </div>

                  {/* Node Content */}
                  <div className="timeline-node-content">
                    <div className="timeline-node-header">
                      <div>
                        <h3 className="timeline-node-title">{exp.role || 'Role Title'}</h3>
                        <span className="timeline-node-company">{exp.company || 'Company'}</span>
                        {exp.location && <span className="timeline-node-location"> • {exp.location}</span>}
                      </div>
                      <span className="timeline-date-chip">
                        <Calendar size={11} /> {exp.duration || '2022 – Present'}
                      </span>
                    </div>

                    <ul className="timeline-bullets">
                      {bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Chronological Timeline: Education */}
      <section className="timeline-section">
        <h2 className="timeline-section-title">
          <GraduationCap size={15} /> Academic Milestones
        </h2>

        <div className="timeline-track-wrapper">
          {education.length === 0 ? (
            <div className="timeline-node-entry">
              <div className="timeline-marker">
                <span className="timeline-dot" />
              </div>
              <div className="timeline-node-content">
                <h3 className="timeline-node-title">B.S. in Computer Science</h3>
                <span className="timeline-node-company">UC Berkeley</span>
              </div>
            </div>
          ) : (
            education.map((edu, idx) => (
              <div key={edu.id || idx} className="timeline-node-entry">
                <div className="timeline-marker">
                  <span className="timeline-dot" />
                  <span className="timeline-connector-line" />
                </div>
                <div className="timeline-node-content">
                  <div className="timeline-node-header">
                    <div>
                      <h3 className="timeline-node-title">{edu.degree || 'Degree'}</h3>
                      <span className="timeline-node-company">{edu.school || 'University'}</span>
                      {edu.location && <span className="timeline-node-location"> • {edu.location}</span>}
                    </div>
                    <span className="timeline-date-chip">
                      <Calendar size={11} /> {edu.year || 'Graduation'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Skills */}
      <section className="timeline-section">
        <h2 className="timeline-section-title">Skills & Specializations</h2>
        <div className="timeline-skills-container">
          {skills.length > 0 ? (
            skills.map((skill, sIdx) => (
              <span key={sIdx} className="timeline-skill-pill">
                {skill}
              </span>
            ))
          ) : (
            <>
              <span className="timeline-skill-pill">React.js</span>
              <span className="timeline-skill-pill">TypeScript</span>
              <span className="timeline-skill-pill">Next.js</span>
              <span className="timeline-skill-pill">Node.js</span>
              <span className="timeline-skill-pill">System Architecture</span>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
