import React from 'react';
import { Mail, Phone, MapPin, Globe, Sparkles, FolderGit2, Star, Heart } from 'lucide-react';
import { ResumeCanvasWrapper } from './ResumeCanvasWrapper';
import { normalizeResumeData, isSectionVisible } from './templateData';

export const CreativeTemplate = ({ answers, generatedContent, customizations = {} }) => {
  const data = normalizeResumeData(answers, generatedContent);
  const {
    fullName,
    targetJobTitle,
    contact,
    summary,
    stats,
    skills,
    interests,
    projects,
    experience,
    education,
    certifications,
    achievements,
    languages,
    photo
  } = data;

  const showPhoto = customizations.showPhoto && (customizations.photoUrl || photo);
  const photoSrc = customizations.photoUrl || photo;

  return (
    <ResumeCanvasWrapper templateId="creative" customizations={customizations} className="creative-template">
      {/* Creative Color-Blocked Header Card */}
      <header className="creative-header-card">
        <div className="creative-header-top">
          <div className="creative-header-left">
            {showPhoto && (
              <img src={photoSrc} alt={fullName} className="creative-avatar-photo" />
            )}
            <div>
              <div className="creative-tagline-pill">PORTFOLIO RESUME</div>
              <h1 className="creative-name">{fullName}</h1>
              <div className="creative-role">{targetJobTitle}</div>
            </div>
          </div>

          {/* Creative Extra: Highlights Stat Cards */}
          {isSectionVisible('extras', customizations) && stats?.length > 0 && (
            <div className="creative-stats-row">
              {stats.map((st, idx) => (
                <div key={idx} className="creative-stat-badge">
                  <div className="creative-stat-val">{st.value}</div>
                  <div className="creative-stat-lbl">{st.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact & Social Links Bar */}
        <div className="creative-social-bar">
          {contact.email && <span className="creative-contact-chip"><Mail size={11} /> {contact.email}</span>}
          {contact.phone && <span className="creative-contact-chip"><Phone size={11} /> {contact.phone}</span>}
          {contact.location && <span className="creative-contact-chip"><MapPin size={11} /> {contact.location}</span>}
          {contact.portfolio && <span className="creative-contact-chip"><Globe size={11} /> {contact.portfolio}</span>}
          {contact.github && <span className="creative-contact-chip"><FolderGit2 size={11} /> {contact.github}</span>}
        </div>
      </header>

      {/* Creative Extra: About Me */}
      {isSectionVisible('summary', customizations) && summary && (
        <section className="creative-card-block">
          <h2 className="creative-section-title">ABOUT ME</h2>
          <p className="creative-text">{summary}</p>
        </section>
      )}

      {/* Creative Extra: Skill Badges */}
      {isSectionVisible('skills', customizations) && skills?.length > 0 && (
        <section className="creative-card-block">
          <h2 className="creative-section-title">FEATURED SKILL BADGES</h2>
          <div className="creative-skills-grid">
            {skills.map((skill, idx) => (
              <span key={idx} className="creative-skill-badge">
                ★ {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Base: Experience */}
      {isSectionVisible('experience', customizations) && experience?.length > 0 && (
        <section className="creative-card-block">
          <h2 className="creative-section-title">WORK EXPERIENCE</h2>
          {experience.map((exp, idx) => {
            const bullets = exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [`Spearheaded product user experience at ${exp.company || 'Studio'}, driving 35% customer engagement.`]);

            return (
              <div key={exp.id || idx} className="creative-job-item">
                <div className="creative-job-header">
                  <strong>{exp.role}</strong>
                  <span className="creative-date-pill">{exp.duration}</span>
                </div>
                <div className="creative-company-sub">{exp.company} {exp.location && `| ${exp.location}`}</div>
                <ul className="creative-bullets">
                  {bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {/* Base: Projects & Portfolio Links */}
      {isSectionVisible('projects', customizations) && projects?.length > 0 && (
        <section className="creative-card-block">
          <h2 className="creative-section-title">FEATURED PROJECTS & PORTFOLIO</h2>
          <div className="creative-projects-grid">
            {projects.slice(0, 2).map((p, idx) => (
              <div key={idx} className="creative-proj-card">
                <div className="creative-proj-title">{p.title}</div>
                <div className="creative-proj-desc">{p.description}</div>
                {p.link && <div className="creative-proj-link">🔗 {p.link}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Base & Extras: Education, Languages & Interests */}
      <div className="creative-dual-grid">
        {isSectionVisible('education', customizations) && education?.length > 0 && (
          <div className="creative-card-block" style={{ margin: 0 }}>
            <h2 className="creative-section-title">EDUCATION</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="creative-edu-row">
                <strong>{edu.degree}</strong>
                <div>{edu.school} ({edu.year})</div>
              </div>
            ))}
          </div>
        )}

        <div className="creative-card-block" style={{ margin: 0 }}>
          <h2 className="creative-section-title">HONORS & INTERESTS</h2>
          {isSectionVisible('languages', customizations) && languages?.length > 0 && (
            <div className="creative-meta-line">
              <strong>Languages:</strong> {languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
            </div>
          )}
          {isSectionVisible('extras', customizations) && isSectionVisible('interests', customizations) && interests?.length > 0 && (
            <div className="creative-meta-line">
              <strong>Interests:</strong> {interests.join(' • ')}
            </div>
          )}
        </div>
      </div>
    </ResumeCanvasWrapper>
  );
};
