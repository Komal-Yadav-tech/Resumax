/**
 * Exports an HTML element as a high-quality PDF document.
 * 
 * @param {HTMLElement|string} elementOrId - The element or ID of the element to export
 * @param {string} fileName - Destination filename
 * @returns {Promise<void>}
 */
export const exportResumeToPdf = async (elementOrId, fileName = 'Resume.pdf') => {
  if (typeof window === 'undefined') {
    return;
  }

  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = html2pdfModule.default || html2pdfModule;

  const element =
    typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;

  if (!element) {
    throw new Error('Resume element not found for PDF export.');
  }

  const isLetter = element.getAttribute('data-page-size') === 'letter';
  const pageFormat = isLetter ? 'letter' : 'a4';

  const opt = {
    margin: 0,
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    enableLinks: true,
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true
    },
    jsPDF: {
      unit: 'mm',
      format: pageFormat,
      orientation: 'portrait'
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy']
    }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
