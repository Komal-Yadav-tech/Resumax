import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Wand2,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Tag
} from 'lucide-react';
import { STEPS } from './StepIndicator';
import logoImg from '../../assets/logo.png';

const POPULAR_SKILLS = [
  'JavaScript',
  'React.js',
  'TypeScript',
  'Node.js',
  'Python',
  'SQL',
  'Git & GitHub',
  'Project Management',
  'Agile / Scrum',
  'UI/UX Design',
  'Data Analysis',
  'Cross-Functional Leadership'
];

export const QAStepForm = ({
  answers,
  setAnswers,
  currentStep,
  setCurrentStep,
  onGenerateResume,
  isGenerating,
  isGenerated
}) => {
  const [skillInput, setSkillInput] = useState('');
  const [stepError, setStepError] = useState('');

  // Contact Info Change
  const handleContactChange = (field, value) => {
    setAnswers((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  // Target Role Change
  const handleRoleChange = (field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Experience Handlers
  const handleAddExperience = () => {
    setAnswers((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          company: '',
          role: '',
          duration: '',
          location: '',
          achievements: ''
        }
      ]
    }));
  };

  const handleRemoveExperience = (index) => {
    setAnswers((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setAnswers((prev) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  // Education Handlers
  const handleAddEducation = () => {
    setAnswers((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          school: '',
          degree: '',
          year: '',
          location: ''
        }
      ]
    }));
  };

  const handleRemoveEducation = (index) => {
    setAnswers((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setAnswers((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  // Skill Handlers
  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || skillInput).trim();
    if (!trimmed) return;
    if (!answers.skills.includes(trimmed)) {
      setAnswers((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed]
      }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setAnswers((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  // Step Validation & Navigation
  const handleNextStep = () => {
    setStepError('');

    if (currentStep === 1) {
      if (!answers.fullName?.trim()) {
        setStepError('Please enter your full name.');
        return;
      }
      if (!answers.contact?.email?.trim()) {
        setStepError('Please enter your email address.');
        return;
      }
    }

    if (currentStep === 2) {
      if (!answers.targetJobTitle?.trim()) {
        setStepError('Please enter your target job title.');
        return;
      }
    }

    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStepError('');
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="qa-form-container">
      {stepError && (
        <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
          <span>{stepError}</span>
        </div>
      )}

      {/* Step 1: Contact Information */}
      {currentStep === 1 && (
        <div className="qa-step-card">
          <div className="qa-step-header">
            <div className="qa-step-badge">
              <User size={16} /> Step 1 of 6
            </div>
            <h2>Let's start with your contact details</h2>
            <p>Employers need to know who you are and the best way to reach you.</p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="qa-fullName">
              Full Name *
            </label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                id="qa-fullName"
                type="text"
                className="form-input input-with-icon"
                placeholder="e.g. Alex Morgan"
                value={answers.fullName}
                onChange={(e) => setAnswers({ ...answers, fullName: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="qa-email">
                Email Address *
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="qa-email"
                  type="email"
                  className="form-input input-with-icon"
                  placeholder="alex.morgan@example.com"
                  value={answers.contact.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="qa-phone">
                Phone Number
              </label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={18} />
                <input
                  id="qa-phone"
                  type="tel"
                  className="form-input input-with-icon"
                  placeholder="+1 (555) 234-5678"
                  value={answers.contact.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="qa-location">
                Location (City, Country)
              </label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={18} />
                <input
                  id="qa-location"
                  type="text"
                  className="form-input input-with-icon"
                  placeholder="San Francisco, CA"
                  value={answers.contact.location}
                  onChange={(e) => handleContactChange('location', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="qa-website">
                LinkedIn or Portfolio URL
              </label>
              <div className="input-wrapper">
                <Globe className="input-icon" size={18} />
                <input
                  id="qa-website"
                  type="url"
                  className="form-input input-with-icon"
                  placeholder="linkedin.com/in/alexmorgan"
                  value={answers.contact.website}
                  onChange={(e) => handleContactChange('website', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Target Job Title */}
      {currentStep === 2 && (
        <div className="qa-step-card">
          <div className="qa-step-header">
            <div className="qa-step-badge">
              <Briefcase size={16} /> Step 2 of 6
            </div>
            <h2>What role are you targeting?</h2>
            <p>Resumax will tailor the AI summary and bullet points to match this job title.</p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="qa-targetJobTitle">
              Target Job Title *
            </label>
            <div className="input-wrapper">
              <Briefcase className="input-icon" size={18} />
              <input
                id="qa-targetJobTitle"
                type="text"
                className="form-input input-with-icon"
                placeholder="e.g. Senior Frontend Engineer, Product Manager, Data Analyst"
                value={answers.targetJobTitle}
                onChange={(e) => handleRoleChange('targetJobTitle', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="qa-experienceLevel">
              Experience Level
            </label>
            <select
              id="qa-experienceLevel"
              className="form-input"
              value={answers.experienceLevel || 'Mid-Level'}
              onChange={(e) => handleRoleChange('experienceLevel', e.target.value)}
            >
              <option value="Entry-Level">Entry-Level (0-2 years)</option>
              <option value="Mid-Level">Mid-Level (2-5 years)</option>
              <option value="Senior-Level">Senior-Level (5-8 years)</option>
              <option value="Lead / Executive">Lead / Manager / Executive (8+ years)</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 3: Work Experience */}
      {currentStep === 3 && (
        <div className="qa-step-card">
          <div className="qa-step-header">
            <div className="qa-step-badge">
              <Briefcase size={16} /> Step 3 of 6
            </div>
            <h2>Tell us about your work experience</h2>
            <p>Add your relevant job roles. Don't worry about perfect phrasing—our AI will polish it!</p>
          </div>

          {answers.experience.map((exp, index) => (
            <div key={exp.id || index} className="qa-entry-card">
              <div className="qa-entry-header">
                <h4>Experience #{index + 1}</h4>
                {answers.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(index)}
                    className="btn btn-destructive btn-sm"
                    title="Remove experience"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Acme Corp"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Title / Role *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Software Engineer"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Duration *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Jan 2022 – Present"
                    value={exp.duration}
                    onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. New York, NY (or Remote)"
                    value={exp.location}
                    onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Key Achievements / Responsibilities
                  <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    (Separate points with new lines)
                  </span>
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="e.g. Built a customer onboarding flow that increased activation by 20%&#10;Managed team of 4 engineers and led daily standups"
                  value={exp.achievements}
                  onChange={(e) => handleExperienceChange(index, 'achievements', e.target.value)}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddExperience}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <Plus size={16} /> Add Another Experience
          </button>
        </div>
      )}

      {/* Step 4: Education */}
      {currentStep === 4 && (
        <div className="qa-step-card">
          <div className="qa-step-header">
            <div className="qa-step-badge">
              <GraduationCap size={16} /> Step 4 of 6
            </div>
            <h2>Education & Academic Background</h2>
            <p>Add your degrees, certifications, or coursework.</p>
          </div>

          {answers.education.map((edu, index) => (
            <div key={edu.id || index} className="qa-entry-card">
              <div className="qa-entry-header">
                <h4>Education #{index + 1}</h4>
                {answers.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(index)}
                    className="btn btn-destructive btn-sm"
                    title="Remove education"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">School / University *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Stanford University"
                    value={edu.school}
                    onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Degree & Field of Study *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. B.S. in Computer Science"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Graduation Year / Dates</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 2020 – 2024"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Stanford, CA"
                    value={edu.location}
                    onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddEducation}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <Plus size={16} /> Add Another Education
          </button>
        </div>
      )}

      {/* Step 5: Skills */}
      {currentStep === 5 && (
        <div className="qa-step-card">
          <div className="qa-step-header">
            <div className="qa-step-badge">
              <Tag size={16} /> Step 5 of 6
            </div>
            <h2>What are your key skills & competencies?</h2>
            <p>Type custom skills or click popular suggestions to add them to your resume.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Add a Skill</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. GraphQL, Tailwind CSS, Leadership"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
          </div>

          {/* Selected Skills Tags */}
          <div className="form-group">
            <label className="form-label">Your Skills ({answers.skills.length})</label>
            <div className="skills-tags-container">
              {answers.skills.length === 0 ? (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No skills added yet. Choose from below or type above.
                </span>
              ) : (
                answers.skills.map((skill) => (
                  <span key={skill} className="skill-badge">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="skill-remove-btn"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Popular Skill Suggestions */}
          <div className="popular-skills-section">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              💡 Quick Suggestions (click to add):
            </span>
            <div className="popular-skills-chips">
              {POPULAR_SKILLS.filter((s) => !answers.skills.includes(s)).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="skill-chip-suggestion"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 6: Review & AI Generator */}
      {currentStep === 6 && (
        <div className="qa-step-card">
          <div className="qa-step-header">
            <div className="qa-step-badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <img src={logoImg} alt="AI" style={{ width: 16, height: 16, borderRadius: 'var(--radius-sm)' }} /> Final Step
            </div>
            <h2>Generate Your AI-Powered Resume</h2>
            <p>
              We've gathered all your information. Click below to craft an ATS-optimized summary and
              high-impact bullet points.
            </p>
          </div>

          <div
            style={{
              padding: '1.25rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>{answers.fullName || 'Your Name'}</strong>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{answers.targetJobTitle}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              {answers.contact.email} • {answers.contact.location || 'Remote'} • {answers.skills.length} Skills Listed
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
            }}
            onClick={onGenerateResume}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>AI Generating Resume Content...</span>
              </>
            ) : (
              <>
                <Wand2 size={18} />
                <span>{isGenerated ? 'Regenerate AI Content' : 'Generate Professional Resume'}</span>
              </>
            )}
          </button>

          {isGenerated && (
            <div
              className="alert alert-success"
              style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <CheckCircle2 size={18} />
              <span>Resume generated successfully! Check the live preview on the right.</span>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="qa-navigation-bar">
        <button
          type="button"
          onClick={handlePrevStep}
          className="btn btn-secondary"
          disabled={currentStep === 1}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {currentStep < STEPS.length ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="btn btn-primary"
          >
            Continue <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="btn btn-outline btn-sm"
          >
            Edit from Beginning
          </button>
        )}
      </div>
    </div>
  );
};
