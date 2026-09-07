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
  const contact = answers.contact || {};
  const experience = answers.experience || [];
  const education = answers.education || [];
  const skills = answers.skills || [];

  // 1. Contact Information Completeness (Max 30 pts)
  let contactScore = 0;
  if (answers.fullName && answers.fullName.trim().length >= 2) contactScore += 8;
  else feedback.push({ type: 'warning', text: 'Add your full name in the header.' });

  if (contact.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) contactScore += 8;
  else feedback.push({ type: 'critical', text: 'Provide a valid professional email address.' });

  if (contact.phone && contact.phone.trim().length >= 7) contactScore += 7;
  else feedback.push({ type: 'warning', text: 'Include a contact phone number.' });

  if (contact.location && contact.location.trim().length >= 2) contactScore += 7;
  else feedback.push({ type: 'info', text: 'Add your city and state/country.' });

  breakdown.contactCompleteness = contactScore;
  score += contactScore;

  // 2. Standard Section Headers (Max 35 pts)
  let headerScore = 0;
  const hasSummary = Boolean(resumeData.generatedContent?.summary || answers.targetJobTitle);
  if (hasSummary) headerScore += 8;
  else feedback.push({ type: 'warning', text: 'Include a Professional Summary section.' });

  if (experience.length > 0) {
    headerScore += 12;
  } else {
    feedback.push({ type: 'critical', text: 'Add at least one Work Experience entry with role and company.' });
  }

  if (education.length > 0) {
    headerScore += 8;
  } else {
    feedback.push({ type: 'warning', text: 'Include an Education section with your school/degree.' });
  }

  if (skills.length >= 3) {
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
      text: 'For the highest ATS parse rate, choose an ATS-Safe template (Classic, ATS Pro, ATS Simple, ATS Compact, Academic).'
    });
  }

  // 4. Content Density & Length (Max 15 pts)
  let densityScore = 15;
  const totalBullets = experience.reduce((acc, exp) => {
    const bCount = exp.generatedBullets?.length || (exp.achievements ? exp.achievements.split('\n').filter(Boolean).length : 0);
    return acc + bCount;
  }, 0);

  if (totalBullets < 2) {
    densityScore = 5;
    feedback.push({ type: 'warning', text: 'Add more bullet points under your work experience (2-4 per role recommended).' });
  } else if (totalBullets > 15) {
    densityScore = 10;
    feedback.push({ type: 'tip', text: 'Keep resume concise — aim for 3-5 high-impact bullets per position.' });
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
 * Runs complete ATS strength evaluation combining rule formatting & AI content scoring
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

  // 2. Call AI Content Evaluation (with fallback/placeholder logic)
  const aiResult = await checkAtsContent(resumeData, jobDescription);

  // 3. Calculate Content Score
  const contentScore = Math.round(
    (aiResult.actionVerbsScore * 0.35) +
    (aiResult.quantifiableMetricsScore * 0.35) +
    (aiResult.keywordMatchScore * 0.30)
  );

  // 4. Combine into Weighted Overall Percentage (40% Format + 60% Content)
  const overallScore = Math.round((formatResult.score * 0.40) + (contentScore * 0.60));

  // 5. Consolidate and Categorize Actionable Fixes
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
      matchedKeywords: aiResult.matchedKeywords || [],
      missingKeywords: aiResult.missingKeywords || []
    },
    suggestions,
    evaluatedAt: new Date().toISOString()
  };
};
