import React from 'react';
import { Mail, Phone, MapPin, Globe, Sparkles } from 'lucide-react';
import { ResumeCanvasWrapper } from './ResumeCanvasWrapper';
import { normalizeResumeData, isSectionVisible } from './templateData';

export const ModernTemplate = ({ answers, generatedContent, customizations = {} }) => {
  const data = normalizeResumeData(answers, generatedContent);
  const {
    fullName,
    targetJobTitle,
    contact,
    summary,
    skills,
    softSkills,
    experience,
    education,
    projects,
    certifications,
    achievements,
    languages,
    interests,
    photo
  } = data;

  const showPhoto = customizations.showPhoto && (customizations.photoUrl || photo);
  const photoSrc = customizations.photoUrl || photo;

  return (
    <ResumeCanvasWrapper templateId="modern" customizations={customizations} className="modern-template">
      {/* Modern Gradient Header & Profile Card */}
      <header className="modern-header-band">
        <div className="modern-profile-card">
          <div className="modern-profile-left">
            {showPhoto && (
              <img src={photoSrc} alt={fullName} className="resume-candidate-photo modern-avatar-photo" />
            )}
            <div>
              <h1 className="modern-name">{fullName}</h1>
              <p className="modern-title">{targetJobTitle}</p>
            </div>
          </div>
          <div className="modern-contact-pills-row">
            {contact.email && (
              <span className="modern-contact-pill">
                <Mail size={11} /> {contact.email}
              </span>
            )}
            {contact.phone && (
              <span className="modern-contact-pill">
                <Phone size={11} /> {contact.phone}
              </span>
            )}
            {contact.location && (
              <span className="modern-contact-pill">
                <MapPin size={11} /> {contact.location}
              </span>
            )}
            {contact.website && (
              <span className="modern-contact-pill">
                <Globe size={11} /> {contact.website}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Modern Extra: Summary Profile Card */}
      {isSectionVisible('summary', customizations) && summary && (
        <section className="modern-section">
          <div className="modern-category-tag">
            <span>ABOUT ME</span>
          </div>
          <p className="modern-summary-text">{summary}</p>
        </section>
      )}

      {/* Modern Extra: Skill Pills & Soft Skills Bar */}
      {isSectionVisible('skills', customizations) && (
        <section className="modern-section">
          <div className="modern-category-tag">
            <span>CORE COMPETENCIES & SKILL PILLS</span>
          </div>
          <div className="modern-skills-pill-wrap">
            {skills?.map((skill, sIdx) => (
              <span key={sIdx} className="modern-skill-pill">
                {skill}
              </span>
            ))}
          </div>
          {/* Soft Skills Bar */}
          {isSectionVisible('extras', customizations) && softSkills?.length > 0 && (
            <div className="modern-soft-skills-bar">
              <span className="modern-soft-label">Strengths:</span>
              {softSkills.map((ss, idx) => (
                <span key={idx} className="modern-soft-badge">
                  ✓ {ss}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Base: Experience */}
      {isSectionVisible('experience', customizations) && experience?.length > 0 && (
        <section className="modern-section">
          <div className="modern-category-tag">
            <span>WORK EXPERIENCE</span>
          </div>
          {experience.map((exp, idx) => {
            const bullets = exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [`Drove technical deliverables at ${exp.company || 'Enterprise'}, boosting product reliability.`]);

            return (
              <div key={exp.id || idx} className="modern-job-card">
                <div className="modern-job-header">
                  <div>
                    <span className="modern-role">{exp.role}</span>
                    <span className="modern-company"> @ {exp.company}</span>
                  </div>
                  <span className="modern-date-badge">{exp.duration}</span>
                </div>
                {exp.location && <div className="modern-location-sub">{exp.location}</div>}
                <ul className="modern-bullets">
                  {bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {/* Base: Education & Projects Grid */}
      <div className="modern-dual-grid">
        {isSectionVisible('education', customizations) && education?.length > 0 && (
          <div className="modern-col">
            <div className="modern-category-tag">
              <span>EDUCATION</span>
            </div>
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="modern-edu-item">
                <div className="modern-edu-degree">{edu.degree}</div>
                <div className="modern-edu-school">{edu.school} ({edu.year})</div>
              </div>
            ))}
          </div>
        )}

        {isSectionVisible('projects', customizations) && projects?.length > 0 && (
          <div className="modern-col">
            <div className="modern-category-tag">
              <span>FEATURED PROJECTS</span>
            </div>
            {projects.slice(0, 2).map((proj, idx) => (
              <div key={proj.id || idx} className="modern-proj-item">
                <div className="modern-proj-title">{proj.title}</div>
                <div className="modern-proj-desc">{proj.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Base: Certifications & Interests */}
      <div className="modern-dual-grid">
        {isSectionVisible('certifications', customizations) && certifications?.length > 0 && (
          <div className="modern-col">
            <div className="modern-category-tag">
              <span>CERTIFICATIONS</span>
            </div>
            <div className="modern-cert-list">
              {certifications.map((c, idx) => (
                <div key={idx} className="modern-cert-row">
                  ★ <strong>{c.name}</strong> ({c.year})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modern Extra: Interests & Languages */}
        <div className="modern-col">
          {isSectionVisible('languages', customizations) && languages?.length > 0 && (
            <div style={{ marginBottom: '0.4rem' }}>
              <div className="modern-category-tag">
                <span>LANGUAGES</span>
              </div>
              <div className="modern-lang-line">
                {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
              </div>
            </div>
          )}
          {isSectionVisible('extras', customizations) && isSectionVisible('interests', customizations) && interests?.length > 0 && (
            <div>
              <div className="modern-category-tag">
                <span>INTERESTS</span>
              </div>
              <div className="modern-interests-line">{interests.join(' • ')}</div>
            </div>
          )}
        </div>
      </div>
    </ResumeCanvasWrapper>
  );
};
