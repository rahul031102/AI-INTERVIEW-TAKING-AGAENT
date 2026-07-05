import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import Groq from 'groq-sdk';
import fs from 'fs';

const extractTextFromPDF = async (buffer) => {
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    
    let pageText = '';
    let lastY = null;

    for (const item of content.items) {
      if (typeof item.str === 'string') {
        const currentY = item.transform && item.transform[5];
        if (lastY !== null && currentY !== lastY) {
          pageText += '\n' + item.str;
        } else {
          if (pageText === '' || pageText.endsWith('\n') || pageText.endsWith(' ') || item.str.startsWith(' ')) {
            pageText += item.str;
          } else {
            pageText += ' ' + item.str;
          }
        }
        if (currentY !== undefined) {
          lastY = currentY;
        }
      }
    }
    text += pageText + '\n';
  }

  return text;
};

const getHeuristicAnalysis = (resumeText, jobDescription = '') => {
  const standardKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Node', 'Express', 'MongoDB',
    'SQL', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes', 'HTML', 'CSS',
    'Git', 'C++', 'C#', 'TensorFlow', 'PyTorch', 'REST API', 'GraphQL', 'Next.js'
  ];

  const jdKeywords = jobDescription
    ? standardKeywords.filter(keyword => 
        jobDescription.toLowerCase().includes(keyword.toLowerCase())
      )
    : standardKeywords;

  const found = [];
  const low = resumeText.toLowerCase();

  for (const keyword of standardKeywords) {
    if (low.includes(keyword.toLowerCase())) {
      found.push(keyword);
    }
  }

  // Calculate ATS Score based on matched keywords against JD keywords
  const matchedJdKeywords = jdKeywords.filter(k => found.includes(k));
  const keywordMatchRate = jdKeywords.length > 0 ? (matchedJdKeywords.length / jdKeywords.length) : 0.5;
  const atsScore = Math.min(100, Math.round(keywordMatchRate * 80 + 20));

  // Calculate Formatting Score
  let formattingScore = 100;
  const formattingIssues = [];

  // Check section headers
  const requiredHeaders = ['experience', 'education', 'skills'];
  requiredHeaders.forEach(h => {
    if (!low.includes(h)) {
      formattingScore -= 15;
      formattingIssues.push(`Missing standard "${h.charAt(0).toUpperCase() + h.slice(1)}" section header`);
    }
  });

  const additionalHeaders = ['projects', 'achievements', 'certifications', 'awards'];
  const hasAdditional = additionalHeaders.some(h => low.includes(h));
  if (!hasAdditional) {
    formattingScore -= 15;
    formattingIssues.push('Missing standard "Projects", "Achievements", "Certifications" or "Awards" section header');
  }

  // Check contact info
  const contactTerms = ['email', 'phone', '@', 'linkedin', 'github'];
  const hasContactInfo = contactTerms.some(term => low.includes(term));
  if (!hasContactInfo) {
    formattingScore -= 20;
    formattingIssues.push('No contact info details found (email, phone, LinkedIn or GitHub link)');
  }

  // Check quantified metrics
  const hasQuantifiers = [/%/, /\$\d/, /USD/, /percent/, /increased/, /reduced/, /\d+x/].some(rx => rx.test(low));
  if (!hasQuantifiers) {
    formattingScore -= 15;
    formattingIssues.push('No quantified achievements detected (use percentages, revenue numbers, or metrics)');
  }

  formattingScore = Math.max(20, formattingScore);

  const skills = found.length ? found : ['General Software Engineering'];
  const missingTechnologies = jdKeywords
    .filter((k) => !found.includes(k))
    .slice(0, 5);

  const recommendations = [
    'Add specific technology keywords matching the job description.',
    'Include metrics (e.g. optimized performance by 30%, handled 10k users) in your work achievements.',
    'Ensure email, phone, and professional links are clearly visible at the top.'
  ];
  if (formattingIssues.length > 0) {
    recommendations.push('Fix layout formatting errors to prevent parser extraction failure.');
  }

  return {
    atsScore,
    formattingScore,
    skills,
    strengths: found.length >= 3 ? found.slice(0, 3).map(k => `Strong experience in ${k}`) : ['Solid foundation in engineering concepts'],
    weaknesses: found.length < 3 ? ['Limited technical keywords found in the resume'] : ['Could showcase more system design or cloud tooling experience'],
    missingTechnologies,
    formattingIssues,
    recommendations,
    interviewQuestions: [
      found[0] ? `Explain a complex challenge you solved using ${found[0]}.` : 'Describe a technical project you worked on recently.',
      'Walk me through your debugging flow.',
      'How do you approach designing robust microservices?'
    ]
  };
};

