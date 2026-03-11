import { Request, Response, NextFunction } from 'express';
import { parseFile } from '../services/parser.service';
import { generateSummary } from '../services/ai.service';
import { sendEmail } from '../services/mailer.service';
import { marked } from 'marked';

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload sales data and receive AI-generated summary via email
 *     tags: [Upload]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - email
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or XLSX sales data file (max 10MB)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient email for the generated report
 *     responses:
 *       200:
 *         description: Summary generated and email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 summary:
 *                   type: string
 *       400:
 *         description: Validation error or missing file
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 */
export const handleUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file;
    const { email } = req.body;

    if (!file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }

    // 1. Parse file → JSON
    const data = parseFile(file.buffer, file.originalname);

    if (data.length === 0) {
      res.status(400).json({ success: false, error: 'File contains no data rows' });
      return;
    }

    // 2. Generate AI summary
    const summary = await generateSummary(data);

    // 3. Convert markdown to HTML for email
    const htmlContent = await marked(summary);

    // 4. Try to send email — don't fail the whole request if email fails
    let emailSent = false;
    let emailError = '';
    try {
      await sendEmail({
        to: email,
        subject: '📊 Your Sales Insight Report — Rabbitt',
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px;">
            <h1 style="color: #6C63FF;">Rabbitt Sales Insight Report</h1>
            <p style="color: #666;">Generated from <strong>${file.originalname}</strong> (${data.length} rows analyzed)</p>
            <hr style="border: 1px solid #eee;" />
            ${htmlContent}
            <hr style="border: 1px solid #eee;" />
            <p style="color: #999; font-size: 12px;">Powered by Rabbitt Sales Insight Automator</p>
          </div>
        `,
      });
      emailSent = true;
    } catch (mailErr: any) {
      emailError = mailErr.message || 'Email delivery failed';
      console.error('[MAIL ERROR]', emailError);
    }

    res.status(200).json({
      success: true,
      message: emailSent
        ? `Report sent to ${email}`
        : `Report generated but email failed: ${emailError}`,
      emailSent,
      summary,
      summaryHtml: htmlContent,
    });
  } catch (error) {
    next(error);
  }
};
