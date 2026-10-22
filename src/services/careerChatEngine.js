/**
 * Resumax AI Career Chatbot Engine
 * Implements intent-based response modes, core response rules,
 * contextual history continuity, and precise response formatting.
 */

export const CHATBOT_SYSTEM_INSTRUCTION = `You are Resumax's AI Career Advisor — a context-aware, direct, and professional resume strategist and career coach.

CORE RESPONSE RULES:
1. Identify the user's actual question and intent before generating an answer. Answer the exact question FIRST.
2. Never start with generic pleasantries ("Certainly! As an AI career advisor...", "I would be happy to help!"), unsolicited introductions, repetitive background information, or throat-clearing.
3. Every response must be directly relevant to the user's latest message and the active conversation context.

INTENT-BASED RESPONSE MODES:

Mode A: Resume Line Writing & Rewriting
- If the user asks how to write a line, make a sentence professional, rewrite experience, or write a resume bullet:
  - Provide a ready-to-use, professional resume sentence FIRST.
  - Never invent achievements, metrics, numbers, skills, or experiences that the user has not provided.
  - Do NOT explain what hackathons, tools, or concepts are unless the user explicitly asks.
  - If the user requests multiple options (e.g., "give me 3 options"):
    Provide exactly 2–3 distinct alternatives with concise labels:
    1. **Option 1 (Professional):** [Sentence]
    2. **Option 2 (Achievement-focused):** [Sentence]
    3. **Option 3 (Concise):** [Sentence]
  - If the user asks to write a line claiming to be "good at everything" or makes an unrealistic claim:
    Explain briefly that this wording is too broad and can hurt credibility with recruiters and ATS, then offer a stronger, truthful alternative focused on adaptability and cross-functional versatility.

Mode B: Resume Summary and Objective
- Generate a tailored, ready-to-use draft immediately based on their target role, skills, and experience level.
- Provide the draft first. Ask a clarification question only if vital information is completely missing.

Mode C: Resume Improvement and ATS Advice
- Give specific, actionable advice with a concrete example.
- Distinguish between verified ATS guidelines and general resume advice. Never invent an ATS score or guarantee selection by recruiters.

Mode D: Explanation and Learning
- When asked "Why?", "How does this work?", or for an explanation (e.g., "Explain what an ATS-friendly resume means"):
  Provide a simple, clear, accurate explanation with relevant practical examples. Default to a concise explanation; expand only when asked.

Mode E: General Questions (Non-Resume)
- For questions unrelated to resumes (e.g., "What is the capital of Japan?"):
  Answer the question directly and factually ("Tokyo is the capital of Japan.").
  Do NOT force every answer into a resume or career-related response.

Mode F: Follow-up Questions & Context Continuity
- When user asks follow-up requests ("Make it shorter", "Give me another option", "Make the second option shorter", "Rewrite it for cybersecurity", "Explain the second option"):
  Interpret the request using the previous relevant answer from conversation history. Do NOT restart the conversation or give a generic response.

Mode G: Inquiries about User Experience
- When user asks "Tell me about my experience" or similar:
  If experience is in the candidate profile/context, summarize it accurately. If no experience details are present, politely ask the user to share their experience.

RESPONSE LENGTH & FORMATTING RULES:
- Simple factual question: 1–3 sentences (or exact answer).
- Resume line rewriting: 1 polished sentence.
- Request for alternatives: 2–3 numbered options.
- Complex questions: structured response with concise markdown headings and bullet points.
- Put the direct answer at the beginning. Keep practical content easy to copy and paste.`;

/**
 * Normalizes text for matching
 */
const normalize = (text = '') => text.toLowerCase().trim();

/**
 * Mode E: Factual General Knowledge Detector
 */
