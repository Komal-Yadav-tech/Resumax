// AI Service for Resumax (Connected to Backend API in Phase 6)

const API_BASE_URL = typeof window !== 'undefined' ? '' : 'http://localhost:5000';

/**
 * 1. Generate Resume Content via Backend API
 * @param {Object} answers 
 * @returns {Promise<Object>}
 */
export const generateResumeContent = async (answers) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resume/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers)
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Backend API unavailable, executing local fallback engine:', error.message);
  }

  // Resilient Local Fallback Engine
  await new Promise((resolve) => setTimeout(resolve, 600));

  const {
    targetJobTitle = 'Specialist',
    experience = [],
    skills = []
  } = answers;

  const topSkills = skills.slice(0, 4).join(', ');
  const skillsPhrase = topSkills ? ` proficient in ${topSkills}` : '';
  const summary = `Results-driven and impact-focused ${targetJobTitle}${skillsPhrase} with a proven track record of building scalable systems, optimizing cross-functional workflows, and exceeding organizational benchmarks. Adept at agile execution, stakeholder collaboration, and technical leadership.`;

  const enhancedExperience = experience.map((exp) => {
    const rawBullets = exp.achievements
      ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
      : [];

    let enhancedBullets = [];
    if (rawBullets.length > 0) {
      enhancedBullets = rawBullets.map((bullet) => {
        const cleaned = bullet.replace(/^[•\-\*]\s*/, '').trim();
        if (/^(spearheaded|engineered|architected|increased|reduced|developed|implemented|led|orchestrated|delivered)/i.test(cleaned)) {
          return cleaned.endsWith('.') ? cleaned : `${cleaned}.`;
        }
        return `Spearheaded initiatives to ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}, improving operational throughput by 30% and accelerating project delivery milestones.`;
      });
    } else {
      enhancedBullets = [
        `Spearheaded core initiatives as ${exp.role || 'Contributor'} at ${exp.company || 'Company'}, optimizing cross-functional workflow efficiency by 25%.`,
        `Collaborated with leadership and key stakeholders to deliver scalable solutions within tight deadlines and regulatory standards.`,
        `Identified bottlenecks and implemented modern best practices, reducing error rates by 20% and driving measurable performance gains.`
      ];
    }

    return {
      ...exp,
      generatedBullets: enhancedBullets
    };
  });

  return {
    summary,
    experience: enhancedExperience,
    skills,
    generatedAt: new Date().toISOString()
  };
};

const COMMON_INDUSTRY_KEYWORDS = [
  'React', 'TypeScript', 'JavaScript', 'Next.js', 'Node.js', 'Python', 'Java', 'Go',
  'REST APIs', 'GraphQL', 'SQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
  'CI/CD', 'Git', 'Agile', 'Scrum', 'System Architecture', 'Performance Optimization',
  'Microservices', 'Unit Testing', 'Automated Testing', 'Cross-Functional Leadership',
  'UI/UX', 'Tailwind CSS', 'Redux', 'Cloud Computing', 'Data Analytics', 'DevOps'
];

/**
 * 2. Evaluate ATS Strength via Backend API
 * @param {Object} resumeData 
 * @param {string} jobDescription 
 * @returns {Promise<Object>}
 */
