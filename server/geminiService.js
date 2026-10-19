import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
let model = null;

if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } catch (err) {
    console.warn('Failed to initialize Gemini AI SDK, falling back to built-in generator:', err.message);
  }
}

/**
 * 1. Generate Professional Resume Content
 */
export const generateResumeWithAI = async (answers) => {
  const {
    fullName = 'Professional',
    targetJobTitle = 'Software Specialist',
    experience = [],
    education = [],
    skills = []
  } = answers;

  if (model) {
    try {
      const prompt = `You are an elite executive resume writer and ATS specialist.
Given the following user details, generate:
1. A compelling 2-sentence Professional Summary tailored for a "${targetJobTitle}".
2. Enhanced, action-oriented bullet points for each work experience position. Every bullet point MUST use the Google XYZ formula (Accomplished [X], as measured by [Y], by doing [Z]) with strong power verbs (e.g. Spearheaded, Architected, Engineered, Optimized) and quantifiable impact metrics (percentages, numbers, dollar values).

Candidate Profile:
- Name: ${fullName}
- Target Role: ${targetJobTitle}
- Skills: ${skills.join(', ')}
- Work Experience: ${JSON.stringify(experience)}
- Education: ${JSON.stringify(education)}

Return your output in strict JSON format:
{
  "summary": "...",
  "experience": [
    {
      "id": 1,
      "role": "...",
      "company": "...",
      "duration": "...",
      "location": "...",
      "generatedBullets": [
        "...",
        "...",
        "..."
      ]
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary,
          experience: parsed.experience,
          skills,
          generatedAt: new Date().toISOString(),
          provider: 'Gemini AI'
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent fallback:', err.message);
    }
  }

  // Intelligent fallback engine
  const topSkills = skills.slice(0, 4).join(', ');
  const skillsPhrase = topSkills ? ` proficient in ${topSkills}` : '';
  const summary = `Results-driven and impact-focused ${targetJobTitle}${skillsPhrase} with a demonstrated history of delivering scalable solutions, optimizing cross-functional workflows, and exceeding organizational benchmarks. Adept at agile execution, stakeholder collaboration, and technical leadership.`;

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
    generatedAt: new Date().toISOString(),
    provider: 'Built-in Engine'
  };
};

/**
 * 2. ATS Strength & Keyword Gap Analysis
 */
export const analyzeAtsWithAI = async (resumeData, jobDescription = '') => {
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

  const fullResumeText = [
    answers.rawText || '',
    answers.fullName || '',
    answers.targetJobTitle || '',
    summary,
    ...skills,
    ...allBullets
  ].join(' ').toLowerCase();

  if (model && jobDescription && jobDescription.trim().length > 20) {
    try {
      const prompt = `You are an ATS (Applicant Tracking System) parser and recruiter evaluation engine.
Analyze this resume against the provided Job Description.

Resume Text:
${fullResumeText}

Job Description:
${jobDescription}

Evaluate and return in strict JSON format:
{
  "targetKeywords": ["keyword1", "keyword2", "keyword3"],
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword3", "keyword4"],
  "bulletStrength": "Strong" | "Moderate" | "Needs Improvement",
  "actionVerbsScore": 85,
  "quantifiableMetricsScore": 80,
  "keywordMatchScore": 75
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('Gemini ATS check failed, using fallback engine:', err.message);
    }
  }

  // Fallback keyword extraction and scoring
  const COMMON_KEYWORDS = [
    'React', 'TypeScript', 'JavaScript', 'Next.js', 'Node.js', 'Python', 'Java', 'Go',
    'REST APIs', 'GraphQL', 'SQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
    'CI/CD', 'Git', 'Agile', 'Scrum', 'System Architecture', 'Performance Optimization',
    'Microservices', 'Unit Testing', 'Automated Testing', 'Cross-Functional Leadership'
  ];

  let matchedKeywords = [];
  let missingKeywords = [];
  let targetKeywords = [];
  let keywordMatchScore = 85;

  if (jobDescription && jobDescription.trim().length > 20) {
    const jdKeywords = COMMON_KEYWORDS.filter((kw) =>
      new RegExp(`\\b${kw.replace('/', '\\/')}\\b`, 'i').test(jobDescription)
    );
    const dynamicKeywords = Array.from(
      new Set(
        (jobDescription.match(/\b[A-Z][a-zA-Z0-9\+#\.]+\b/g) || [])
          .filter((w) => w.length > 2 && !['The', 'You', 'We', 'Our', 'This', 'With', 'And', 'For', 'Are', 'Will'].includes(w))
      )
    ).slice(0, 8);

    targetKeywords = Array.from(new Set([...jdKeywords, ...dynamicKeywords]));
    targetKeywords.forEach((kw) => {
      if (fullResumeText.includes(kw.toLowerCase())) matchedKeywords.push(kw);
      else missingKeywords.push(kw);
    });

    const ratio = targetKeywords.length > 0 ? matchedKeywords.length / targetKeywords.length : 0.8;
    keywordMatchScore = Math.min(100, Math.max(25, Math.round(ratio * 100)));
  } else {
    targetKeywords = COMMON_KEYWORDS.slice(0, 10);
    matchedKeywords = COMMON_KEYWORDS.filter((kw) => fullResumeText.includes(kw.toLowerCase())).slice(0, 8);
    missingKeywords = COMMON_KEYWORDS.filter((kw) => !fullResumeText.includes(kw.toLowerCase())).slice(0, 5);
  }

  // Dynamic bullet strength & action verb calculation
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
    actionVerbsScore = Math.min(100, Math.max(20, Math.round((strongRatio * 100) - weakPenalty + 20)));
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
  }

  return {
    targetKeywords,
    matchedKeywords,
    missingKeywords,
    bulletStrength,
    actionVerbsScore,
    quantifiableMetricsScore,
    keywordMatchScore
  };
};

/**
 * 3. AI Career Advisor Chat Reply
 */
export const chatWithCareerAI = async (message, resumeContext = {}, chatHistory = []) => {
  const answers = resumeContext?.answers || resumeContext || {};
  const targetRole = answers.targetJobTitle || 'your target role';
  const skills = (answers.skills || []).slice(0, 5).join(', ') || 'React, TypeScript, System Architecture';
  const experience = answers.experience || [];
  const latestExp = experience[0] || {};

  if (model) {
    try {
      const historyContext = (chatHistory || [])
        .slice(-6)
        .map((m) => `${m.role === 'user' ? 'User' : 'Advisor'}: ${m.content}`)
        .join('\n');

      const prompt = `You are Resumax's AI Career Advisor — an encouraging, top-tier executive career coach and resume strategist.
Candidate Profile:
- Target Role: ${targetRole}
- Skills: ${skills}
- Latest Position: ${latestExp.role || 'Contributor'} at ${latestExp.company || 'Tech Company'}

Conversation History:
${historyContext}

User Message: "${message}"

Provide a direct, empowering, and highly actionable response formatted cleanly with bold highlights and bullet points where helpful.`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.warn('Gemini chat failed, using fallback engine:', err.message);
    }
  }

  // Fallback intelligent coaching logic
  const query = (message || '').toLowerCase();

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
    return `Here are 3 high-impact ways to phrase your experience as a **${targetRole}** using power verbs and metrics:

1. **Spearheaded core feature delivery:** *"Architected and deployed responsive modules utilizing ${skills.split(',')[0] || 'modern tech stack'}, reducing page load latency by 35% and improving user engagement across 50K+ monthly active users."*
2. **Workflow & Performance Optimization:** *"Engineered automated testing and CI/CD pipelines, increasing sprint velocity by 25% and reducing production defect rates by 40%."*
3. **Cross-Functional Leadership:** *"Collaborated with product, UI/UX, and engineering stakeholders at ${latestExp.company || 'your organization'} to deliver mission-critical milestones 2 weeks ahead of schedule."*

💡 **Pro-tip:** Use the **Google XYZ Formula**: *Accomplished [X], as measured by [Y], by doing [Z].*`;
  }

  return `As your AI Career Advisor for **${targetRole}**, I'm here to help you stand out! 

Your background in **${skills}** provides a strong foundation. We can polish your experience bullets, prepare for interviews with STAR behavioral responses, or optimize keywords for your target role. What would you like to focus on?`;
};
