import { checkAtsContent } from './aiService.js';

const POWER_ACTION_VERBS = [
  'spearheaded', 'engineered', 'architected', 'developed', 'implemented',
  'orchestrated', 'optimized', 'accelerated', 'transformed', 'delivered',
  'designed', 'built', 'reduced', 'increased', 'generated', 'streamlined',
  'championed', 'formulated', 'executed', 'established', 'led', 'mentored',
  'automated', 'deployed', 'scaled', 'integrated', 'maximized', 'authored'
];

const WEAK_ACTION_PHRASES = [
  'responsible for', 'helped with', 'assisted with', 'worked on',
  'participated in', 'handled', 'did', 'was involved in', 'duties included'
];

export const ATS_DISCLAIMER =
  '⚠️ ATS Disclaimer: Applicant Tracking Systems (ATS) algorithms vary by software vendor (Workday, Taleo, Greenhouse, iCIMS). A high score maximizes automated readability and keyword alignment, but does not guarantee job interviews or hiring decisions. Resumax never fabricates or invents candidate qualifications.';

/**
 * Simulates raw text extraction as parsed by standard enterprise ATS engines
 * @param {Object} resumeData 
 * @returns {string}
 */
export const simulateAtsTextExtraction = (resumeData = {}) => {
  const answers = resumeData.answers || resumeData || {};
  const contact = answers.contact || {};
  const experience = answers.experience || [];
  const education = answers.education || [];
  const skills = answers.skills || [];

  const lines = [];

  // Header
  lines.push('============================================================');
  lines.push((answers.fullName || 'CANDIDATE NAME').toUpperCase());
  if (answers.targetJobTitle) lines.push(answers.targetJobTitle.toUpperCase());
  lines.push('============================================================');

  // Contact
  const contactParts = [contact.email, contact.phone, contact.location, contact.website, contact.github, contact.portfolio].filter(Boolean);
  if (contactParts.length > 0) {
    lines.push(contactParts.join(' | '));
  }
  lines.push('');

  // Summary
  if (answers.summary || resumeData.generatedContent?.summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('--------------------');
    lines.push(resumeData.generatedContent?.summary || answers.summary);
    lines.push('');
  }

  // Experience
  if (experience.length > 0) {
    lines.push('WORK EXPERIENCE');
    lines.push('---------------');
    experience.forEach((exp) => {
      lines.push(`${exp.role || 'Role'} | ${exp.company || 'Company'} | ${exp.duration || ''} | ${exp.location || ''}`);
      const bullets = exp.generatedBullets || (exp.achievements ? exp.achievements.split('\n').filter(Boolean) : []);
      bullets.forEach((b) => {
        lines.push(`• ${b.replace(/^[•\-\*]\s*/, '')}`);
      });
      lines.push('');
    });
  }

  // Education
  if (education.length > 0) {
    lines.push('EDUCATION');
    lines.push('---------');
    education.forEach((edu) => {
      lines.push(`${edu.degree || 'Degree'} - ${edu.school || 'School'} (${edu.year || ''})`);
    });
    lines.push('');
  }

  // Skills
  if (skills.length > 0) {
    lines.push('SKILLS');
    lines.push('------');
    lines.push(skills.join(', '));
    lines.push('');
  }

  return lines.join('\n');
};

/**
 * Detailed ATS multi-category audit
 */
