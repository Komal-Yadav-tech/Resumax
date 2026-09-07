import React from 'react';
import { Mail, Phone, MapPin, Globe, Award } from 'lucide-react';

export const CorporateTemplate = ({ answers = {}, generatedContent }) => {
  const {
    fullName = 'Alex Morgan',
    contact = {},
    targetJobTitle = 'Vice President of Engineering',
    experience = [],
    education = [],
    skills = []
  } = answers;

  const summary =
    generatedContent?.summary ||
    `Distinguished executive leader with comprehensive expertise in organizational transformation, enterprise technology roadmaps, and cross-functional operational excellence. Proven capability in scaling engineering divisions, mitigating operational risk, and delivering stakeholder value across multi-million dollar business portfolios.`;

  return (
    <div className="resume-paper corporate-template" id="resume-export-target">
      {/* Dark Solid Executive Header Bar */}
      <header className="corporate-header-bar">
        <div className="corporate-header-inner">
          <h1 className="corporate-name">{fullName || 'Alex Morgan'}</h1>
          <p className="corporate-subtitle">{targetJobTitle || 'Executive Director & Technology Leader'}</p>

          <div className="corporate-contact-row">
            {(contact.email || 'alex.morgan@example.com') && (
              <span className="corporate-contact-item">
                <Mail size={12} /> {contact.email || 'alex.morgan@example.com'}
              </span>
            )}
            {(contact.phone || '+1 (555) 234-5678') && (
              <span className="corporate-contact-item">
                <Phone size={12} /> {contact.phone || '+1 (555) 234-5678'}
              </span>
            )}
            {(contact.location || 'San Francisco, CA') && (
              <span className="corporate-contact-item">
                <MapPin size={12} /> {contact.location || 'San Francisco, CA'}
              </span>
            )}
            {contact.website && (
              <span className="corporate-contact-item">
                <Globe size={12} /> {contact.website}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="corporate-body">
        {/* Executive Profile */}
        <section className="corporate-section">
          <h2 className="corporate-heading">Executive Profile</h2>
          <p className="corporate-text">{summary}</p>
        </section>

        {/* Leadership Experience */}
        <section className="corporate-section">
          <h2 className="corporate-heading">Professional Experience</h2>
          {experience.length === 0 ? (
            <p className="corporate-text" style={{ fontStyle: 'italic', color: '#666' }}>
              No executive positions recorded yet.
            </p>
          ) : (
            experience.map((exp, idx) => {
              const bullets =
                exp.generatedBullets ||
                (exp.achievements
                  ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                  : [
                      `Directed strategic initiatives as ${exp.role || 'Executive'} at ${exp.company || 'Global Corp'}, expanding market footprint by 28%.`,
                      `Orchestrated organizational restructuring across multiple agile business units.`
                    ]);

              return (
                <div key={exp.id || idx} className="corporate-entry">
                  <div className="corporate-entry-top">
                    <div>
                      <h3 className="corporate-role">{exp.role || 'Vice President'}</h3>
                      <span className="corporate-company">{exp.company || 'Enterprise Solutions Inc.'}</span>
                    </div>
                    <div className="corporate-meta-right">
                      <span className="corporate-date">{exp.duration || '2021 – Present'}</span>
                      {exp.location && <span className="corporate-loc">{exp.location}</span>}
                    </div>
                  </div>
                  <ul className="corporate-bullets">
                    {bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet.replace(/^[•\-\*]\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </section>

        {/* Education & Credentials */}
        <section className="corporate-section">
          <h2 className="corporate-heading">Education & Credentials</h2>
          {education.length === 0 ? (
            <div className="corporate-entry-top">
              <div>
                <h3 className="corporate-role">B.S. in Computer Science & Business Management</h3>
                <span className="corporate-company">University of California, Berkeley</span>
              </div>
              <span className="corporate-date">2016 – 2020</span>
            </div>
          ) : (
            education.map((edu, idx) => (
              <div key={edu.id || idx} className="corporate-entry">
                <div className="corporate-entry-top">
                  <div>
                    <h3 className="corporate-role">{edu.degree || 'Degree'}</h3>
                    <span className="corporate-company">{edu.school || 'University'}</span>
                  </div>
                  <div className="corporate-meta-right">
                    <span className="corporate-date">{edu.year || 'Graduation Year'}</span>
                    {edu.location && <span className="corporate-loc">{edu.location}</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Core Competencies */}
        <section className="corporate-section">
          <h2 className="corporate-heading">Core Competencies & Strategic Capabilities</h2>
          <div className="corporate-competencies-grid">
            {skills.length > 0 ? (
              skills.map((skill, sIdx) => (
                <div key={sIdx} className="corporate-competency-item">
                  <span className="corporate-bullet-square">■</span> {skill}
                </div>
              ))
            ) : (
              <>
                <div className="corporate-competency-item"><span className="corporate-bullet-square">■</span> Strategic Planning</div>
                <div className="corporate-competency-item"><span className="corporate-bullet-square">■</span> Executive Leadership</div>
                <div className="corporate-competency-item"><span className="corporate-bullet-square">■</span> Enterprise Architecture</div>
                <div className="corporate-competency-item"><span className="corporate-bullet-square">■</span> Cross-Functional Alignment</div>
                <div className="corporate-competency-item"><span className="corporate-bullet-square">■</span> Risk Governance</div>
                <div className="corporate-competency-item"><span className="corporate-bullet-square">■</span> Budget & P&L Oversight</div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
