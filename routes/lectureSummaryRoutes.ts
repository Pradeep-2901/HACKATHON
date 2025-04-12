import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { spawn } from 'child_process';
import LectureSummary from '../models/LectureSummary';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user?: any;
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'uploads/');
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: function (req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP3 and WAV files are allowed.'));
    }
  },
});

// Upload and process lecture recording
router.post('/upload', authenticateToken, upload.single('audio'), async (req: Request, res: Response) => {
  try {
    const multerReq = req as MulterRequest;
    if (!multerReq.file) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    // Create a new lecture summary document
    const lectureSummary = new LectureSummary({
      title: req.body.title || 'Untitled Lecture',
      subject: req.body.subject || 'General',
      teacherId: multerReq.user?.id,
      audioFile: {
        url: `/uploads/${multerReq.file.filename}`,
        filename: multerReq.file.filename,
      },
      status: 'pending'
    });

    await lectureSummary.save();
    res.status(201).json(lectureSummary);
  } catch (error) {
    console.error('Error uploading lecture:', error);
    res.status(500).json({ message: 'Error uploading lecture' });
  }
});

// Get all lecture summaries for a teacher
router.get('/teacher', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const summaries = await LectureSummary.find({ teacherId: req.user!.id })
      .sort({ createdAt: -1 });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lecture summaries' });
  }
});

// Get published lecture summaries for students
router.get('/student', authenticateToken, async (req: Request, res: Response) => {
  try {
    const summaries = await LectureSummary.find({ status: 'published' })
      .sort({ publishedAt: -1 });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lecture summaries' });
  }
});

// Publish a lecture summary
router.patch('/:id/publish', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const summary = await LectureSummary.findOne({
      _id: req.params.id,
      teacherId: req.user!.id,
    });

    if (!summary) {
      return res.status(404).json({ message: 'Lecture summary not found' });
    }

    summary.status = 'published';
    summary.publishedAt = new Date();
    await summary.save();

    res.json({ message: 'Lecture summary published successfully', summary });
  } catch (error) {
    res.status(500).json({ message: 'Error publishing lecture summary' });
  }
});

// Delete a lecture summary
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const summary = await LectureSummary.findOneAndDelete({
      _id: req.params.id,
      teacherId: req.user!.id,
    });

    if (!summary) {
      return res.status(404).json({ message: 'Lecture summary not found' });
    }

    res.json({ message: 'Lecture summary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lecture summary' });
  }
});

export default router; 