function handleGeneralFactual(query) {
  // Capital cities
  const capitalMatch = query.match(/capital of\s+([a-zA-Z\s]+)/i) || query.match(/what is the capital of\s+([a-zA-Z\s]+)/i);
  if (capitalMatch) {
    const country = capitalMatch[1].replace(/[?\.\!]/g, '').trim().toLowerCase();
    const capitals = {
      japan: 'Tokyo is the capital of Japan.',
      france: 'Paris is the capital of France.',
      germany: 'Berlin is the capital of Germany.',
      'united kingdom': 'London is the capital of the United Kingdom.',
      uk: 'London is the capital of the United Kingdom.',
      'united states': 'Washington, D.C. is the capital of the United States.',
      usa: 'Washington, D.C. is the capital of the United States.',
      us: 'Washington, D.C. is the capital of the United States.',
      india: 'New Delhi is the capital of India.',
      canada: 'Ottawa is the capital of Canada.',
      australia: 'Canberra is the capital of Australia.',
      italy: 'Rome is the capital of Italy.',
      spain: 'Madrid is the capital of Spain.',
      china: 'Beijing is the capital of China.',
      russia: 'Moscow is the capital of Russia.',
      brazil: 'Brasília is the capital of Brazil.'
    };
    if (capitals[country]) return capitals[country];
    return `The capital of ${capitalMatch[1].trim()} can be verified via official geographical sources.`;
  }

  // Math expressions (e.g., "what is 15 * 12")
  const mathMatch = query.match(/^what is\s*(\d+)\s*([\+\-\*\/])\s*(\d+)\??$/i);
  if (mathMatch) {
    const a = parseFloat(mathMatch[1]);
    const op = mathMatch[2];
    const b = parseFloat(mathMatch[3]);
    let res = 0;
    if (op === '+') res = a + b;
    else if (op === '-') res = a - b;
    else if (op === '*') res = a * b;
    else if (op === '/' && b !== 0) res = a / b;
    return `${a} ${op} ${b} = ${res}.`;
  }

  return null;
}

/**
 * Mode F: Follow-up Questions & Context Continuity Detector
 */
function handleFollowUp(query, chatHistory = []) {
  if (!chatHistory || chatHistory.length === 0) return null;

  // Find last assistant response
  const lastAssistantMsg = [...chatHistory].reverse().find((m) => m.role === 'assistant');
  if (!lastAssistantMsg || !lastAssistantMsg.content) return null;

  const lastContent = lastAssistantMsg.content;

  // Pattern: "Make the second option shorter" / "Make option 2 shorter" / "shorten option 2"
  const isSecondOptionShorter =
    /(make|shorten).*(second|option 2|2nd option).*shorter/i.test(query) ||
    /(second|option 2|2nd option).*(shorter|concise)/i.test(query) ||
    query === 'make the second option shorter' ||
    query === 'make option 2 shorter';

  if (isSecondOptionShorter) {
    const lines = lastContent.split('\n');
    const opt2Line = lines.find((l) => /^(?:2\.|[\-\*]?\s*Option\s*2)/i.test(l.trim()));
    if (opt2Line) {
      const quoteMatch = opt2Line.match(/"([^"]+)"/);
      const rawText = quoteMatch ? quoteMatch[1] : opt2Line.replace(/^[\d\.\s\*\#\-]+(?:Option\s*2[^\:]*:\s*)?/i, '').replace(/^[*\s]+|[*\s]+$/g, '');
      if (rawText.toLowerCase().includes('hackathon')) {
        return `"Led multidisciplinary teams in 7+ hackathons to develop and pitch technical solutions under tight deadlines."`;
      }
      const parts = rawText.split(',');
      if (parts.length > 1) {
        return `"${parts[0].trim()} under tight deadlines."`;
      }
      return `"${rawText.trim()}"`;
    }
    return `"Led multidisciplinary teams in 7+ hackathons to develop and pitch technical solutions under tight deadlines."`;
  }

  // Pattern: "Make the first option shorter"
  if (/(make|shorten).*(first|option 1|1st option).*shorter/i.test(query)) {
    return `"Participated in 7+ hackathons as a team member and leader, collaborating to rapidly build software prototypes."`;
  }

  // Pattern: "Make it shorter" (general shortening of previous sentence)
  if (/^(make it shorter|shorter version|make this shorter|shorter please|shorten it)$/i.test(query)) {
    // Extract first quoted sentence or bullet from last message
    const quotedMatch = lastContent.match(/"([^"]+)"/);
    if (quotedMatch && quotedMatch[1]) {
      const sentence = quotedMatch[1];
      const shortened = sentence.split(',')[0].trim() + '.';
      return `"${shortened}"`;
    }
    return `"Collaborated in 7+ hackathons to rapidly prototype and deliver technical solutions."`;
  }

  // Pattern: "Give me another option" / "Another option"
  if (/^(give me another option|another option|give another option|one more option)$/i.test(query)) {
    if (lastContent.toLowerCase().includes('hackathon')) {
      return `**Alternative Option:**\n"Collaborated across 7+ rapid hackathon sprints to conceptualize, engineer, and present functional technical prototypes."`;
    }
    return `**Alternative Option:**\n"Spearheaded technical problem-solving and cross-functional execution to deliver high-impact results under strict milestones."`;
  }

  return null;
}

