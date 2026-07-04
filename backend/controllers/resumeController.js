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
    const strings = content.items.map((item) => item.str);
    text += strings.join(' ') + '\n';
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
  const headers = ['experience', 'education', 'skills', 'projects'];
  headers.forEach(h => {
    if (!low.includes(h)) {
      formattingScore -= 15;
      formattingIssues.push(`Missing standard "${h.charAt(0).toUpperCase() + h.slice(1)}" section header`);
    }
  });

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
2. Formatting Score (0-100) based on structure, presence of standard section headers (Experience, Education, Skills, Projects, Summary), contact details presence, absence of tables/images that block parsers, and usage of quantified metrics in achievements.
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

    res.json(analysis);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Base64 resume analysis failed',
    });
  }
};