const getAIAnalysis = async (resumeText, jobDescription = '') => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `
You are an expert ATS (Applicant Tracking System) parser and senior technical recruiter.

Analyze this resume text against the provided job description. If no job description is provided, evaluate the resume generally against industry standards for a senior software development/engineering role.

Perform an in-depth audit of:
1. ATS Score (0-100) based on keyword match, relevance, and criteria coverage.
2. Formatting Score (0-100) based on structure, presence of standard section headers (Experience, Education, Skills, Projects, Summary, Achievements, Certifications, Awards — treat any of these as valid, not just the first five listed), contact details presence, absence of tables/images that block parsers, and usage of quantified metrics in achievements.
3. Keyword comparison: matched skills vs missing technologies.
4. Specific formatting issues detected (e.g. multi-columns, tables, non-standard section headers, missing email/phone).
5. Strengths and weaknesses.
6. Actionable recommendations to optimize the resume for ATS scanners.
7. Custom technical mock interview questions based on the candidate's experience.

Return ONLY raw JSON. Do not use markdown. Do not use code blocks. Do not explain anything.

Format:
{
  "atsScore": 85,
  "formattingScore": 90,
  "skills": ["JavaScript", "React"],
  "strengths": ["Quantified bullet points", "Clear project section"],
  "weaknesses": ["Low keyword frequency for Node.js", "Lack of cloud experience"],
  "missingTechnologies": ["Docker", "AWS"],
  "formattingIssues": ["Multi-column layouts could cause parsing order issues", "Missing LinkedIn contact link"],
  "recommendations": ["Re-format to a single-column layout", "Add quantified achievements in the React Developer role description"],
  "interviewQuestions": ["How do you optimize state rendering in React?"]
}

Target Job Description:
${jobDescription || 'Standard Software Engineer Role'}

Resume:
${resumeText}
`,
      },
    ],
  });

  const raw = response.choices[0].message.content;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');

  if (start === -1 || end === -1) {
    throw new Error('No JSON found in AI response');
  }

  const jsonString = raw.slice(start, end + 1);
  return JSON.parse(jsonString);
};

const extractBullets = (text) => {
  if (!text) return [];

  // Match bullet points starting with common symbols
  // We use a regex matching bullet characters, optionally preceded by spaces/newlines, and followed by spaces.
  const bulletSymbolsRegex = /(?:^|[\r\n]|\s+)(?:[-*•▪◦●■♦⁃✔\u2022\u2023\u2043\u2219\u25cb\u25cf\u25e6\u25aa\u25ab])\s+/g;
  
  // Split by bullet symbols
  const parts = text.split(bulletSymbolsRegex);
  
  let bullets = [];
  
  if (parts.length > 1) {
    // Part 0 is pre-bullet text. Part 1 onwards are the bullets.
    bullets = parts.slice(1).map(p => p.trim());
  } else {
    // If no bullet symbols are found, let's fall back to splitting by newlines, 
    // and filter for lines that start with standard lists or digits/action verbs.
    const lines = text.split(/[\r\n]+/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^[-*•▪◦●■♦⁃✔\u2022\u2023\u2043\u2219\u25cb\u25cf\u25e6\u25aa\u25ab]/.test(trimmed)) {
        bullets.push(trimmed.replace(/^[-*•▪◦●■♦⁃✔\u2022\u2023\u2043\u2219\u25cb\u25cf\u25e6\u25aa\u25ab\s]+/, ''));
      } else if (/^\d+[\s.)]/.test(trimmed)) {
        bullets.push(trimmed.replace(/^\d+[\s.)]+/, ''));
      }
    }
  }

  // Clean trailing section headers from bullets (like "Education:", "Skills:")
  const sectionKeywords = [
    'education', 'skills', 'projects', 'experience', 'certifications', 'summary', 'contact', 'work history', 'professional experience'
  ];

  bullets = bullets.map(bullet => {
    let cleaned = bullet;
    for (const sec of sectionKeywords) {
      const secRegex = new RegExp(`(?:\\s+|^)(${sec})(?:\\s*\\:|\\s+and|\\s+[A-Z])`, 'i');
      const idx = cleaned.search(secRegex);
      if (idx !== -1) {
        cleaned = cleaned.substring(0, idx).trim();
      }
    }
    return cleaned;
  });

  // Filter out empty/too-short bullets
  return bullets.filter(b => b.length > 5);
};