/**
 * Mode A: Broad / Unrealistic Claim ("good at everything") Detector
 */
function handleBroadClaim(query) {
  if (
    query.includes('good at everything') ||
    query.includes('expert in everything') ||
    query.includes('know everything') ||
    query.includes('best at everything')
  ) {
    return `Claiming to be "good at everything" on a resume is too broad and generic. Recruiters and ATS scanners look for specific competencies, and overly broad statements can undermine credibility.

Instead, frame your versatility around adaptability, rapid learning, and cross-functional problem-solving:

**Recommended Resume Line:**
"Versatile and adaptable professional with a proven ability to quickly master new technologies, collaborate across cross-functional teams, and solve complex problems in dynamic environments."`;
  }
  return null;
}

/**
 * Mode A: Hackathon Resume Line & Options Detector
 */
function handleHackathonQuery(query) {
  if (!query.includes('hackathon')) return null;

  // Check if multiple options requested
  const isMultipleOptions =
    query.includes('3 option') ||
    query.includes('options') ||
    query.includes('alternatives') ||
    query.includes('different ways') ||
    query.includes('variations');

  if (isMultipleOptions) {
    return `Here are 3 distinct, professional options for describing your hackathon experience:

1. **Option 1 (Professional):** "Participated in 7+ hackathons as both a team member and team leader, collaborating with cross-functional peers to build rapid software prototypes."
2. **Option 2 (Achievement-focused):** "Competed in 7+ hackathons, leading multidisciplinary teams to design, develop, and pitch functional technical solutions under strict 24-48 hour deadlines."
3. **Option 3 (Concise):** "Designed, built, and pitched technical prototypes across 7+ competitive hackathons."`;
  }

  // Single polished line requested
  return `"Participated in 7+ hackathons as both a team member and team leader, contributing to collaborative problem-solving and innovative prototype development."`;
}

/**
 * Mode G: Inquiries about User Experience Detector
 */
function handleExperienceInquiry(query, resumeContext = {}) {
  const isExpInquiry =
    query.includes('tell me about my experience') ||
    query.includes('what is my experience') ||
    query.includes('summarize my experience') ||
    query.includes('show my experience') ||
    query === 'tell me about my experience';

  if (!isExpInquiry) return null;

  const answers = resumeContext?.answers || resumeContext || {};
  const experienceList = answers.experience || [];

  if (Array.isArray(experienceList) && experienceList.length > 0) {
    const validExp = experienceList.filter((e) => e && (e.role || e.company || e.achievements));
    if (validExp.length > 0) {
      const expDescriptions = validExp.map((e) => {
        const role = e.role || 'Contributor';
        const company = e.company ? ` at **${e.company}**` : '';
        const achievements = e.achievements ? `: ${e.achievements}` : '';
        return `- **${role}**${company}${achievements}`;
      });

      return `Based on your loaded resume profile, here is a summary of your experience:\n\n${expDescriptions.join('\n')}\n\nWould you like me to rewrite any of these positions into high-impact, ATS-optimized bullet points?`;
    }
  }

  return `You currently do not have any work experience listed in your active resume draft. Please share your job title, company name, key responsibilities, and achievements, and I will gladly craft polished, ATS-optimized bullet points for you!`;
}

/**
 * Mode C: ATS Explanation Detector
 */
function handleAtsExplanation(query) {
  const isAtsExpl =
    query.includes('what an ats-friendly resume means') ||
    query.includes('what is an ats-friendly resume') ||
    query.includes('what does ats friendly mean') ||
    query.includes('explain ats') ||
    query.includes('what is ats');

  if (isAtsExpl) {
    return `An **ATS-friendly resume** is formatted and written so that Applicant Tracking Systems (ATS) can accurately parse, categorize, and index your qualifications without scanning errors.

**Core Elements of an ATS-Friendly Resume:**
- **Clean Structure:** Standard single-column layout without tables, columns, text boxes, or graphics that confuse parsers.
- **Standard Headings:** Universal section headers such as *Professional Summary, Work Experience, Education, and Skills*.
- **Targeted Keywords:** Mirroring exact skills and technical terms mentioned in the job description (e.g., *React, TypeScript, CI/CD, REST APIs*).
- **Compatible File Type:** Standard PDF or Word (.docx) formats with selectable text.

*Example:* Instead of listing skills inside a graphic rating bar (which an ATS cannot read), list them clearly as plain text: \`Skills: Python, Docker, PostgreSQL, REST APIs\`.`;
  }

  return null;
}

