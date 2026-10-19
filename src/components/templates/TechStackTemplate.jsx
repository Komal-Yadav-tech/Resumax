import React from 'react';
import { Terminal, Github, ExternalLink, Code2, Award, Trophy } from 'lucide-react';
import { ResumeCanvasWrapper } from './ResumeCanvasWrapper';
import { normalizeResumeData, isSectionVisible } from './templateData';

export const TechStackTemplate = ({ answers, generatedContent, customizations = {} }) => {
  const data = normalizeResumeData(answers, generatedContent);
  const {
    fullName,
    targetJobTitle,
    contact,
    summary,
    techStack,
    openSource,
    hackathons,
    devCertifications,
    experience,
    projects,
    education,
    skills,
    certifications,
    achievements,
    languages,
    photo
  } = data;

  const showPhoto = customizations.showPhoto && (customizations.photoUrl || photo);
  const photoSrc = customizations.photoUrl || photo;

  return (
    <ResumeCanvasWrapper templateId="techstack" customizations={customizations} className="techstack-template">
      {/* Dev Terminal Header */}
      <header className="techstack-header">
        <div className="techstack-top-row">
          <div className="techstack-title-box">
            <div className="techstack-prompt-line">
              <span className="techstack-prompt">$ whoami</span>
            </div>
            <h1 className="techstack-name">{fullName}</h1>
            <div className="techstack-role">&lt;{targetJobTitle} /&gt;</div>
          </div>
          {showPhoto && (
            <img src={photoSrc} alt={fullName} className="resume-candidate-photo techstack-photo" />
          )}
        </div>

        {/* TechStack Extra: GitHub / Portfolio / Contact Links */}
        <div className="techstack-contact-terminal">
          <span className="techstack-meta-item">
            <strong>email:</strong> {contact.email}
          </span>
          <span className="techstack-meta-item">
            <strong>phone:</strong> {contact.phone}
          </span>
          <span className="techstack-meta-item">
            <strong>loc:</strong> {contact.location}
          </span>
          {contact.github && (
            <span className="techstack-meta-item techstack-link">
              <Github size={11} /> {contact.github}
            </span>
          )}
          {contact.portfolio && (
            <span className="techstack-meta-item techstack-link">
              <ExternalLink size={11} /> {contact.portfolio}
            </span>
          )}
        </div>
      </header>

      {/* TechStack Extra: Grouped Tech Stack (Languages, Frameworks, Tools) */}
      {isSectionVisible('skills', customizations) && (
        <section className="techstack-section">
          <div className="techstack-heading">// TECH STACK</div>
          <div className="techstack-grouped-box">
            {techStack?.languages?.length > 0 && (
              <div className="techstack-group-row">
                <span className="techstack-group-label">languages:</span>
                <div className="techstack-chips">
                  {techStack.languages.map((item, idx) => (
                    <span key={idx} className="techstack-chip">{item}</span>
                  ))}
                </div>
              </div>
            )}
            {techStack?.frameworks?.length > 0 && (
              <div className="techstack-group-row">
                <span className="techstack-group-label">frameworks:</span>
                <div className="techstack-chips">
                  {techStack.frameworks.map((item, idx) => (
                    <span key={idx} className="techstack-chip techstack-chip-accent">{item}</span>
                  ))}
                </div>
              </div>
            )}
            {techStack?.tools?.length > 0 && (
              <div className="techstack-group-row">
                <span className="techstack-group-label">tools & infra:</span>
                <div className="techstack-chips">
                  {techStack.tools.map((item, idx) => (
                    <span key={idx} className="techstack-chip techstack-chip-tool">{item}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Base: Summary */}
      {isSectionVisible('summary', customizations) && summary && (
        <section className="techstack-section">
          <div className="techstack-heading">// SUMMARY</div>
          <p className="techstack-text">{summary}</p>
        </section>
      )}

      {/* Base: Work Experience */}
      {isSectionVisible('experience', customizations) && experience?.length > 0 && (
        <section className="techstack-section">
          <div className="techstack-heading">// WORK EXPERIENCE</div>
          {experience.map((exp, idx) => {
            const bullets = exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [`Implemented resilient scalable micro-frontends at ${exp.company || 'Enterprise'}.`]);

            return (
              <div key={exp.id || idx} className="techstack-job">
                <div className="techstack-job-top">
                  <span className="techstack-job-role">{exp.role} @ {exp.company}</span>
                  <span className="techstack-date">[{exp.duration}]</span>
                </div>
                <ul className="techstack-bullets">
                  {bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {/* TechStack Extra: Open Source & Projects */}
      {isSectionVisible('projects', customizations) && (
        <section className="techstack-section">
          <div className="techstack-heading">// PROJECTS & OPEN SOURCE</div>
          {projects?.slice(0, 2).map((p, idx) => (
            <div key={`p-${idx}`} className="techstack-proj-row">
              <span className="techstack-proj-title">{p.title}</span>
              {p.link && <span className="techstack-proj-link">({p.link})</span>}:{' '}
              <span className="techstack-proj-desc">{p.description}</span>
            </div>
          ))}
          {isSectionVisible('extras', customizations) && openSource?.map((os, idx) => (
            <div key={`os-${idx}`} className="techstack-proj-row">
              <span className="techstack-oss-badge">OSS</span>{' '}
              <strong>{os.repo}:</strong> {os.contribution}
            </div>
          ))}
        </section>
      )}

      {/* TechStack Extra: Hackathons, Dev Certifications & Education */}
      <div className="techstack-dual-row">
        {isSectionVisible('education', customizations) && education?.length > 0 && (
          <div className="techstack-col">
            <div className="techstack-heading">// EDUCATION</div>
            {education.map((edu, idx) => (
              <div key={idx} className="techstack-edu-item">
                <div className="techstack-edu-degree">{edu.degree}</div>
                <div className="techstack-edu-meta">{edu.school} ({edu.year})</div>
              </div>
            ))}
          </div>
        )}

        {isSectionVisible('extras', customizations) && (hackathons?.length > 0 || devCertifications?.length > 0) && (
          <div className="techstack-col">
            <div className="techstack-heading">// HACKATHONS & CERTIFICATIONS</div>
            {hackathons?.map((h, idx) => (
              <div key={`h-${idx}`} className="techstack-hack-item">
                🏆 <strong>{h.event}</strong>: {h.award}
              </div>
            ))}
            {(devCertifications || certifications)?.slice(0, 2).map((dc, idx) => (
              <div key={`dc-${idx}`} className="techstack-cert-item">
                ⚡ {typeof dc === 'string' ? dc : dc.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Base: Languages */}
      {isSectionVisible('languages', customizations) && languages?.length > 0 && (
        <div className="techstack-lang-bar">
          <span className="techstack-meta-item">
            <strong>spoken_languages:</strong> [
            {languages.map((l) => `"${l.language} (${l.proficiency})"`).join(', ')}]
          </span>
        </div>
      )}
    </ResumeCanvasWrapper>
  );
};