const calculateDeterministicKeywordScore = (resumeText, jobDescription) => {
  const standardKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Node', 'Express', 'MongoDB',
    'SQL', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes', 'HTML', 'CSS',
    'Git', 'C++', 'C#', 'TensorFlow', 'PyTorch', 'REST API', 'GraphQL', 'Next.js'
  ];

  const jdKeywords = jobDescription
    ? standardKeywords.filter(keyword => 
        jobDescription.toLowerCase().includes(keyword.toLowerCase())
      )
    : standardKeywords;

  const found = [];
  const low = resumeText.toLowerCase();

  for (const keyword of standardKeywords) {
    if (low.includes(keyword.toLowerCase())) {
      found.push(keyword);
    }
  }

  const matchedJdKeywords = jdKeywords.filter(k => found.includes(k));
  const keywordMatchRate = jdKeywords.length > 0 ? (matchedJdKeywords.length / jdKeywords.length) : 0.5;
  return Math.min(100, Math.round(keywordMatchRate * 80 + 20));
};

const postProcessAnalysis = (analysis, resumeText, jobDescription) => {
  // Extract bullets
  const bullets = extractBullets(resumeText);
  const totalBullets = bullets.length;

  // Quantification Checker: strip years and phone numbers, then check for remaining digits
  const yearPattern = /\b(19|20)\d{2}\b/g;
  const phonePattern = /\+?\d[\d\s-]{7,}\d/g;

  const isQuantified = (bullet) => {
    const stripped = bullet.replace(phonePattern, '').replace(yearPattern, '');
    return /\d/.test(stripped);
  };

  const quantifiedCount = bullets.filter(isQuantified).length;
  const quantificationRatio = totalBullets > 0 ? (quantifiedCount / totalBullets) : 0;
  const quantificationScore = Math.round(quantificationRatio * 100);

  // Repetition Checker: flag bullets starting with same verb
  const getFirstVerb = (bullet) => {
    const cleaned = bullet.replace(/^[^a-zA-Z]+/, '').trim();
    const match = cleaned.match(/^[a-zA-Z]+(?:-[a-zA-Z]+)?/);
    return match ? match[0].toLowerCase() : null;
  };

  const verbCounts = {};
  bullets.forEach(bullet => {
    const verb = getFirstVerb(bullet);
    if (verb && verb.length > 2) {
      verbCounts[verb] = (verbCounts[verb] || 0) + 1;
    }
  });

  const repeatedVerbs = [];
  let totalExcess = 0;
  for (const [verb, count] of Object.entries(verbCounts)) {
    if (count > 1) {
      repeatedVerbs.push({ verb, count });
      totalExcess += (count - 1);
    }
  }
  const repetitionScore = totalBullets > 0 ? Math.max(0, 100 - (totalExcess * 10)) : 100;

  // Deterministic Keyword score
  const deterministicKeywordScore = calculateDeterministicKeywordScore(resumeText, jobDescription);

  // Blend overall score (atsScore)
  const aiAtsScore = typeof analysis.atsScore === 'number' ? analysis.atsScore : 50;
  const finalAtsScore = Math.round(
    (aiAtsScore * 0.4) +
    (deterministicKeywordScore * 0.3) +
    (quantificationScore * 0.2) +
    (repetitionScore * 0.1)
  );

  // Blend layout parsing score (formattingScore)
  const aiFormattingScore = typeof analysis.formattingScore === 'number' ? analysis.formattingScore : 50;
  let heuristicFormattingScore = 100;
  const lowText = resumeText.toLowerCase();
  
  // Headers check (widen to accept achievements, certifications, awards as valid alternatives)
  const requiredHeaders = ['experience', 'education', 'skills'];
  requiredHeaders.forEach(h => {
    if (!lowText.includes(h)) {
      heuristicFormattingScore -= 15;
    }
  });
  
  const additionalHeaders = ['projects', 'achievements', 'certifications', 'awards'];
  const hasAdditional = additionalHeaders.some(h => lowText.includes(h));
  if (!hasAdditional) {
    heuristicFormattingScore -= 15;
  }
  
  // Contact info check
  const contactTerms = ['email', 'phone', '@', 'linkedin', 'github'];
  const hasContactInfo = contactTerms.some(term => lowText.includes(term));
  if (!hasContactInfo) {
    heuristicFormattingScore -= 20;
  }
  
  // Quantification layout penalty
  if (quantificationScore < 50) {
    heuristicFormattingScore -= 15;
  }
  
  // Repetition layout penalty
  if (repetitionScore < 80) {
    heuristicFormattingScore -= 10;
  }
  
  heuristicFormattingScore = Math.max(20, heuristicFormattingScore);

  const finalFormattingScore = Math.round(
    (aiFormattingScore * 0.5) +
    (heuristicFormattingScore * 0.5)
  );

  // Update original analysis properties
  analysis.atsScore = finalAtsScore;
  analysis.formattingScore = finalFormattingScore;

  if (!analysis.formattingIssues) {
    analysis.formattingIssues = [];
  }

  // Handle quantification flags
  if (totalBullets === 0) {
    analysis.formattingIssues.push(
      "No bullet points detected in the resume text. Ensure achievements are structured as quantified bullet points."
    );
  } else if (quantificationScore < 50) {
    analysis.formattingIssues.push(
      `Low ratio of quantified achievements: Only ${quantifiedCount} out of ${totalBullets} bullet points (${quantificationScore}%) are quantified. Please add metrics like %, digits, "X users", or "Yx faster".`
    );
  }

  // Handle repetition flags
  if (repeatedVerbs.length > 0) {
    analysis.formattingIssues.push(
      `Repetitive starting verbs detected: Bullet points start with duplicate verbs. This flags verb variety issues.`
    );
    repeatedVerbs.forEach(({ verb, count }) => {
      analysis.formattingIssues.push(
        `Repetitive starting verb warning: The verb "${verb}" was used to start ${count} bullet points.`
      );
    });
  }

  // Update recommendations
  if (!analysis.recommendations) {
    analysis.recommendations = [];
  }
  if (totalBullets === 0) {
    analysis.recommendations.push(
      "Structure your resume achievements with clear, action-verb-led bullet points."
    );
  } else if (quantificationScore < 50) {
    analysis.recommendations.push(
      "Quantify your bullet achievements. Use specific numbers, percentages, and metrics to show the impact of your work."
    );
  }
  if (repeatedVerbs.length > 0) {
    analysis.recommendations.push(
      "Vary the action verbs used at the beginning of your bullet points. Avoid starting multiple bullets with the same verb (e.g. 'Developed')."
    );
  }

  return analysis;
};

