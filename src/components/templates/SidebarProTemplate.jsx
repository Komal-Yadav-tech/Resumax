import React from 'react';
import { Mail, Phone, MapPin, Globe, Github } from 'lucide-react';
import { ResumeCanvasWrapper } from './ResumeCanvasWrapper';
import { normalizeResumeData, isSectionVisible } from './templateData';

export const SidebarProTemplate = ({ answers, generatedContent, customizations = {} }) => {
  const data = normalizeResumeData(answers, generatedContent);
  const {
    fullName,
    targetJobTitle,
    contact,
    summary,
    skills,
    languages,
    interests,
    certifications,
    experience,
    education,
    projects,
    achievements,
    photo
  } = data;

  const showPhoto = customizations.showPhoto && (customizations.photoUrl || photo);
  const photoSrc = customizations.photoUrl || photo;

  // Skill percentages for progress bars
  const skillPercentages = [95, 90, 88, 85, 82, 80, 78, 75];

  return (
    <ResumeCanvasWrapper templateId="sidebar-pro" customizations={customizations} className="sidebar-pro-template">
      <div className="sidebar-pro-wrapper">
        {/* Left Sidebar (30% width, dark theme) */}
        <aside className="sidebar-pro-left">
          {/* Circular Photo / Avatar */}
          <div className="sidebar-pro-avatar-center">
            {showPhoto ? (
              <img src={photoSrc} alt={fullName} className="sidebar-pro-photo" />
            ) : (
              <div className="sidebar-pro-initials">
                {fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
              </div>
            )}
          </div>

          {/* Contact in Sidebar */}
          <div className="sidebar-pro-sec">
            <h3 className="sidebar-pro-head">CONTACT</h3>
            <div className="sidebar-pro-contact-list">
              {contact.email && (
                <div className="sidebar-pro-c-item">
                  <Mail size={11} /> <span>{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="sidebar-pro-c-item">
                  <Phone size={11} /> <span>{contact.phone}</span>
                </div>
              )}
              {contact.location && (
                <div className="sidebar-pro-c-item">
                  <MapPin size={11} /> <span>{contact.location}</span>
                </div>
              )}
              {contact.website && (
                <div className="sidebar-pro-c-item">
                  <Globe size={11} /> <span>{contact.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills with Progress Bars in Sidebar */}
          {isSectionVisible('skills', customizations) && skills?.length > 0 && (
            <div className="sidebar-pro-sec">
              <h3 className="sidebar-pro-head">SKILLS</h3>
              <div className="sidebar-pro-skills-bars">
                {skills.slice(0, 7).map((skill, idx) => {
                  const pct = skillPercentages[idx % skillPercentages.length];
                  return (
                    <div key={idx} className="sidebar-pro-bar-group">
                      <div className="sidebar-pro-bar-label">
                        <span>{skill}</span>
                        <span className="sidebar-pro-bar-pct">{pct}%</span>
                      </div>
                      <div className="sidebar-pro-progress-bg">
                        <div className="sidebar-pro-progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Languages in Sidebar */}
          {isSectionVisible('languages', customizations) && languages?.length > 0 && (
            <div className="sidebar-pro-sec">
              <h3 className="sidebar-pro-head">LANGUAGES</h3>
              <ul className="sidebar-pro-list">
                {languages.map((l, idx) => (
                  <li key={idx}>
                    <strong>{l.language}</strong> ({l.proficiency})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications in Sidebar */}
          {isSectionVisible('certifications', customizations) && certifications?.length > 0 && (
            <div className="sidebar-pro-sec">
              <h3 className="sidebar-pro-head">CERTIFICATIONS</h3>
              <ul className="sidebar-pro-list">
                {certifications.map((c, idx) => (
                  <li key={idx}>
                    <strong>{c.name}</strong> ({c.year})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interests in Sidebar */}
          {isSectionVisible('extras', customizations) && isSectionVisible('interests', customizations) && interests?.length > 0 && (
            <div className="sidebar-pro-sec">
              <h3 className="sidebar-pro-head">INTERESTS</h3>
              <div className="sidebar-pro-tags">
                {interests.map((int, idx) => (
                  <span key={idx} className="sidebar-pro-tag">{int}</span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Main Column (70% width): Summary, Experience, Education, Projects */}
        <main className="sidebar-pro-right">
          {/* Header Title in Main Column */}
          <div className="sidebar-pro-main-header">
            <h1 className="sidebar-pro-name">{fullName}</h1>
            <div className="sidebar-pro-title">{targetJobTitle}</div>
          </div>

          {/* Base: Summary */}
          {isSectionVisible('summary', customizations) && summary && (
            <section className="sidebar-pro-section">
              <h2 className="sidebar-pro-heading">PROFESSIONAL SUMMARY</h2>
              <p className="sidebar-pro-text">{summary}</p>
            </section>
          )}

          {/* Base: Work Experience */}
          {isSectionVisible('experience', customizations) && experience?.length > 0 && (
            <section className="sidebar-pro-section">
              <h2 className="sidebar-pro-heading">WORK EXPERIENCE</h2>
              {experience.map((exp, idx) => {
                const bullets = exp.generatedBullets ||
                  (exp.achievements
                    ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                    : [`Engineered scalable client applications at ${exp.company || 'Enterprise'}.`]);

                return (
                  <div key={exp.id || idx} className="sidebar-pro-entry">
                    <div className="sidebar-pro-row">
                      <strong className="sidebar-pro-role">{exp.role}</strong>
                      <span className="sidebar-pro-date">{exp.duration}</span>
                    </div>
                    <div className="sidebar-pro-sub">{exp.company} {exp.location && `— ${exp.location}`}</div>
                    <ul className="sidebar-pro-bullets">
                      {bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </section>
          )}

          {/* Base: Education */}
          {isSectionVisible('education', customizations) && education?.length > 0 && (
            <section className="sidebar-pro-section">
              <h2 className="sidebar-pro-heading">EDUCATION</h2>
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="sidebar-pro-entry">
                  <div className="sidebar-pro-row">
                    <strong>{edu.degree}</strong>
                    <span className="sidebar-pro-date">{edu.year}</span>
                  </div>
                  <div className="sidebar-pro-sub">{edu.school} {edu.location && `— ${edu.location}`}</div>
                </div>
              ))}
            </section>
          )}

          {/* Base: Projects */}
          {isSectionVisible('projects', customizations) && projects?.length > 0 && (
            <section className="sidebar-pro-section">
              <h2 className="sidebar-pro-heading">PROJECTS</h2>
              {projects.slice(0, 2).map((p, idx) => (
                <div key={p.id || idx} className="sidebar-pro-proj">
                  <strong>{p.title}:</strong> {p.description}
                </div>
              ))}
            </section>
          )}

          {/* Base: Achievements */}
          {isSectionVisible('achievements', customizations) && achievements?.length > 0 && (
            <section className="sidebar-pro-section">
              <h2 className="sidebar-pro-heading">KEY ACHIEVEMENTS</h2>
              <div className="sidebar-pro-ach-line">
                {achievements.map((a) => `${a.title} (${a.year})`).join(' • ')}
              </div>
            </section>
          )}
        </main>
      </div>
    </ResumeCanvasWrapper>
  );
};
