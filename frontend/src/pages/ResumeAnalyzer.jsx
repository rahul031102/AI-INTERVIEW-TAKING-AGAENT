import { useState, useRef } from 'react';
import api from '../api/axios';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) {
      setError('Please choose a PDF before analyzing.');
      return;
    }

    setError('');

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('resume', file);

      const res = await api.post(
        '/resume/analyze',
        formData
      );

      setAnalysis(res.data || 'No analysis returned.');
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.error ||
          'Resume analysis failed. Check backend and file format.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-black mb-4">
          Resume Analyzer
        </h1>

        <p className="text-zinc-400 text-lg mb-10">
          Upload your resume and get
          AI-powered analysis.
        </p>

        {/* Upload Card */}
        <div className="bg-slate-900 border border-white/10 rounded-[32px] p-10">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mb-4 inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white transition hover:bg-white/10"
          >
            Choose PDF
          </button>

          {file ? (
            <p className="mb-6 text-sm text-zinc-300">
              Selected file: <span className="font-medium text-white">{file.name}</span>
            </p>
          ) : (
            <p className="mb-6 text-sm text-zinc-500">No file selected yet.</p>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition-all duration-300 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Analyzing Resume...' : 'Analyze Resume'}
          </button>
          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}
        </div>

        {/* Analysis */}
       {analysis && (
  <div className="mt-10 text-white">

    <h2 className="text-4xl font-bold mb-6">
      AI Resume Analysis
    </h2>

    <div className="mb-6">
      <h3 className="text-2xl font-semibold mb-2">
        Skills
      </h3>

      <div className="flex flex-wrap gap-2">
        {analysis.skills?.map(
          (skill, index) => (
            <span
              key={index}
              className="bg-purple-600 px-4 py-2 rounded-xl"
            >
              {skill}
            </span>
          )
        )}
      </div>
    </div>

    <div className="mb-6">
      <h3 className="text-2xl font-semibold mb-2">
        Strengths
      </h3>

      <ul className="list-disc ml-6">
        {analysis.strengths?.map(
          (item, index) => (
            <li key={index}>
              {item}
            </li>
          )
        )}
      </ul>
    </div>

    <div className="mb-6">
      <h3 className="text-2xl font-semibold mb-2">
        Weaknesses
      </h3>

      <ul className="list-disc ml-6 text-red-400">
        {analysis.weaknesses?.map(
          (item, index) => (
            <li key={index}>
              {item}
            </li>
          )
        )}
      </ul>
    </div>

    <div className="mb-6">
      <h3 className="text-2xl font-semibold mb-2">
        Missing Technologies
      </h3>

      <div className="flex flex-wrap gap-2">
        {analysis.missingTechnologies?.map(
          (tech, index) => (
            <span
              key={index}
              className="bg-red-600 px-4 py-2 rounded-xl"
            >
              {tech}
            </span>
          )
        )}
      </div>
    </div>

    <div>
      <h3 className="text-2xl font-semibold mb-2">
        Interview Questions
      </h3>

      <ul className="list-disc ml-6">
        {analysis.interviewQuestions?.map(
          (question, index) => (
            <li key={index}>
              {question}
            </li>
          )
        )}
      </ul>
    </div>

  </div>
)}
      </div>
    </div>
  );
}