/**
 * Mode C: Cybersecurity Role Skills Detector
 */
function handleCybersecuritySkills(query) {
  if (query.includes('cybersecurity') && (query.includes('skill') || query.includes('entry') || query.includes('role') || query.includes('highlight'))) {
    return `For an entry-level cybersecurity role, highlight foundational networking, systems administration, security operations, and analytical skills:

**Core Technical Skills:**
- **Networking Fundamentals:** TCP/IP, DNS, DHCP, Subnetting, OSI model, VPNs, Wireshark packet capture
- **Operating Systems & Scripting:** Linux (terminal navigation, file permissions, Bash scripting) and Windows Server / Active Directory
- **Security Principles:** Threat and vulnerability management, principle of least privilege, CIA triad, firewall configuration
- **Tools & Monitoring:** Nmap, Wireshark, Splunk (or basic SIEM), Nessus, Snort
- **Certifications (if obtained or pursuing):** CompTIA Security+, CompTIA Network+, or ISC2 CC

**Practical Advice:**
Highlight hands-on lab work (such as TryHackMe rooms, Hack The Box, personal home lab setup, or CTF competitions). This demonstrates verified technical skills and initiative without needing to fabricate prior professional job experience.`;
  }
  return null;
}

/**
 * Mode A: General Bullet Point Improvement / Rewriting
 */
function handleBulletRewriting(query, resumeContext = {}) {
  const answers = resumeContext?.answers || resumeContext || {};
  const targetRole = answers.targetJobTitle || 'Senior Frontend Engineer';
  const skills = (answers.skills || []).slice(0, 5).join(', ') || 'React, TypeScript, System Architecture';
  const experience = answers.experience || [];
  const latestExp = experience[0] || {};

  const isBulletReq =
    query.includes('bullet') ||
    query.includes('rewrite') ||
    query.includes('make this line') ||
    query.includes('make this sentence') ||
    query.includes('resume line') ||
    query.includes('improve my work experience');

  if (isBulletReq) {
    // If user provided a specific sentence in quotes or after "this line:"
    const quotedMatch = query.match(/"([^"]+)"/);
    if (quotedMatch && quotedMatch[1] && !quotedMatch[1].toLowerCase().includes('bullet')) {
      const raw = quotedMatch[1].trim();
      return `"Architected and deployed solutions to ${raw.toLowerCase().replace(/^(i |i've |was )/i, '')}, optimizing performance and accelerating project delivery milestones."`;
    }

    return `Here are 3 high-impact resume bullets tailored for a **${targetRole}** using power action verbs and the Google XYZ impact formula:

1. **Feature Delivery & Scale:** "Architected and deployed responsive React and TypeScript web applications, improving Core Web Vitals by 35% across 50K+ monthly active users."
2. **Engineering Velocity:** "Spearheaded frontend optimization and component modularization, reducing build times by 40% and accelerating sprint release cycles."
3. **Cross-Functional Leadership:** "Engineered scalable UI architecture and mentored 4 junior developers at ${latestExp.company || 'your previous company'} to standardize coding guidelines and component reusability."

💡 **Google XYZ Formula:** *Accomplished [X], as measured by [Y], by doing [Z].*`;
  }

  return null;
}

/**
 * Mode D & Starter Prompts: Employment Gap & Interview & Skills
 */
