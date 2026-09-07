import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle
} from 'docx';

/**
 * Builds a structured Word Document (.docx) representing the resume.
 * 
 * @param {Object} answers 
 * @param {Object} generatedContent 
 * @returns {Document}
 */
export const buildResumeDocxDocument = (answers = {}, generatedContent = null) => {
  const name = (answers.fullName || 'Professional').trim();
  const targetRole = answers.targetJobTitle || '';
  const contact = answers.contact || {};
  const summary =
    generatedContent?.summary ||
    answers.summary ||
    (answers.targetJobTitle
      ? `Results-driven and impact-focused ${answers.targetJobTitle} with a demonstrated history of delivering scalable solutions, optimizing cross-functional workflows, and exceeding organizational benchmarks.`
      : '');

  const experience = answers.experience || [];
  const education = answers.education || [];
  const skills = answers.skills || [];

  const children = [];

  // Helper for Section Dividers
  const createSectionHeader = (title) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: '2563EB',
          space: 4,
          style: BorderStyle.SINGLE,
          size: 12
        }
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 24, // 12pt
          color: '1E293B',
          font: 'Calibri'
        })
      ]
    });
  };

  // 1. Header: Candidate Full Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: name,
          bold: true,
          size: 36, // 18pt
          color: '0F172A',
          font: 'Calibri'
        })
      ]
    })
  );

  // Target Job Title
  if (targetRole) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [
          new TextRun({
            text: targetRole,
            bold: true,
            size: 24, // 12pt
            color: '2563EB',
            font: 'Calibri'
          })
        ]
      })
    );
  }

  // Contact Information Bar
  const contactDetails = [];
  if (contact.email) contactDetails.push(contact.email);
  if (contact.phone) contactDetails.push(contact.phone);
  if (contact.location) contactDetails.push(contact.location);
  if (contact.website) contactDetails.push(contact.website);

  if (contactDetails.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [
          new TextRun({
            text: contactDetails.join('  •  '),
            size: 19, // 9.5pt
            color: '64748B',
            font: 'Calibri'
          })
        ]
      })
    );
  }

  // 2. Professional Summary
  if (summary) {
    children.push(createSectionHeader('Professional Summary'));
    children.push(
      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [
          new TextRun({
            text: summary,
            size: 21, // 10.5pt
            color: '334155',
            font: 'Calibri'
          })
        ]
      })
    );
  }

  // 3. Work Experience
  if (experience.length > 0) {
    children.push(createSectionHeader('Work Experience'));

    experience.forEach((exp) => {
      // Role & Company Header
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: exp.role || 'Contributor',
              bold: true,
              size: 22, // 11pt
              color: '0F172A',
              font: 'Calibri'
            }),
            new TextRun({
              text: exp.company ? ` | ${exp.company}` : '',
              italics: true,
              size: 21,
              color: '2563EB',
              font: 'Calibri'
            })
          ]
        })
      );

      // Duration & Location Subheading
      const meta = [exp.duration, exp.location].filter(Boolean).join(' | ');
      if (meta) {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 80 },
            children: [
              new TextRun({
                text: meta,
                size: 18, // 9pt
                color: '64748B',
                font: 'Calibri'
              })
            ]
          })
        );
      }

      // Experience Bullet Points
      const bullets =
        exp.generatedBullets && exp.generatedBullets.length > 0
          ? exp.generatedBullets
          : exp.achievements
            ? exp.achievements.split('\n').filter((b) => b.trim().length > 0)
            : [];

      bullets.forEach((bullet) => {
        const clean = bullet.replace(/^[•\-\*]\s*/, '').trim();
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: clean,
                size: 20, // 10pt
                color: '334155',
                font: 'Calibri'
              })
            ]
          })
        );
      });
    });
  }

  // 4. Education
  if (education.length > 0) {
    children.push(createSectionHeader('Education'));

    education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: edu.degree || 'Degree',
              bold: true,
              size: 22,
              color: '0F172A',
              font: 'Calibri'
            }),
            new TextRun({
              text: edu.school ? ` | ${edu.school}` : '',
              italics: true,
              size: 21,
              color: '2563EB',
              font: 'Calibri'
            })
          ]
        })
      );

      const meta = [edu.year, edu.location].filter(Boolean).join(' | ');
      if (meta) {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: meta,
                size: 18,
                color: '64748B',
                font: 'Calibri'
              })
            ]
          })
        );
      }
    });
  }

  // 5. Skills & Competencies
  if (skills.length > 0) {
    children.push(createSectionHeader('Skills & Competencies'));
    children.push(
      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [
          new TextRun({
            text: skills.join('  •  '),
            size: 21,
            color: '334155',
            font: 'Calibri'
          })
        ]
      })
    );
  }

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children
      }
    ]
  });
};

/**
 * Exports resume to a .docx file and triggers a browser download.
 * 
 * @param {Object} answers 
 * @param {Object} generatedContent 
 * @param {string} fileName 
 */
export const exportResumeToDocx = async (answers, generatedContent, fileName = 'Resume.docx') => {
  const doc = buildResumeDocxDocument(answers, generatedContent);

  if (typeof window === 'undefined') {
    return await Packer.toBuffer(doc);
  }

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
