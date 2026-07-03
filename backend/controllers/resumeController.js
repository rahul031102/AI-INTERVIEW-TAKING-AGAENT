import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import Groq from 'groq-sdk';
import fs from 'fs';
const extractTextFromPDF = async (
  buffer
) => {
  const pdf =
    await pdfjsLib.getDocument({
     data: new Uint8Array(buffer),
    }).promise;

  let text = '';

  for (
    let i = 1;
    i <= pdf.numPages;
    i++
  ) {
    const page =
      await pdf.getPage(i);

    const content =
      await page.getTextContent();

    const strings =
      content.items.map(
        (item) => item.str
      );

    text += strings.join(' ');
  }

  return text;
};

const getHeuristicAnalysis = (
  resumeText
) => {
  const keywords = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node',
    'Express',
    'MongoDB',
    'SQL',
    'Python',
    'Java',
    'AWS',
    'Docker',
    'Kubernetes',
    'HTML',
    'CSS',
    'Git',
    'C++',
    'C#',
    'TensorFlow',
    'PyTorch',
  ];

  const found = [];

  const low =
    resumeText.toLowerCase();

  for (const keyword of keywords) {
    if (
      low.includes(
        keyword.toLowerCase()
      )
    ) {
      found.push(keyword);
    }
  }

  const skills = found.length
    ? found
    : [
        'No clear technology keywords found',
      ];

  return {
    skills,

    strengths:
      found.length >= 3
        ? found.slice(0, 3)
        : [
            'Basic technical exposure',
          ],

    weaknesses:
      found.length < 3
        ? [
            'Limited explicit technical keywords',
            'Add more projects and technologies',
          ]
        : [
            'Could improve cloud/backend depth',
          ],

    missingTechnologies: keywords
      .filter((k) => !found.includes(k))
      .slice(0, 5),

    interviewQuestions: [
      found[0]
        ? `Explain a project where you used ${found[0]}.`
        : 'Describe a technical project you are proud of.',

      'Walk me through your debugging process.',

      'How would you design a scalable backend system?',
    ],
  };
};

const getAIAnalysis = async (
  resumeText
) => {
  const groq = new Groq({
    apiKey:
      process.env.GROQ_API_KEY,
  });

  const response =
    await groq.chat.completions.create(
      {
        model:
          'llama-3.3-70b-versatile',

        messages: [
          {
            role: 'user',

            content: `
You are an expert technical recruiter.

Analyze this resume.

Return ONLY raw JSON.
Do not use markdown.
Do not use code blocks.
Do not explain anything.

Format:
{
  "skills": [],
  "strengths": [],
  "weaknesses": [],
  "missingTechnologies": [],
  "interviewQuestions": []
}

Resume:
${resumeText}
`,
          },
        ],
      }
    );

  // const raw =
  //   response.choices[0].message.content;

  // // return JSON.parse(raw);
  const raw =
  response.choices[0].message.content;

const start =
  raw.indexOf('{');

const end =
  raw.lastIndexOf('}');

if (
  start === -1 ||
  end === -1
) {
  throw new Error(
    'No JSON found in AI response'
  );
}

const jsonString =
  raw.slice(start, end + 1);

return JSON.parse(jsonString);
  
};

export const analyzeResume = async (
  req,
  res
) => {
  const file =
    req.file ||
    (req.files &&
      req.files[0]);

  try {
    if (!file) {
      return res.status(400).json({
        error:
          'No resume uploaded',
      });
    }

    const fileBuffer =
      file.buffer ||
      fs.readFileSync(file.path);

    const resumeText =
      await extractTextFromPDF(
        fileBuffer
      );

    let analysis;

    try {
      analysis =
        await getAIAnalysis(
          resumeText
        );
    } catch (aiError) {
      console.log(
        'AI failed, using fallback:',
        aiError.message
      );

      analysis =
        getHeuristicAnalysis(
          resumeText
        );
    }

    res.json(analysis);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error:
        'Resume analysis failed',
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

export const analyzeResumeBase64 =
  async (req, res) => {
    try {
      const { base64 } = req.body;

      if (!base64) {
        return res.status(400).json({
          error:
            'No base64 payload provided',
        });
      }

      const buffer = Buffer.from(
        base64,
        'base64'
      );

      const resumeText =
        await extractTextFromPDF(
          buffer
        );

      let analysis;

      try {
        analysis =
          await getAIAnalysis(
            resumeText
          );
      } catch (aiError) {
        console.log(
          'AI failed, using fallback:',
          aiError.message
        );

        analysis =
          getHeuristicAnalysis(
            resumeText
          );
      }

      res.json(analysis);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error:
          'Base64 resume analysis failed',
      });
    }
  };