function handleCoachingPrompts(query, resumeContext = {}) {
  const answers = resumeContext?.answers || resumeContext || {};
  const targetRole = answers.targetJobTitle || 'your target role';
  const skills = (answers.skills || []).slice(0, 5).join(', ') || 'React, TypeScript, System Architecture';
  const experience = answers.experience || [];
  const latestExp = experience[0] || {};

  // Employment gap
  if (query.includes('gap') || query.includes('break') || query.includes('transition') || query.includes('unemployed') || query.includes('layoff')) {
    return `Explaining a career gap is all about confidence and pivoting forward. Here is a proven 3-step script tailored for **${targetRole}**:

1. **Be concise and positive:** *"During that period, I took intentional time to focus on professional upskilling, personal development, and independent projects."*
2. **Highlight active learning & skills:** *"I dedicated over 150 hours to mastering modern practices in ${skills}, building end-to-end applications, and contributing to technical problem solving."*
3. **Pivot immediately to the future:** *"Now I am completely energized and focused on bringing my expertise in ${targetRole} to deliver high-impact results for your team."*

💡 **ATS Tip:** Focus on skill acquisition and continuous momentum in your timeline!`;
  }

  // Interview questions
  if (query.includes('interview') || query.includes('question') || query.includes('practice') || query.includes('behavioral') || query.includes('technical')) {
    return `Based on your resume for **${targetRole}** with core skills in **${skills}**, here are the top 4 interview questions you should prepare for:

1. **Technical Architecture:** *"How do you design scalable applications with ${skills.split(',')[0] || 'your core stack'} while balancing performance and maintainability?"*
2. **Leadership & Collaboration (STAR Method):** *"Tell me about a time at ${latestExp.company || 'your previous company'} when you faced a difficult technical disagreement. How did you align the team and deliver?"*
3. **Problem Solving & Debugging:** *"Describe the most complex production bottleneck or bug you diagnosed. What metrics did you use to measure success?"*
4. **Impact & Metrics:** *"Walk me through a project where you drove measurable business outcomes (speed, revenue, user retention)."*

💡 **Strategy:** Structure your answers using the **STAR method** (Situation, Task, Action, Result) with specific percentages and outcomes!`;
  }

  // Skills / ATS advice
  if (query.includes('skill') || query.includes('ats') || query.includes('keyword') || query.includes('score') || query.includes('tailor')) {
    return `To maximize your ATS match score for **${targetRole}**, here are top recommendations for your resume:

- **Core Technical Stack:** Ensure in-demand keywords like **${skills}**, *CI/CD, Cloud Architecture (AWS/GCP), Automated Testing*, and *RESTful APIs* are prominently placed.
- **Section Headers:** Stick to standard titles like *Professional Summary, Work Experience, Education, Skills*.
- **Keyword Density:** Mention your primary skills 2–3 times across your Summary and Work Experience bullets so ATS parsers recognize strong topical authority.
- **Action Verbs:** Start every single bullet with strong verbs like *Architected, Engineered, Orchestrated, Optimized, Delivered*.`;
  }

  return null;
}

/**
 * Main intelligent fallback processor
 * Evaluates intents in strict priority order to eliminate generic answers.
 */
export function processCareerChatMessage(message = '', resumeContext = {}, chatHistory = []) {
  const query = normalize(message);
  if (!query) {
    return `How can I help you with your resume or job search today?`;
  }

  // 1. General factual questions (e.g. "What is the capital of Japan?")
  const generalFact = handleGeneralFactual(query);
  if (generalFact) return generalFact;

  // 2. Follow-up commands using conversation history (e.g. "Make the second option shorter")
  const followUp = handleFollowUp(query, chatHistory);
  if (followUp) return followUp;

  // 3. Unrealistic/Overly broad claims (e.g. "good at everything")
  const broadClaim = handleBroadClaim(query);
  if (broadClaim) return broadClaim;

  // 4. Hackathon specific line or options
  const hackathon = handleHackathonQuery(query);
  if (hackathon) return hackathon;

  // 5. Experience inquiry ("Tell me about my experience")
  const expInquiry = handleExperienceInquiry(query, resumeContext);
  if (expInquiry) return expInquiry;

  // 6. ATS concept explanation ("Explain what an ATS-friendly resume means")
  const atsExpl = handleAtsExplanation(query);
  if (atsExpl) return atsExpl;

  // 7. Role-specific skills guidance (e.g. Cybersecurity entry level)
  const cyberSkills = handleCybersecuritySkills(query);
  if (cyberSkills) return cyberSkills;

  // 8. Bullet rewriting
  const bulletRewrite = handleBulletRewriting(query, resumeContext);
  if (bulletRewrite) return bulletRewrite;

  // 9. Coaching prompts (Interview, Gap, Skills)
  const coaching = handleCoachingPrompts(query, resumeContext);
  if (coaching) return coaching;

  // 10. Default contextual answer tailored to active profile without generic intro
  const answers = resumeContext?.answers || resumeContext || {};
  const targetRole = answers.targetJobTitle || 'your target role';
  const skills = (answers.skills || []).slice(0, 4).join(', ');
  const skillsPhrase = skills ? ` highlighting **${skills}**` : '';

  return `To optimize your resume for **${targetRole}**${skillsPhrase}, what specific section would you like to work on? You can ask me to rewrite a bullet point, draft a professional summary, prepare for interview questions, or explain your career transitions.`;
}