export const checkAtsContent = async (resumeData, jobDescription = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ats/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData, jobDescription })
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Backend API unavailable, executing local fallback engine:', error.message);
  }

  // Resilient Local Fallback Engine
  await new Promise((resolve) => setTimeout(resolve, 500));

  const answers = resumeData?.answers || resumeData || {};
  const experience = answers.experience || [];
  const skills = (answers.skills || []).map((s) => s.toLowerCase());
  const summary = (resumeData?.generatedContent?.summary || '').toLowerCase();

  let allBullets = [];
  experience.forEach((exp) => {
    if (exp.generatedBullets && exp.generatedBullets.length > 0) {
      allBullets.push(...exp.generatedBullets);
    } else if (exp.achievements) {
      allBullets.push(...exp.achievements.split('\n').filter(Boolean));
    }
  });

  if (allBullets.length === 0 && answers.rawText) {
    const rawLines = answers.rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 25);
    allBullets = rawLines.slice(0, 10);
  }

  const fullResumeText = [
    answers.rawText || '',
    answers.fullName || '',
    answers.targetJobTitle || '',
    summary,
    ...skills,
    ...allBullets
  ].join(' ').toLowerCase();

  const strongVerbsPattern = /\b(spearheaded|engineered|architected|developed|implemented|orchestrated|optimized|accelerated|transformed|delivered|designed|built|reduced|increased|generated|streamlined|championed|formulated|executed|established|led|mentored|automated|deployed|scaled|integrated|maximized|authored|collaborated)\b/i;
  const weakVerbsPattern = /\b(responsible for|helped with|assisted with|worked on|participated in|handled|did|was involved in)\b/i;

  let strongBulletCount = 0;
  let weakBulletCount = 0;
  allBullets.forEach((bullet) => {
    if (strongVerbsPattern.test(bullet)) strongBulletCount++;
    if (weakVerbsPattern.test(bullet)) weakBulletCount++;
  });

  let actionVerbsScore = 80;
  if (allBullets.length > 0) {
    const strongRatio = strongBulletCount / allBullets.length;
    const weakPenalty = (weakBulletCount / allBullets.length) * 30;
    actionVerbsScore = Math.min(100, Math.max(25, Math.round((strongRatio * 100) - weakPenalty + 25)));
  } else if (answers.rawText) {
    const strongInRaw = (answers.rawText.match(strongVerbsPattern) || []).length;
    actionVerbsScore = Math.min(95, Math.max(50, 60 + strongInRaw * 8));
  }

  const bulletStrength = actionVerbsScore >= 80 ? 'Strong' : actionVerbsScore >= 60 ? 'Moderate' : 'Needs Improvement';

  const metricPattern = /(\d+[\.,]?\d*[%kMB+]|\$\d+[\.,]?\d*|\b\d+\/\d+\b|\b\d+x\b|\b\d+\s*(users|customers|engineers|developers|members|people|clients|teams|ms|seconds|minutes|hours|days|weeks|months|years)|\b\d{1,}\b)/i;
  let metricBulletsCount = 0;
  allBullets.forEach((bullet) => {
    if (metricPattern.test(bullet)) metricBulletsCount++;
  });

  let quantifiableMetricsScore = 75;
  if (allBullets.length > 0) {
    const metricRatio = metricBulletsCount / allBullets.length;
    if (metricRatio >= 0.5) {
      quantifiableMetricsScore = Math.min(100, Math.round(75 + ((metricRatio - 0.5) * 50)));
    } else {
      quantifiableMetricsScore = Math.max(20, Math.round(metricRatio * 150));
    }
  } else if (answers.rawText) {
    const metricsInRaw = (answers.rawText.match(metricPattern) || []).length;
    quantifiableMetricsScore = Math.min(95, Math.max(45, 55 + metricsInRaw * 10));
  }

  let matchedKeywords = [];
  let missingKeywords = [];
  let targetKeywords = [];
  let keywordMatchScore = 85;

  if (jobDescription && jobDescription.trim().length > 20) {
    const jdKeywords = COMMON_INDUSTRY_KEYWORDS.filter((kw) =>
      new RegExp(`\\b${kw.replace('/', '\\/')}\\b`, 'i').test(jobDescription)
    );
    const dynamicKeywords = Array.from(
      new Set(
        (jobDescription.match(/\\b[A-Z][a-zA-Z0-9\\+#\\.]+\\b/g) || [])
          .filter((w) => w.length > 2 && !['The', 'You', 'We', 'Our', 'This', 'With', 'And', 'For', 'Are', 'Will'].includes(w))
      )
    ).slice(0, 10);

    targetKeywords = Array.from(new Set([...jdKeywords, ...dynamicKeywords]));
    targetKeywords.forEach((kw) => {
      if (fullResumeText.includes(kw.toLowerCase())) matchedKeywords.push(kw);
      else missingKeywords.push(kw);
    });

    const matchRatio = targetKeywords.length > 0 ? matchedKeywords.length / targetKeywords.length : 0.8;
    keywordMatchScore = Math.min(100, Math.max(20, Math.round(matchRatio * 100)));
  } else {
    targetKeywords = COMMON_INDUSTRY_KEYWORDS.slice(0, 10);
    matchedKeywords = COMMON_INDUSTRY_KEYWORDS.filter((kw) => fullResumeText.includes(kw.toLowerCase())).slice(0, 8);
    missingKeywords = COMMON_INDUSTRY_KEYWORDS.filter((kw) => !fullResumeText.includes(kw.toLowerCase())).slice(0, 5);
  }

  return {
    targetKeywords,
    missingKeywords,
    matchedKeywords,
    bulletStrength,
    quantifiableMetricsScore,
    actionVerbsScore,
    keywordMatchScore
  };
};

/**
 * 3. AI Career Chatbot via Backend API
 * @param {string} message 
 * @param {Object} resumeContext 
 * @param {Array} chatHistory 
 * @returns {Promise<string>}
 */
export const askResumeChatbot = async (message = '', resumeContext = {}, chatHistory = []) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chatbot/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, resumeContext, chatHistory })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.reply) return data.reply;
    }
  } catch (error) {
    console.warn('Backend API unavailable, executing local fallback engine:', error.message);
  }

  // Resilient Local Fallback Engine
  await new Promise((resolve) => setTimeout(resolve, 500));

  const answers = resumeContext?.answers || resumeContext || {};
  const targetRole = answers.targetJobTitle || 'your target role';
  const skills = (answers.skills || []).slice(0, 5).join(', ') || 'React, TypeScript, System Architecture';
  const experience = answers.experience || [];
  const latestExp = experience[0] || {};
  const query = message.toLowerCase().trim();

  if (query.includes('interview') || query.includes('question') || query.includes('practice') || query.includes('behavioral') || query.includes('technical')) {
    return `Based on your resume for **${targetRole}** with core skills in **${skills}**, here are the top 4 interview questions you should prepare for:

1. **Technical Architecture:** *"How do you design scalable applications with ${skills.split(',')[0] || 'your core stack'} while balancing performance and maintainability?"*
2. **Leadership & Collaboration (STAR Method):** *"Tell me about a time at ${latestExp.company || 'your previous company'} when you faced a difficult technical disagreement. How did you align the team and deliver?"*
3. **Problem Solving & Debugging:** *"Describe the most complex production bottleneck or bug you diagnosed. What metrics did you use to measure success?"*
4. **Impact & Metrics:** *"Walk me through a project where you drove measurable business outcomes (speed, revenue, user retention)."*

💡 **Strategy:** Structure your answers using the **STAR method** (Situation, Task, Action, Result) with specific percentages and outcomes!`;
  }

  if (query.includes('gap') || query.includes('break') || query.includes('transition') || query.includes('pivot') || query.includes('unemployed') || query.includes('layoff')) {
    return `Explaining a career gap is all about confidence and pivoting forward. Here is a proven 3-step script tailored for **${targetRole}**:

1. **Be concise and positive:** *"During that period, I took intentional time to focus on professional upskilling, personal development, and independent projects."*
2. **Highlight active learning & skills:** *"I dedicated over 150 hours to mastering modern practices in ${skills}, building end-to-end applications, and contributing to technical problem solving."*
3. **Pivot immediately to the future:** *"Now I am completely energized and focused on bringing my expertise in ${targetRole} to deliver high-impact results for your team."*

💡 **ATS Tip:** Focus on skill acquisition and continuous momentum in your timeline!`;
  }

  if (query.includes('skill') || query.includes('ats') || query.includes('keyword') || query.includes('score') || query.includes('tailor')) {
    return `To maximize your ATS match score for **${targetRole}**, here are top recommendations for your resume:

- **Core Technical Stack:** Ensure in-demand keywords like **${skills}**, *CI/CD, Cloud Architecture (AWS/GCP), Automated Testing*, and *RESTful APIs* are prominently placed.
- **Section Headers:** Stick to standard titles like *Professional Summary, Work Experience, Education, Skills*.
- **Keyword Density:** Mention your primary skills 2–3 times across your Summary and Work Experience bullets so ATS parsers recognize strong topical authority.
- **Action Verbs:** Start every single bullet with strong verbs like *Architected, Engineered, Orchestrated, Optimized, Delivered*.`;
  }

  if (query.includes('bullet') || query.includes('improve') || query.includes('rewrite') || query.includes('phrase') || query.includes('achievement')) {
    return `Here are 3 high-impact, ATS-optimized ways to phrase your experience as a **${targetRole}** using power action verbs and quantifiable metrics:

1. **Spearheaded core feature delivery:** *"Architected and deployed responsive modules utilizing ${skills.split(',')[0] || 'modern tech stack'}, reducing page load latency by 35% and improving user engagement across 50K+ monthly active users."*
2. **Workflow & Performance Optimization:** *"Engineered automated testing and CI/CD pipelines, increasing sprint velocity by 25% and reducing production defect rates by 40%."*
3. **Cross-Functional Leadership:** *"Collaborated with product, UI/UX, and engineering stakeholders at ${latestExp.company || 'your organization'} to deliver mission-critical milestones 2 weeks ahead of schedule."*

💡 **Pro-tip:** When writing resume bullets, use the **Google XYZ Formula**: *Accomplished [X], as measured by [Y], by doing [Z].*`;
  }

  return `As your AI Career Advisor for **${targetRole}**, I'm here to help you stand out! 

Your profile shows great strengths in **${skills}**${latestExp.role ? ` and experience as a ${latestExp.role} at ${latestExp.company || 'your company'}` : ''}.

Here are things we can work on right now:
- ✍️ **Refine your experience bullets** with power action verbs and metrics
- 💬 **Formulate strategic answers** for employment gaps or career transitions
- 🎙️ **Practice top interview questions** tailored to ${targetRole}
- 🎯 **ATS keyword optimization** for specific job descriptions

What would you like to explore first?`;
};
