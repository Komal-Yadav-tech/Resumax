import React from 'react';
import { Mail, Phone, MapPin, Globe, Sparkles, Palette, Award, Layers } from 'lucide-react';

export const CreativeTemplate = ({ answers = {}, generatedContent }) => {
  const {
    fullName = 'Alex Morgan',
    contact = {},
    targetJobTitle = 'Creative Technologist & UI Architect',
    experience = [],
    education = [],
    skills = []
  } = answers;

  const summary =
    generatedContent?.summary ||
    `Visionary ${targetJobTitle} bridging the frontier between design excellence and technical engineering. Dedicated to crafting memorable digital experiences, innovative user interfaces, and high-conversion interactive ecosystems.`;

  return (
    <div className="resume-paper creative-template" id="resume-export-target">
      {/* Bold Color Block Header */}
      <header className="creative-header-block">
        <div className="creative-header-pattern" />
        <div className="creative-header-main">
          <div className="creative-badge-pill">
            <Sparkles size={12} /> CREATIVE PORTFOLIO RESUME
          </div>
          <h1 className="creative-name">{fullName || 'Alex Morgan'}</h1>
          <p className="creative-title">{targetJobTitle || 'UI/UX Engineer & Digital Designer'}</p>

          <div className="creative-contact-pills">
            {(contact.email || 'alex.morgan@example.com') && (
              <span className="creative-pill">
                <Mail size={12} className="creative-icon" /> {contact.email || 'alex.morgan@example.com'}
              </span>
            )}
            {(contact.phone || '+1 (555) 234-5678') && (
              <span className="creative-pill">
                <Phone size={12} className="creative-icon" /> {contact.phone || '+1 (555) 234-5678'}
              </span>
            )}
            {(contact.location || 'San Francisco, CA') && (
              <span className="creative-pill">
                <MapPin size={12} className="creative-icon" /> {contact.location || 'San Francisco, CA'}
              </span>
            )}
            {contact.website && (
              <span className="creative-pill">
                <Globe size={12} className="creative-icon" /> {contact.website}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Mixed Single / Two-Column Layout */}
      <div className="creative-body-grid">
        {/* Left Column: Creative Bio & Skills Block */}
        <div className="creative-col-left">
          {/* About Me Card */}
          <div className="creative-card creative-card-intro">
            <h3 className="creative-card-title">About Me</h3>
            <p className="creative-text">{summary}</p>
          </div>

          {/* Creative Skill Badges */}
          <div className="creative-card creative-card-skills">
            <h3 className="creative-card-title">Design & Tech Stack</h3>
            <div className="creative-skill-tags">
              {skills.length > 0 ? (
                skills.map((skill, sIdx) => (
                  <span key={sIdx} className="creative-tag">
                    {skill}
                  </span>
                ))
              ) : (
                <>
                  <span className="creative-tag">UI/UX Prototyping</span>
                  <span className="creative-tag">React.js & Next.js</span>
                  <span className="creative-tag">Figma Design Systems</span>
                  <span className="creative-tag">Creative Direction</span>
                  <span className="creative-tag">Micro-Animations</span>
                  <span className="creative-tag">WebGL / Three.js</span>
                </>
              )}
            </div>
          </div>

          {/* Education Card */}
          <div className="creative-card creative-card-edu">
            <h3 className="creative-card-title">Education</h3>
            {education.length === 0 ? (
              <div className="creative-edu-item">
                <strong>B.S. in Computer Science & Media Arts</strong>
                <p>UC Berkeley • 2016 – 2020</p>
              </div>
            ) : (
              education.map((edu, idx) => (
                <div key={edu.id || idx} className="creative-edu-item">
                  <strong>{edu.degree || 'Degree'}</strong>
                  <p>{edu.school || 'University'}{edu.year ? ` • ${edu.year}` : ''}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Experience Highlights */}
        <div className="creative-col-right">
          <div className="creative-card creative-card-exp">
            <h3 className="creative-card-title">Work Experience</h3>
            {experience.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No projects recorded yet.</p>
            ) : (
              experience.map((exp, idx) => {
                const bullets =
                  exp.generatedBullets ||
                  (exp.achievements
                    ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                    : [
                        `Spearheaded UI design system redesign as ${exp.role || 'Designer'} at ${exp.company || 'Agency'}, improving client retention by 35%.`,
                        `Prototyped interactive 3D motion elements and delivered pixel-perfect responsive layouts.`
                      ]);

                return (
                  <div key={exp.id || idx} className="creative-exp-block">
                    <div className="creative-exp-header">
                      <div>
                        <h4 className="creative-role">{exp.role || 'Lead Designer'}</h4>
                        <span className="creative-company">@ {exp.company || 'Studio'}</span>
                      </div>
                      <span className="creative-time-badge">{exp.duration || '2022 – Present'}</span>
                    </div>
                    {exp.location && <div className="creative-loc">{exp.location}</div>}
                    <ul className="creative-bullets">
                      {bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
