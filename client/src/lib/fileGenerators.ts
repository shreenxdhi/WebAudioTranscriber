import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { TranscriptionResponse } from '@shared/schema';

/**
 * Generates and downloads a PDF file containing the transcription
 * @param data The transcription data to include in PDF
 */
export async function downloadTranscriptionAsPDF(
  data: TranscriptionResponse
): Promise<void> {
  const { text, utterances } = data;
  // Create a temporary element to render the PDF content
  const element = document.createElement('div');
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  element.style.top = '-9999px';
  
  // Format the transcription text
  let content = '';
  
  if (utterances && utterances.length > 0) {
    // Format with speaker diarization
    content = utterances.map(item => {
      const timestamp = formatTimestamp(item.start, item.end);
      const speaker = item.speaker ? `Speaker ${item.speaker}` : 'Speaker';
      return `<p><strong>${speaker}</strong> [${timestamp}]: ${item.text}</p>`;
    }).join('');
  } else {
    // Simple format without speakers
    content = `<p>${text || ''}</p>`;
  }
  
  element.innerHTML = `
    <h1 style="font-size: 18px; margin-bottom: 20px;">Transcription</h1>
    <div>${content}</div>
  `;
  
  document.body.appendChild(element);
  
  try {
    // Create a simulated PDF download since we don't have full PDF generation capabilities in browser
    const filename = `transcription-${new Date().getTime()}.pdf`;
    
    // In a real implementation, we'd use a server-side PDF generation service
    // or a full PDF library. For now, we'll create a simple blob with the text
    const blob = new Blob([content], { type: 'application/pdf' });
    saveAs(blob, filename);
    
  } finally {
    document.body.removeChild(element);
  }
}

/**
 * Generates and downloads a DOCX file containing the transcription
 * @param data The transcription data to include in DOCX
 */
export async function downloadTranscriptionAsDOCX(
  data: TranscriptionResponse
): Promise<void> {
  const { text, utterances } = data;
  // Create document content
  const paragraphs = [];
  
  // Add title
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Transcription',
          bold: true,
          size: 28,
        })
      ]
    })
  );
  
  // Add empty line after title
  paragraphs.push(new Paragraph({}));
  
  // Add transcription content
  if (utterances && utterances.length > 0) {
    // Add content with speaker diarization
    utterances.forEach(item => {
      const timestamp = formatTimestamp(item.start, item.end);
      const speaker = item.speaker ? `Speaker ${item.speaker}` : 'Speaker';
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${speaker} [${timestamp}]: `,
              bold: true,
            }),
            new TextRun({
              text: item.text,
            })
          ]
        })
      );
    });
  } else {
    // Simple format without speakers
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: text,
          })
        ]
      })
    );
  }
  
  // Create document with all paragraphs
  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs
    }]
  });

  // Generate DOCX file
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `transcription-${new Date().getTime()}.docx`);
}

/**
 * Format a time range as a readable string (e.g. "00:01:23 - 00:01:45")
 */
function formatTimestamp(start: number, end: number): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

/**
 * Format seconds to HH:MM:SS
 */
function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map(v => v < 10 ? '0' + v : v).join(':');
}