export const analyzeResume = async (req, res) => {
  const file = req.file || (req.files && req.files[0]);
  const jobDescription = req.body.jobDescription || '';

  try {
    if (!file) {
      return res.status(400).json({
        error: 'No resume uploaded',
      });
    }

    const fileBuffer = file.buffer || fs.readFileSync(file.path);
    const resumeText = await extractTextFromPDF(fileBuffer);

    let analysis;

    try {
      analysis = await getAIAnalysis(resumeText, jobDescription);
    } catch (aiError) {
      console.log('AI failed, using fallback:', aiError.message);
      analysis = getHeuristicAnalysis(resumeText, jobDescription);
    }

    // Apply blended checks
    analysis = postProcessAnalysis(analysis, resumeText, jobDescription);

    res.json(analysis);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Resume analysis failed',
    });
  } finally {
    if (file && file.path) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error('Error deleting temp file:', err);
        }
      });
    }
  }
};

export const analyzeResumeBase64 = async (req, res) => {
  try {
    const { base64, jobDescription = '' } = req.body;

    if (!base64) {
      return res.status(400).json({
        error: 'No base64 payload provided',
      });
    }

    const buffer = Buffer.from(base64, 'base64');
    const resumeText = await extractTextFromPDF(buffer);

    let analysis;

    try {
      analysis = await getAIAnalysis(resumeText, jobDescription);
    } catch (aiError) {
      console.log('AI failed, using fallback:', aiError.message);
      analysis = getHeuristicAnalysis(resumeText, jobDescription);
    }

    // Apply blended checks
    analysis = postProcessAnalysis(analysis, resumeText, jobDescription);

    res.json(analysis);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Base64 resume analysis failed',
    });
  }
};