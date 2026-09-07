import React from 'react';
import { Mail, Phone, MapPin, Globe, GraduationCap, Wrench, Languages, Award } from 'lucide-react';

export const SidebarProTemplate = ({ answers = {}, generatedContent }) => {
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
    `Dynamic ${targetJobTitle} with recognized expertise in designing robust web architectures, optimizing application performance, and delivering high-value software products in fast-paced agile environments.`;

  return (
    <div className="resume-paper sidebar-pro-template" id="resume-export-target">
      <div className="sidebar-pro-container">
        {/* Left Sidebar Column */}
        <aside className="sidebar-pro-sidebar">
          {/* Avatar Initials / Branding */}
          <div className="sidebar-pro-brand">
            <div className="sidebar-pro-avatar">
              {(fullName || 'AM')
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
          </div>

          {/* Contact Details */}
          <div className="sidebar-pro-section">
            <h3 className="sidebar-pro-heading">Contact</h3>
            <div className="sidebar-pro-contact-list">
              {(contact.email || 'alex.morgan@example.com') && (
                <div className="sidebar-pro-contact-item">
                  <Mail size={12} className="sidebar-icon" />
                  <span>{contact.email || 'alex.morgan@example.com'}</span>
                </div>
              )}
              {(contact.phone || '+1 (555) 234-5678') && (
                <div className="sidebar-pro-contact-item">
                  <Phone size={12} className="sidebar-icon" />
                  <span>{contact.phone || '+1 (555) 234-5678'}</span>
                </div>
              )}
              {(contact.location || 'San Francisco, CA') && (
                <div className="sidebar-pro-contact-item">
                  <MapPin size={12} className="sidebar-icon" />
                  <span>{contact.location || 'San Francisco, CA'}</span>
                </div>
              )}
              {contact.website && (
                <div className="sidebar-pro-contact-item">
                  <Globe size={12} className="sidebar-icon" />
                  <span>{contact.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills / Tech */}
          <div className="sidebar-pro-section">
            <h3 className="sidebar-pro-heading">Core Skills</h3>
            <div className="sidebar-pro-skills-grid">
              {skills.length > 0 ? (
                skills.map((skill, sIdx) => (
                  <span key={sIdx} className="sidebar-pro-skill-badge">
                    {skill}
                  </span>
                ))
              ) : (
                <>
                  <span className="sidebar-pro-skill-badge">React.js</span>
                  <span className="sidebar-pro-skill-badge">TypeScript</span>
                  <span className="sidebar-pro-skill-badge">Next.js</span>
                  <span className="sidebar-pro-skill-badge">Node.js</span>
                  <span className="sidebar-pro-skill-badge">Tailwind CSS</span>
                  <span className="sidebar-pro-skill-badge">REST APIs</span>
                </>
              )}
            </div>
          </div>

          {/* Education in Sidebar */}
          <div className="sidebar-pro-section">
            <h3 className="sidebar-pro-heading">Education</h3>
            {education.length === 0 ? (
              <div className="sidebar-pro-edu-item">
                <div className="sidebar-pro-edu-degree">B.S. Computer Science</div>
                <div className="sidebar-pro-edu-school">UC Berkeley</div>
                <div className="sidebar-pro-edu-date">2016 – 2020</div>
              </div>
            ) : (
              education.map((edu, idx) => (
                <div key={edu.id || idx} className="sidebar-pro-edu-item">
                  <div className="sidebar-pro-edu-degree">{edu.degree || 'Degree'}</div>
                  <div className="sidebar-pro-edu-school">{edu.school || 'University'}</div>
                  <div className="sidebar-pro-edu-date">{edu.year || 'Graduation'}</div>
                </div>
              ))
            )}
          </div>

          {/* Languages & Extras */}
          <div className="sidebar-pro-section">
            <h3 className="sidebar-pro-heading">Languages</h3>
            <div className="sidebar-pro-lang-item">
              <span>English</span>
              <span className="sidebar-pro-lang-level">Native</span>
            </div>
            <div className="sidebar-pro-lang-item">
              <span>Spanish</span>
              <span className="sidebar-pro-lang-level">Professional</span>
            </div>
          </div>
        </aside>

        {/* Right Main Column */}
        <main className="sidebar-pro-main">
          {/* Main Column Header */}
          <header className="sidebar-pro-main-header">
            <h1 className="sidebar-pro-name">{fullName || 'Alex Morgan'}</h1>
            <p className="sidebar-pro-target">{targetJobTitle || 'Senior Frontend Engineer'}</p>
            <div className="sidebar-pro-accent-line" />
          </header>

          {/* Executive Summary */}
          <section className="sidebar-pro-main-section">
            <h2 className="sidebar-pro-main-heading">Professional Summary</h2>
            <p className="sidebar-pro-text">{summary}</p>
          </section>

          {/* Work Experience */}
          <section className="sidebar-pro-main-section">
            <h2 className="sidebar-pro-main-heading">Experience</h2>
            {experience.length === 0 ? (
              <p className="sidebar-pro-text" style={{ fontStyle: 'italic', color: '#64748b' }}>
                No experience listed yet.
              </p>
            ) : (
              experience.map((exp, idx) => {
                const bullets =
                  exp.generatedBullets ||
                  (exp.achievements
                    ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                    : [
                        `Led cross-functional initiatives as ${exp.role || 'Engineer'} at ${exp.company || 'Enterprise'}, boosting throughput by 30%.`,
                        `Architected and shipped key features adhering to strict accessibility and performance benchmarks.`
                      ]);

                return (
                  <div key={exp.id || idx} className="sidebar-pro-exp-item">
                    <div className="sidebar-pro-exp-top">
                      <div>
                        <h3 className="sidebar-pro-role">{exp.role || 'Role'}</h3>
                        <span className="sidebar-pro-company">@ {exp.company || 'Company'}</span>
                      </div>
                      <span className="sidebar-pro-date-pill">{exp.duration || '2022 – Present'}</span>
                    </div>
                    {exp.location && <div className="sidebar-pro-location">{exp.location}</div>}
                    <ul className="sidebar-pro-bullets">
                      {bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                );
              })
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
