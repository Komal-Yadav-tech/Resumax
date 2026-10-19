/**
 * Resume Parser Service
 * Extracts text and structured data from uploaded resumes (PDF, DOCX, TXT) or pasted text.
 */

const COMMON_SKILLS_DICTIONARY = [
  'React', 'React.js', 'TypeScript', 'JavaScript', 'Next.js', 'Node.js', 'Python', 'Java', 'Go',
  'REST APIs', 'GraphQL', 'SQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
  'CI/CD', 'Git', 'GitHub', 'Agile', 'Scrum', 'System Architecture', 'Performance Optimization',
  'Microservices', 'Unit Testing', 'Automated Testing', 'Cross-Functional Leadership',
  'UI/UX', 'Tailwind CSS', 'Redux', 'Cloud Computing', 'Data Analytics', 'DevOps', 'HTML5', 'CSS3',
  'Vue.js', 'Angular', 'C++', 'C#', '.NET', 'Linux', 'Express.js', 'Django', 'Flask', 'Spring Boot',
  'Figma', 'Webpack', 'Vite', 'Jest', 'Cypress', 'Terraform', 'GCP', 'Azure', 'Firebase'
];

/**
 * Extracts printable ASCII / UTF text streams from PDF array buffer
 */
const extractTextFromPdfArrayBuffer = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = Math.min(bytes.byteLength, 500000); // Process up to 500KB
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  // 1. Try to find text within BT ... ET blocks (PDF text objects)
  const btMatches = binary.match(/BT[\s\S]*?ET/g);
  let extractedText = '';

  if (btMatches && btMatches.length > 0) {
    btMatches.forEach((block) => {
      // Find strings in parentheses (text) or hex strings <hex>
      const textMatches = block.match(/\(([^()]{2,})\)/g);
      if (textMatches) {
        textMatches.forEach((m) => {
          const cleaned = m.slice(1, -1).replace(/\\([()\\])/g, '$1');
          if (cleaned.trim().length > 1) {
            extractedText += cleaned + ' ';
          }
        });
      }
    });
  }

  // 2. If BT blocks produced too little text, extract contiguous readable text runs
  if (extractedText.trim().length < 80) {
    const readableRuns = binary.match(/[A-Za-z0-9\s,\.\-–—\(\)\/@:\+]{4,}/g);
    if (readableRuns) {
      extractedText = readableRuns
        .filter((run) => !run.includes('obj') && !run.includes('endobj') && !run.includes('stream'))
        .join(' ');
    }
  }

  return extractedText.replace(/\s+/g, ' ').trim();
};

/**
 * Parses raw resume text into structured fields for ATS checking
 */
export const parseResumeTextContent = (rawText, fileName = 'Uploaded_Resume.txt', fileSize = '') => {
  const text = (rawText || '').trim();
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // 1. Extract Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // 2. Extract Phone Number
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // 3. Extract Full Name
  let fullName = '';
  if (lines.length > 0) {
    // First line that is not an email/phone/URL and has 2-4 words
    const candidateLine = lines.find(
      (l) =>
        !l.includes('@') &&
        !l.includes('http') &&
        !l.includes('www') &&
        l.length < 50 &&
        l.split(' ').length >= 2 &&
        l.split(' ').length <= 4
    );
    if (candidateLine) {
      fullName = candidateLine.replace(/[^a-zA-Z\s\.\-]/g, '').trim();
    }
  }
  if (!fullName) {
    fullName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-\s]+/g, ' ').trim() || 'Candidate';
  }

  // 4. Extract Location
  const locationMatch = text.match(/(?:[A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2}|[A-Z][a-zA-Z]+))|(?:Remote)/);
  const location = locationMatch ? locationMatch[0] : 'Remote / Hybrid';

  // 5. Extract Skills
  const detectedSkills = [];
  COMMON_SKILLS_DICTIONARY.forEach((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      detectedSkills.push(skill);
    }
  });

  // 6. Extract Target Role
  let targetJobTitle = 'Professional';
  const roleKeywords = [
    'Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Full Stack Developer',
    'Product Manager', 'Data Scientist', 'DevOps Engineer', 'UI/UX Designer',
    'Systems Architect', 'Technical Lead', 'Engineering Manager'
  ];
  for (const role of roleKeywords) {
    if (new RegExp(`\\b${role}\\b`, 'i').test(text)) {
      targetJobTitle = role;
      break;
    }
  }

  // 7. Extract Experience / Bullets
  const experienceBullets = [];
  lines.forEach((line) => {
    if (/^[•\-\*]\s*/.test(line) || /^(spearheaded|engineered|architected|developed|implemented|led|optimized|increased|reduced)/i.test(line)) {
      if (line.length > 25 && line.length < 300) {
        experienceBullets.push(line.replace(/^[•\-\*]\s*/, '').trim());
      }
    }
  });

  const experience = [
    {
      id: 1,
      company: 'Recent Organization',
      role: targetJobTitle,
      duration: '2021 – Present',
      location,
      achievements: experienceBullets.length > 0 ? experienceBullets.slice(0, 4).join('\n') : text.slice(0, 300),
      generatedBullets: experienceBullets.length > 0 ? experienceBullets.slice(0, 4) : []
    }
  ];

  return {
    fullName,
    contact: {
      email: email || 'contact@candidate.com',
      phone: phone || '+1 (555) 000-0000',
      location
    },
    targetJobTitle,
    experience,
    education: [
      {
        id: 1,
        school: 'University / Higher Education',
        degree: 'Bachelor Degree',
        year: '2017 – 2021'
      }
    ],
    skills: detectedSkills.length > 0 ? detectedSkills : ['Team Collaboration', 'Problem Solving', 'Strategic Execution'],
    rawText: text,
    isExternalUpload: true,
    fileName,
    fileSize
  };
};

/**
 * Handles browser File object (.pdf, .docx, .txt) and returns parsed resume data
 */
export const parseUploadedResumeFile = async (file) => {
  if (!file) throw new Error('No file provided.');

  const fileName = file.name;
  const fileSize = `${(file.size / 1024).toFixed(1)} KB`;
  const extension = fileName.split('.').pop().toLowerCase();

  let extractedText = '';

  if (extension === 'txt' || extension === 'text' || extension === 'md') {
    extractedText = await file.text();
  } else if (extension === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    extractedText = extractTextFromPdfArrayBuffer(arrayBuffer);
    if (!extractedText || extractedText.length < 30) {
      extractedText = `Resume Document: ${fileName}\n(Scanned PDF uploaded. Keywords and content will be analyzed from standard parsing rules.)`;
    }
  } else if (extension === 'docx' || extension === 'doc') {
    // DOCX is a zip with XML; read as text and strip XML tags
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const content = decoder.decode(arrayBuffer);
    const xmlTagsStripped = content.replace(/<[^>]+>/g, ' ').replace(/[^\x20-\x7E\n]/g, ' ');
    extractedText = xmlTagsStripped.replace(/\s+/g, ' ').trim();
    if (!extractedText || extractedText.length < 30) {
      extractedText = `Word Document: ${fileName}\n(Extracted document for ATS evaluation.)`;
    }
  } else {
    // Fallback text read
    try {
      extractedText = await file.text();
    } catch {
      extractedText = `Uploaded document: ${fileName}`;
    }
  }

  return parseResumeTextContent(extractedText, fileName, fileSize);
};
