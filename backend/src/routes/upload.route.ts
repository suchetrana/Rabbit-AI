import { Router } from 'express';
import { handleUpload } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload';
import { uploadRateLimiter } from '../middlewares/rateLimiter';
import { validate } from '../middlewares/validate';
import { uploadBodySchema } from '../validators/upload.validator';

const router = Router();

router.post(
  '/',
  uploadRateLimiter,
  upload.single('file'),
  validate(uploadBodySchema),
  handleUpload
);

export default router;