export const checkDetailedAtsCompliance = (resumeData = {}, selectedTemplate = 'classic') => {
  const answers = resumeData.answers || resumeData || {};
  const contact = answers.contact || {};
  const experience = answers.experience || [];
  const education = answers.education || [];
  const skills = answers.skills || [];
  const rawText = answers.rawText || '';

  const issues = [];

  // 1. Contact Details Check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const contactIssues = [];

  if (!answers.fullName || answers.fullName.trim().length < 2) {
    contactIssues.push('Full candidate name is missing or too short.');
  }
  if (!contact.email || (!emailRegex.test(contact.email.trim()) && !rawText.includes('@'))) {
    contactIssues.push('Valid professional email address is missing.');
  }
  if (!contact.phone || (!phoneRegex.test(contact.phone) && !rawText.match(/\d{3}[-\s.]?\d{3}[-\s.]?\d{4}/))) {
    contactIssues.push('Direct phone number is missing or poorly formatted.');
  }
  if (!contact.location && !rawText.match(/(remote|hybrid|[a-z]+,\s*[a-z]{2})/i)) {
    contactIssues.push('City/State location is missing (used by recruiter geo-filters).');
  }

  // 2. Headings Check
  const headingIssues = [];
  if (!answers.summary && !resumeData.generatedContent?.summary && !rawText.match(/(summary|profile|about)/i)) {
    headingIssues.push('Professional Summary section is missing.');
  }
  if (experience.length === 0 && !rawText.match(/(experience|employment|work history)/i)) {
    headingIssues.push('Standard Work Experience section is missing.');
  }
  if (education.length === 0 && !rawText.match(/(education|degree|university)/i)) {
    headingIssues.push('Education section is missing.');
  }
  if (skills.length < 3 && !rawText.match(/(skills|technologies)/i)) {
    headingIssues.push('Skills section should contain at least 3-5 core competencies.');
  }

  // 3. Formatting & Parseability Check
  const formattingIssues = [];
  const ATS_SAFE_TEMPLATES = ['classic', 'ats-pro', 'ats-simple', 'ats-compact', 'academic'];
  const isAtsSafeTmpl = ATS_SAFE_TEMPLATES.includes(selectedTemplate);

  if (!isAtsSafeTmpl) {
    formattingIssues.push(`Template "${selectedTemplate}" uses visual design blocks. For highest automated ATS score, choose an ATS-Safe template.`);
  }

  // 4. Dates & Chronology Check
  const dateIssues = [];
  const datePattern = /(\b20\d{2}\b|\b19\d{2}\b|present|current|\b\d{1,2}\/\d{2,4}\b)/i;
  let missingExpDates = 0;
  experience.forEach((exp) => {
    if (!exp.duration || !datePattern.test(exp.duration)) {
      missingExpDates++;
    }
  });
  if (missingExpDates > 0) {
    dateIssues.push(`${missingExpDates} position(s) are missing clear date ranges (e.g. 2021 – Present).`);
  }

  // 5. Links Check
  const linkIssues = [];
  const urlPattern = /(https?:\/\/|www\.|linkedin\.com|github\.com|[a-z0-9]+\.[a-z]{2,})/i;
  const linksProvided = [contact.website, contact.github, contact.portfolio].filter(Boolean);
  linksProvided.forEach((l) => {
    if (!urlPattern.test(l)) {
      linkIssues.push(`Link "${l}" does not appear to be a valid web URL.`);
    }
  });

  // 6. Readability & Bullet Length
  const readabilityIssues = [];
  let totalBullets = 0;
  let wordCount = 0;
  experience.forEach((exp) => {
    const bullets = exp.generatedBullets || (exp.achievements ? exp.achievements.split('\n').filter(Boolean) : []);
    totalBullets += bullets.length;
    bullets.forEach((b) => {
      const words = b.split(/\s+/).length;
      wordCount += words;
      if (words > 50) {
        readabilityIssues.push(`Bullet point is too lengthy (${words} words). Aim for 15-35 words per bullet for rapid recruiter scanning.`);
      }
    });
  });

  const plainText = simulateAtsTextExtraction(resumeData);

  return {
    contactStatus: { passed: contactIssues.length === 0, issues: contactIssues },
    headingStatus: { passed: headingIssues.length === 0, issues: headingIssues },
    formattingStatus: { passed: formattingIssues.length === 0, isAtsSafeTemplate: isAtsSafeTmpl, issues: formattingIssues },
    dateStatus: { passed: dateIssues.length === 0, issues: dateIssues },
    linkStatus: { passed: linkIssues.length === 0, issues: linkIssues },
    readabilityStatus: { passed: readabilityIssues.length === 0, totalBullets, issues: readabilityIssues },
    plainTextExtraction: plainText
  };
};

/**
 * Calculates rule-based formatting score out of 100
 * @param {Object} resumeData 
 * @param {string} selectedTemplate 
 * @returns {Object} { score, breakdown, feedback }
 */
