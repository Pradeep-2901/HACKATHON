import mongoose from 'mongoose';

const lectureSummarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  audioFile: {
    url: String,
    filename: String,
  },
  transcription: String,
  summary: {
    overview: String,
    keyPoints: [String],
    detailedExplanation: String,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  publishedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
lectureSummarySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const LectureSummary = mongoose.model('LectureSummary', lectureSummarySchema);

export default LectureSummary; 