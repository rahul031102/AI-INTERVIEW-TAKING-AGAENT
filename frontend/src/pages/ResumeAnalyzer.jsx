import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, AlertCircle, CheckCircle2, XCircle, 
  ArrowRight, Award, HelpCircle, ChevronRight, RefreshCw, Briefcase
} from 'lucide-react';
import api from '../api/axios';
import GlassCard from '../components/common/GlassCard';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) {
      setError('Please choose a PDF before analyzing.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const res = await api.post('/resume/analyze', formData);
      setAnalysis(res.data || null);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          'Resume analysis failed. Please verify the file is a valid PDF.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysis(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Helper to check formatting validation states dynamically
  const checkPass = (keyword) => {
    if (!analysis || !analysis.formattingIssues) return true;
    return !analysis.formattingIssues.some(issue => 
      issue.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const checks = [
    { label: 'Standard Experience Header', key: 'experience' },
    { label: 'Standard Education Header', key: 'education' },
    { label: 'Standard Skills Header', key: 'skills' },
    { label: 'Standard Projects Header', key: 'projects' },
    { label: 'Contact Info Detected (Email/Phone)', key: 'contact' },
    { label: 'Quantified Bullet Achievements', key: 'quantified' },
    { label: 'Action Verb Variety', key: 'repetitive' },
    { label: 'Single-Column Layout Compatibility', key: 'column' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
              <FileText size={48} className="text-purple-400" />
              ATS Resume Auditor
            </h1>
            <p className="text-zinc-400 text-base md:text-lg mt-2">
              Optimize your resume match rate against specific job postings and audit layout compatibility issues.
            </p>
          </div>
          {analysis && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="self-start md:self-center flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 hover:bg-white/10 transition text-sm font-semibold"
            >
              <RefreshCw size={16} />
              Reset Audit
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6 lg:grid-cols-[1fr_1.2fr] items-start"
            >
              {/* Job Description Textarea */}
              <GlassCard delay={0.1}>
                <div className="flex items-center gap-2 mb-4 text-purple-400">
                  <Briefcase size={20} />
                  <h2 className="text-xl font-bold text-white">Target Job Description (Recommended)</h2>
                </div>
                <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                  Pasting the target job description allows the auditor to calculate your exact keyword overlap score and extract missing critical skills.
                </p>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job posting description here..."
                  className="w-full h-80 bg-slate-950 border border-white/10 rounded-2xl p-5 text-zinc-300 text-sm outline-none focus:border-purple-500/50 transition-all resize-none leading-relaxed"
                />
              </GlassCard>

              {/* Upload Card */}
              <GlassCard delay={0.2} className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-4 text-blue-400">
                    <Upload size={20} />
                    <h2 className="text-xl font-bold text-white">Upload Resume</h2>
                  </div>
                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                    Upload your resume file in PDF format to run parser formatting checks and compare details.
                  </p>

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="hidden"
                    />
                    <FileText size={48} className="text-zinc-500 group-hover:text-purple-400 transition" />
                    <span className="text-sm text-zinc-300 group-hover:text-white font-medium transition">
                      Click to choose PDF Resume file
                    </span>
                    <span className="text-xs text-zinc-500">PDF formats only (Max 5MB)</span>
                  </div>

                  {file && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-purple-500/10 p-4"
                    >
                      <FileText className="text-purple-400 shrink-0" size={24} />
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate text-white">{file.name}</p>
                        <p className="text-xs text-zinc-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 active:scale-[0.98] transition-all font-semibold flex items-center justify-center gap-2 text-white shadow-[0_20px_50px_rgba(124,58,237,0.2)] disabled:cursor-not-allowed disabled:opacity-60 text-base"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="animate-spin" size={20} />
                        Auditing Resume Layout & Keywords...
                      </>
                    ) : (
                      <>
                        Start ATS Audit
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-start gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
                    >
                      <AlertCircle className="shrink-0 mt-0.5" size={16} />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Radial Gauges & Formatting Checklist */}
              <div className="grid gap-6 md:grid-cols-[1.2fr_1.8fr] items-stretch">
                
                {/* Radial Gauges Card */}
                <GlassCard delay={0.1} className="flex flex-col justify-center gap-8 py-10">
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-bold text-white mb-6 text-center">Audit Quality Score</h3>
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" className="stroke-white/5" strokeWidth="12" fill="transparent" />
                        <motion.circle 
                          cx="80" cy="80" r="70" 
                          className="stroke-purple-500" 
                          strokeWidth="12" 
                          fill="transparent"
                          strokeDasharray={440}
                          initial={{ strokeDashoffset: 440 }}
                          animate={{ strokeDashoffset: 440 - (440 * (analysis.atsScore || 0)) / 100 }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                        />
                      </svg>
                      <div className="absolute text-center">
                        <p className="text-4xl font-extrabold text-white">{analysis.atsScore || 0}</p>
                        <p className="text-xs uppercase tracking-widest text-zinc-400 mt-1">ATS Match</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-bold text-white mb-6 text-center">Layout Parsing score</h3>
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" className="stroke-white/5" strokeWidth="12" fill="transparent" />
                        <motion.circle 
                          cx="80" cy="80" r="70" 
                          className="stroke-blue-500" 
                          strokeWidth="12" 
                          fill="transparent"
                          strokeDasharray={440}
                          initial={{ strokeDashoffset: 440 }}
                          animate={{ strokeDashoffset: 440 - (440 * (analysis.formattingScore || 0)) / 100 }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                        />
                      </svg>
                      <div className="absolute text-center">
                        <p className="text-4xl font-extrabold text-white">{analysis.formattingScore || 0}</p>
                        <p className="text-xs uppercase tracking-widest text-zinc-400 mt-1">Layout</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Checklist formatting Audit card */}
                <GlassCard delay={0.2}>
                  <div className="flex items-center gap-2 mb-6">
                    <Award size={22} className="text-purple-400" />
                    <h3 className="text-xl font-bold text-white">ATS Parsing Checklist</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {checks.map((check, index) => {
                      const isPassing = checkPass(check.key);
                      return (
                        <div key={index} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
                          {isPassing ? (
                            <CheckCircle2 className="text-green-400 shrink-0" size={24} />
                          ) : (
                            <XCircle className="text-red-400 shrink-0" size={24} />
                          )}
                          <span className={`text-sm ${isPassing ? 'text-zinc-200' : 'text-zinc-400 line-through'}`}>
                            {check.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {analysis.formattingIssues && analysis.formattingIssues.length > 0 && (
                    <div className="mt-6 border-t border-white/10 pt-6">
                      <h4 className="text-sm font-semibold text-zinc-300 mb-3">Formatting Warnings ({analysis.formattingIssues.length})</h4>
                      <ul className="space-y-2">
                        {analysis.formattingIssues.map((issue, index) => (
                          <li key={index} className="text-sm text-amber-400 flex items-start gap-2">
                            <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-amber-400" />
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </GlassCard>

              </div>

              {/* Actionable Insights */}
              <div className="grid gap-6 md:grid-cols-2">
                <GlassCard delay={0.3}>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    Key Strengths
                  </h3>
                  <ul className="space-y-3">
                    {analysis.strengths?.map((item, index) => (
                      <li key={index} className="text-sm text-zinc-300 flex items-start gap-2 leading-relaxed">
                        <ChevronRight className="text-green-400 shrink-0 mt-0.5" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                <GlassCard delay={0.4}>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    Audited Weaknesses
                  </h3>
                  <ul className="space-y-3">
                    {analysis.weaknesses?.map((item, index) => (
                      <li key={index} className="text-sm text-zinc-300 flex items-start gap-2 leading-relaxed">
                        <ChevronRight className="text-red-400 shrink-0 mt-0.5" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>

              {/* Recommendations & Missing Tech */}
              <div className="grid gap-6 md:grid-cols-[1.8fr_1.2fr]">
                <GlassCard delay={0.5}>
                  <h3 className="text-xl font-bold text-white mb-4">ATS Recommendations</h3>
                  <ul className="space-y-3">
                    {analysis.recommendations?.map((rec, index) => (
                      <li key={index} className="text-sm text-zinc-300 flex items-start gap-2 leading-relaxed bg-white/5 border border-white/5 rounded-xl p-3">
                        <CheckCircle2 className="text-purple-400 shrink-0 mt-0.5" size={16} />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                <div className="space-y-6">
                  {/* Matched Skills */}
                  <GlassCard delay={0.6}>
                    <h3 className="text-lg font-bold text-white mb-3">Detected Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills?.map((skill, index) => (
                        <span key={index} className="text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-1.5 rounded-xl">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Missing Technologies */}
                  <GlassCard delay={0.7}>
                    <h3 className="text-lg font-bold text-white mb-3 text-red-400">Missing Key Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingTechnologies?.length > 0 ? (
                        analysis.missingTechnologies.map((tech, index) => (
                          <span key={index} className="text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-xl">
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-500 text-sm font-medium">All target skills detected!</span>
                      )}
                    </div>
                  </GlassCard>
                </div>
              </div>

              {/* Prep Interview Questions */}
              {analysis.interviewQuestions && analysis.interviewQuestions.length > 0 && (
                <GlassCard delay={0.8}>
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="text-blue-400" />
                    <h3 className="text-xl font-bold text-white">Recommended Prep Questions</h3>
                  </div>
                  <p className="text-zinc-400 text-sm mb-4">
                    Based on your resume audit and target role description, we recommend preparing answers for these specific technical questions:
                  </p>
                  <div className="grid gap-3">
                    {analysis.interviewQuestions.map((question, index) => (
                      <div key={index} className="flex gap-3 bg-white/5 border border-white/5 rounded-2xl p-4 text-sm leading-relaxed text-zinc-300">
                        <span className="font-extrabold text-blue-400">0{index + 1}.</span>
                        <span>{question}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
