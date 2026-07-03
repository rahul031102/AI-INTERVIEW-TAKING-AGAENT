import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
    feedback: String,
    score: String,
    weakTopics: [String],
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