export const calculateFormatScore = (resumeData = {}, selectedTemplate = 'classic') => {
  let score = 0;
  const breakdown = {
    contactCompleteness: 0,
    sectionHeaders: 0,
    templateSafety: 0,
    lengthAndDensity: 0
  };
  const feedback = [];

  const answers = resumeData.answers || resumeData;
  const rawText = answers.rawText || '';
  const contact = answers.contact || {};
  const experience = answers.experience || [];
  const education = answers.education || [];
  const skills = answers.skills || [];

  // 1. Contact Information Completeness (Max 30 pts)
  let contactScore = 0;
  const hasName = Boolean(answers.fullName && answers.fullName.trim().length >= 2);
  if (hasName) contactScore += 8;
  else feedback.push({ type: 'warning', text: 'Add your full candidate name in the header.' });

  const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  const hasEmail = Boolean((contact.email && emailPattern.test(contact.email)) || (rawText && emailPattern.test(rawText)));
  if (hasEmail) contactScore += 8;
  else feedback.push({ type: 'critical', text: 'Provide a valid professional email address.' });

  const phonePattern = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const hasPhone = Boolean((contact.phone && contact.phone.trim().length >= 7) || (rawText && phonePattern.test(rawText)));
  if (hasPhone) contactScore += 7;
  else feedback.push({ type: 'warning', text: 'Include a contact phone number.' });

  const hasLocation = Boolean((contact.location && contact.location.trim().length >= 2) || (rawText && /(remote|hybrid|[a-z]+,\s*[a-z]{2})/i.test(rawText)));
  if (hasLocation) contactScore += 7;
  else feedback.push({ type: 'info', text: 'Add your city and state/country for recruiter location filters.' });

  breakdown.contactCompleteness = contactScore;
  score += contactScore;

  // 2. Standard Section Headers (Max 35 pts)
  let headerScore = 0;
  const hasSummary = Boolean(resumeData.generatedContent?.summary || answers.targetJobTitle || (rawText && /(summary|objective|profile|about me)/i.test(rawText)));
  if (hasSummary) headerScore += 8;
  else feedback.push({ type: 'warning', text: 'Include a Professional Summary section.' });

  const hasExperience = Boolean(experience.length > 0 || (rawText && /(experience|work history|employment|career history)/i.test(rawText)));
  if (hasExperience) {
    headerScore += 12;
  } else {
    feedback.push({ type: 'critical', text: 'Add at least one Work Experience section with role and company.' });
  }

  const hasEducation = Boolean(education.length > 0 || (rawText && /(education|university|college|bachelor|master|b\.s|b\.a|degree)/i.test(rawText)));
  if (hasEducation) {
    headerScore += 8;
  } else {
    feedback.push({ type: 'warning', text: 'Include an Education section with your school/degree.' });
  }

  const hasSkills = Boolean(skills.length >= 3 || (rawText && /(skills|technologies|proficiencies|competencies)/i.test(rawText)));
  if (hasSkills) {
    headerScore += 7;
  } else {
    feedback.push({ type: 'warning', text: 'List at least 3-5 core technical or professional skills.' });
  }

  breakdown.sectionHeaders = headerScore;
  score += headerScore;

  // 3. Template ATS Safety (Max 20 pts)
  const ATS_SAFE_TEMPLATES = ['classic', 'ats-pro', 'ats-simple', 'ats-compact', 'academic'];
  let tmplScore = 15;
  if (ATS_SAFE_TEMPLATES.includes(selectedTemplate)) {
    tmplScore = 20;
  } else if (selectedTemplate === 'minimal') {
    tmplScore = 18;
  } else {
    tmplScore = 15;
  }
  breakdown.templateSafety = tmplScore;
  score += tmplScore;

  if (!ATS_SAFE_TEMPLATES.includes(selectedTemplate)) {
    feedback.push({
      type: 'tip',
      text: 'For highest ATS parse rate, choose an ATS-Safe template (Classic, ATS Pro, ATS Simple, ATS Compact, Academic).'
    });
  }

  // 4. Content Density & Length (Max 15 pts)
  let densityScore = 15;
  let totalBullets = experience.reduce((acc, exp) => {
    const bCount = exp.generatedBullets?.length || (exp.achievements ? exp.achievements.split('\n').filter(Boolean).length : 0);
    return acc + bCount;
  }, 0);

  if (rawText && totalBullets < 2) {
    const rawBulletMatches = rawText.match(/^[•\-\*]\s*.+/gm) || rawText.split('\n').filter((l) => l.trim().length > 30);
    totalBullets = rawBulletMatches ? rawBulletMatches.length : 3;
  }

  if (totalBullets < 2) {
    densityScore = 6;
    feedback.push({ type: 'warning', text: 'Add more bullet points under your work experience (2-4 per role recommended).' });
  } else if (totalBullets > 18) {
    densityScore = 10;
    feedback.push({ type: 'tip', text: 'Keep resume concise — aim for 3-5 high-impact bullets per position to stay within 1 page.' });
  }

  breakdown.lengthAndDensity = densityScore;
  score += densityScore;

  return {
    score: Math.min(100, Math.max(0, score)),
    breakdown,
    feedback
  };
};

