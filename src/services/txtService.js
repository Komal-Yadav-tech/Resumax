/**
 * Plain Text Resume Generation & Export Service for Resumax
 */

/**
 * Converts structured resume data into clean, readable plain text.
 * @param {Object} answers 
 * @param {Object} generatedContent 
 * @returns {string}
 */
export const generateResumePlainText = (answers = {}, generatedContent = null) => {
  const name = (answers.fullName || 'Professional').trim();
  const targetRole = answers.targetJobTitle || '';
  const contact = answers.contact || {};
  const summary =
    generatedContent?.summary ||
    answers.summary ||
    (answers.targetJobTitle
      ? `Results-driven and impact-focused ${answers.targetJobTitle} with a demonstrated history of delivering scalable solutions, optimizing cross-functional workflows, and exceeding organizational benchmarks.`
      : '');

  const experience = answers.experience || [];
  const education = answers.education || [];
  const skills = answers.skills || [];

  const lines = [];

  // 1. Name & Header
  lines.push('='.repeat(60));
  lines.push(name.toUpperCase());
  if (targetRole) {
    lines.push(targetRole);
  }
  lines.push('='.repeat(60));

  // 2. Contact Information
  const contactParts = [];
  if (contact.email) contactParts.push(`Email: ${contact.email}`);
  if (contact.phone) contactParts.push(`Phone: ${contact.phone}`);
  if (contact.location) contactParts.push(`Location: ${contact.location}`);
  if (contact.website) contactParts.push(`Portfolio: ${contact.website}`);
  if (contactParts.length > 0) {
    lines.push(contactParts.join(' | '));
    lines.push('');
  }

  // 3. Professional Summary
  if (summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('-'.repeat(40));
    lines.push(summary);
    lines.push('');
  }

  // 4. Work Experience
  if (experience.length > 0) {
    lines.push('WORK EXPERIENCE');
    lines.push('-'.repeat(40));

    experience.forEach((exp) => {
      const roleLine = `${exp.role || 'Contributor'} | ${exp.company || 'Company'}`;
      const metaLine = [exp.duration, exp.location].filter(Boolean).join(' | ');
      lines.push(roleLine);
      if (metaLine) lines.push(metaLine);

      const bullets = exp.generatedBullets && exp.generatedBullets.length > 0
        ? exp.generatedBullets
        : exp.achievements
          ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
          : [];

      bullets.forEach((b) => {
        const cleanBullet = b.replace(/^[•\-\*]\s*/, '').trim();
        lines.push(`  • ${cleanBullet}`);
      });
      lines.push('');
    });
  }

  // 5. Education
  if (education.length > 0) {
    lines.push('EDUCATION');
    lines.push('-'.repeat(40));

    education.forEach((edu) => {
      const degreeLine = `${edu.degree || 'Degree'} | ${edu.school || 'Institution'}`;
      const metaLine = [edu.year, edu.location].filter(Boolean).join(' | ');
      lines.push(degreeLine);
      if (metaLine) lines.push(metaLine);
      lines.push('');
    });
  }

  // 6. Skills
  if (skills.length > 0) {
    lines.push('SKILLS & COMPETENCIES');
    lines.push('-'.repeat(40));
    lines.push(skills.join(' • '));
    lines.push('');
  }

  return lines.join('\n');
};

/**
 * Triggers a browser download of the plain-text resume.
 * @param {Object} answers 
 * @param {Object} generatedContent 
 * @param {string} fileName 
 */
export const exportResumeToTxt = (answers, generatedContent, fileName = 'Resume.txt') => {
  const textContent = generateResumePlainText(answers, generatedContent);
  
  if (typeof window === 'undefined') {
    return textContent;
  }

  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
