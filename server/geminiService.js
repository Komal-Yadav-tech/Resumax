import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { CHATBOT_SYSTEM_INSTRUCTION, processCareerChatMessage } from '../src/services/careerChatEngine.js';
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
  const targetRole = answers.targetJobTitle || 'Senior Frontend Engineer';
  const skills = (answers.skills || []).slice(0, 5).join(', ') || 'React, TypeScript, System Architecture';
  const experience = answers.experience || [];
  const latestExp = experience[0] || {};

  if (model) {
    try {
      const historyContext = (chatHistory || [])
        .slice(-8)
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n\n');

      const fullPrompt = `${CHATBOT_SYSTEM_INSTRUCTION}

Candidate Profile Context:
- Target Role: ${targetRole}
- Skills: ${skills}
- Latest Position: ${latestExp.role || 'Contributor'} at ${latestExp.company || 'Tech Company'}
- Experience History: ${JSON.stringify(experience)}

Recent Conversation History:
${historyContext || '(No previous conversation)'}

User's Latest Message: "${message}"

Generate the direct, relevant, and properly formatted response according to the rules above.`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000
        }
      });
      const responseText = result.response.text();
      if (responseText && responseText.trim().length > 0) {
        return responseText.trim();
      }
    } catch (err) {
      console.warn('Gemini chat failed, using fallback engine:', err.message);
    }
  }

  // Resilient, intent-aware local engine
  return processCareerChatMessage(message, resumeContext, chatHistory);
};
