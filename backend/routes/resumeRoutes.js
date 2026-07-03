import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { analyzeResume, analyzeResumeBase64 } from '../controllers/resumeController.js';

const router = express.Router();

// Accept any uploaded file field to avoid "Unexpected field" Multer errors from clients
router.post('/analyze', upload.any(), analyzeResume);

// Alternative: accept base64 PDF in JSON body to avoid multipart parsing problems
router.post('/analyze-base64', analyzeResumeBase64);

export default router;
