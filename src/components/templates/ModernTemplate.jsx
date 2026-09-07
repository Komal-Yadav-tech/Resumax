import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export const ModernTemplate = ({ answers, generatedContent }) => {
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
    `Dynamic and impact-driven ${targetJobTitle} with a strong foundation in modern technology architectures, agile execution, and cross-functional team delivery.`;

  return (
    <div className="resume-paper modern-template" id="resume-export-target">
      {/* Modern Accent Header */}
      <header className="modern-header">
        <div className="modern-header-accent-bar" />
        <div className="modern-header-content">
          <h1 className="modern-name">{fullName || 'Alex Morgan'}</h1>
          <p className="modern-title">{targetJobTitle || 'Senior Frontend Engineer'}</p>

          <div className="modern-contact-grid">
            {(contact.email || 'alex.morgan@example.com') && (
              <span className="modern-contact-pill">
                <Mail size={13} className="modern-icon" /> {contact.email || 'alex.morgan@example.com'}
              </span>
            )}
            {(contact.phone || '+1 (555) 234-5678') && (
              <span className="modern-contact-pill">
                <Phone size={13} className="modern-icon" /> {contact.phone || '+1 (555) 234-5678'}
              </span>
            )}
            {(contact.location || 'San Francisco, CA') && (
              <span className="modern-contact-pill">
                <MapPin size={13} className="modern-icon" /> {contact.location || 'San Francisco, CA'}
              </span>
            )}
            {contact.website && (
              <span className="modern-contact-pill">
                <Globe size={13} className="modern-icon" /> {contact.website}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      <section className="modern-section">
        <h2 className="modern-heading">
          <span className="modern-heading-pill">About Me</span>
        </h2>
        <p className="modern-summary">{summary}</p>
      </section>

      {/* Experience */}
      <section className="modern-section">
        <h2 className="modern-heading">
          <span className="modern-heading-pill">Work Experience</span>
        </h2>
        {experience.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No experience listed yet.</p>
        ) : (
          experience.map((exp, idx) => {
            const bullets =
              exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [
                    `Led engineering initiatives as ${exp.role || 'Specialist'} at ${exp.company || 'Company'}, achieving 25% throughput optimization.`,
                    `Partnered with product managers and architects to build scalable components.`
                  ]);

            return (
              <div key={exp.id || idx} className="modern-job-card">
                <div className="modern-job-title-row">
                  <div>
                    <span className="modern-role">{exp.role || 'Role'}</span>
                    <span className="modern-company"> @ {exp.company || 'Company'}</span>
                  </div>
                  <span className="modern-badge-date">{exp.duration || '2022 – Present'}</span>
                </div>
                {exp.location && <div className="modern-job-location">{exp.location}</div>}
                <ul className="modern-bullets">
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
      <section className="modern-section">
        <h2 className="modern-heading">
          <span className="modern-heading-pill">Education</span>
        </h2>
        {education.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No education listed yet.</p>
        ) : (
          education.map((edu, idx) => (
            <div key={edu.id || idx} className="modern-edu-card">
              <div className="modern-job-title-row">
                <div>
                  <span className="modern-role">{edu.degree || 'Degree / Major'}</span>
                  <span className="modern-company"> — {edu.school || 'School'}</span>
                </div>
                <span className="modern-badge-date">{edu.year || '2020 – 2024'}</span>
              </div>
              {edu.location && <div className="modern-job-location">{edu.location}</div>}
            </div>
          ))
        )}
      </section>

      {/* Skills */}
      <section className="modern-section">
        <h2 className="modern-heading">
          <span className="modern-heading-pill">Core Competencies</span>
        </h2>
        <div className="modern-skills-wrapper">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <span key={skill} className="modern-skill-capsule">
                {skill}
              </span>
            ))
          ) : (
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>JavaScript, React, Node.js</span>
          )}
        </div>
      </section>
    </div>
  );
};