/**
 * Runs complete ATS strength evaluation combining rule formatting, AI content scoring,
 * and comprehensive checks.
 * @param {Object} resumeData 
 * @param {string} jobDescription 
 * @param {string} selectedTemplate 
 * @returns {Promise<Object>}
 */
export const evaluateResumeAtsStrength = async (
  resumeData,
  jobDescription = '',
  selectedTemplate = 'classic'
) => {
  // 1. Calculate Rule-Based Formatting Score
  const formatResult = calculateFormatScore(resumeData, selectedTemplate);

  // 2. Call AI Content Evaluation
  const aiResult = await checkAtsContent(resumeData, jobDescription);

  // 3. Detailed category compliance check & plain text extraction
  const detailedCompliance = checkDetailedAtsCompliance(resumeData, selectedTemplate);

  // 4. Calculate Content Score
  const contentScore = Math.round(
    (aiResult.actionVerbsScore * 0.35) +
    (aiResult.quantifiableMetricsScore * 0.35) +
    (aiResult.keywordMatchScore * 0.30)
  );

  // 5. Combine into Weighted Overall Percentage (40% Format + 60% Content)
  const overallScore = Math.round((formatResult.score * 0.40) + (contentScore * 0.60));

  // 6. Consolidate and Categorize Actionable Fixes
  const suggestions = [];

  // Add formatting feedback
  formatResult.feedback.forEach((f) => {
    suggestions.push({
      category: 'Formatting & Structure',
      type: f.type,
      text: f.text
    });
  });

  // Add AI bullet strength feedback
  if (aiResult.actionVerbsScore < 75) {
    suggestions.push({
      category: 'Bullet Point Strength',
      type: 'warning',
      text: 'Replace passive phrases (e.g. "helped with", "responsible for") with strong power verbs like "Spearheaded", "Architected", or "Optimized".'
    });
  }

  // Add metrics feedback
  if (aiResult.quantifiableMetricsScore < 80) {
    suggestions.push({
      category: 'Measurable Impact',
      type: 'warning',
      text: 'Include quantifiable metrics (e.g. percentages %, dollar amounts $, team sizes, or efficiency improvements) in your achievements.'
    });
  }

  // Add keyword gap feedback
  if (aiResult.missingKeywords && aiResult.missingKeywords.length > 0) {
    suggestions.push({
      category: 'Target Keywords',
      type: 'tip',
      text: `Consider incorporating relevant target keywords such as: ${aiResult.missingKeywords.slice(0, 5).join(', ')}.`
    });
  }

  return {
    overallScore,
    formattingScore: formatResult.score,
    contentScore,
    formatBreakdown: formatResult.breakdown,
    aiBreakdown: {
      actionVerbsScore: aiResult.actionVerbsScore,
      bulletStrength: aiResult.bulletStrength,
      quantifiableMetricsScore: aiResult.quantifiableMetricsScore,
      keywordMatchScore: aiResult.keywordMatchScore,
      targetKeywords: aiResult.targetKeywords || [],
      matchedKeywords: aiResult.matchedKeywords || [],
      missingKeywords: aiResult.missingKeywords || []
    },
    detailedCompliance,
    disclaimer: ATS_DISCLAIMER,
    suggestions,
    evaluatedAt: new Date().toISOString()
  };
};
