import React from 'react';
import { BookOpen, Award, GraduationCap, FileText } from 'lucide-react';

export const AcademicTemplate = ({ answers = {}, generatedContent }) => {
  const {
    fullName = 'Alex Morgan, Ph.D.',
    contact = {},
    targetJobTitle = 'Principal Research Scientist',
    experience = [],
    education = [],
    skills = []
  } = answers;

  const summary =
    generatedContent?.summary ||
    `Distinguished researcher and educator in computer systems and computational intelligence. Author of peer-reviewed publications across top-tier international venues with a focus on distributed algorithms, scalable machine learning frameworks, and robust software architectures.`;

  return (
    <div className="resume-paper academic-template" id="resume-export-target">
      {/* Formal Academic Header */}
      <header className="academic-header">
        <h1 className="academic-name">{fullName || 'Alex Morgan'}</h1>
        <p className="academic-discipline">{targetJobTitle || 'Research Scientist & Academic Fellow'}</p>
        <div className="academic-contact">
          {[
            contact.email || 'alex.morgan@berkeley.edu',
            contact.phone || '+1 (555) 234-5678',
            contact.location || 'Berkeley, CA',
            contact.website || 'scholar.google.com/citations?user=alexmorgan'
          ]
            .filter(Boolean)
            .join('   |   ')}
        </div>
        <div className="academic-rule-double" />
      </header>

      {/* Curriculum Vitae Abstract / Summary */}
      <section className="academic-section">
        <h2 className="academic-heading">Research Profile & Interests</h2>
        <p className="academic-text">{summary}</p>
      </section>

      {/* Education & Academic Degrees */}
      <section className="academic-section">
        <h2 className="academic-heading">Education & Academic Degrees</h2>
        {education.length === 0 ? (
          <div className="academic-entry">
            <div className="academic-row">
              <strong>Ph.D. in Computer Science</strong>
              <span>2020 – 2024</span>
            </div>
            <div className="academic-row-sub">University of California, Berkeley</div>
            <p className="academic-subtext">Dissertation: "Scalable Distributed State Coordination in Low-Latency Environments"</p>
          </div>
        ) : (
          education.map((edu, idx) => (
            <div key={edu.id || idx} className="academic-entry">
              <div className="academic-row">
                <strong>{edu.degree || 'Degree'}</strong>
                <span>{edu.year || 'Year'}</span>
              </div>
              <div className="academic-row-sub">
                {edu.school || 'Institution'}{edu.location ? `, ${edu.location}` : ''}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Publications & Research Section (Key Requirement) */}
      <section className="academic-section">
        <h2 className="academic-heading">Publications & Peer-Reviewed Research</h2>
        <div className="academic-pub-list">
          <div className="academic-pub-item">
            <span className="academic-pub-num">[1]</span>
            <div className="academic-pub-citation">
              <strong>Morgan, A.</strong>, & Chen, L. (2023). "Optimizing Reactive Data Flow Pipelines for Multi-Tenant Cloud Architectures." <em>Proceedings of the IEEE International Conference on Software Engineering (ICSE)</em>, 142–156.
            </div>
          </div>
          <div className="academic-pub-item">
            <span className="academic-pub-num">[2]</span>
            <div className="academic-pub-citation">
              <strong>Morgan, A.</strong>, Patel, R., & Davis, K. (2022). "Empirical Evaluation of Asynchronous State Reconciliation Algorithms." <em>ACM Transactions on Computer Systems (TOCS)</em>, 40(3), 88–104.
            </div>
          </div>
          <div className="academic-pub-item">
            <span className="academic-pub-num">[3]</span>
            <div className="academic-pub-citation">
              <strong>Morgan, A.</strong> (2021). "Type-Safe Architectural Abstractions for Modern Web Applications." <em>Journal of Systems and Software</em>, 178, 110960.
            </div>
          </div>
        </div>
      </section>

      {/* Academic & Professional Appointments (Experience) */}
      <section className="academic-section">
        <h2 className="academic-heading">Academic & Professional Appointments</h2>
        {experience.length === 0 ? (
          <p className="academic-text" style={{ fontStyle: 'italic', color: '#666' }}>
            No appointments listed yet.
          </p>
        ) : (
          experience.map((exp, idx) => {
            const bullets =
              exp.generatedBullets ||
              (exp.achievements
                ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
                : [
                    `Conducted primary research as ${exp.role || 'Senior Researcher'} at ${exp.company || 'Institute'}, securing $450K in exploratory grants.`,
                    `Supervised 6 doctoral candidates and led graduate-level seminars on distributed computing.`
                  ]);

            return (
              <div key={exp.id || idx} className="academic-entry">
                <div className="academic-row">
                  <strong>{exp.role || 'Research Fellow'}</strong>
                  <span>{exp.duration || '2022 – Present'}</span>
                </div>
                <div className="academic-row-sub">
                  <span>{exp.company || 'Research Institute'}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                <ul className="academic-bullets">
                  {bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </section>

      {/* Core Competencies & Methodologies */}
      <section className="academic-section">
        <h2 className="academic-heading">Technical Methodologies & Domain Expertise</h2>
        <p className="academic-text">
          {skills.length > 0
            ? skills.join(' • ')
            : 'Distributed Systems • Statistical Modeling • Algorithmic Optimization • Python & R • TypeScript • High-Performance Computing • Peer Review • Research Grant Administration'}
        </p>
      </section>
    </div>
  );
};
