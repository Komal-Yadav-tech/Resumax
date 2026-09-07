import { exportResumeToPdf } from './pdfService.js';
import { exportResumeToDocx } from './docxService.js';
import { exportResumeToTxt } from './txtService.js';

/**
 * Sanitizes candidate name into a clean file basename.
 * @param {string} fullName 
 * @returns {string}
 */
export const sanitizeResumeFilename = (fullName = 'Resume') => {
  const trimmed = (fullName || '').trim();
  if (!trimmed) return 'Resume';
  return trimmed
    .replace(/[^a-zA-Z0-9_\-\.]/g, '_')
    .replace(/_+/g, '_');
};

/**
 * Master multi-format export handler for Resumax.
 * 
 * @param {('pdf'|'docx'|'txt')} format 
 * @param {Object} options 
 * @param {string} options.elementId - DOM target element ID for PDF export
 * @param {Object} options.answers - Resume data structure
 * @param {Object} options.generatedContent - AI generated content
 * @param {Function} [options.onFeedbackTrigger] - Callback to trigger review popup after download
 * @returns {Promise<void>}
 */
export const exportResume = async (format, options = {}) => {
  const {
    elementId = 'resume-export-target',
    answers = {},
    generatedContent = null,
    onFeedbackTrigger = null
  } = options;

  const baseName = sanitizeResumeFilename(answers?.fullName || 'Resume');

  try {
    if (format === 'pdf') {
      await exportResumeToPdf(elementId, `${baseName}_Resume.pdf`);
    } else if (format === 'docx') {
      await exportResumeToDocx(answers, generatedContent, `${baseName}_Resume.docx`);
    } else if (format === 'txt') {
      exportResumeToTxt(answers, generatedContent, `${baseName}_Resume.txt`);
    } else {
      throw new Error(`Unsupported export format: ${format}`);
    }

    // Trigger Review/Feedback popup after download if callback provided
    if (typeof onFeedbackTrigger === 'function') {
      // Short delay so download starts first
      setTimeout(() => {
        onFeedbackTrigger('download');
      }, 600);
    }
  } catch (error) {
    console.error(`Export failed for format [${format}]:`, error);
    throw error;
  }
};
