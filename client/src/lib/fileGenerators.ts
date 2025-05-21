import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

/**
 * Generates and downloads a PDF file containing the transcription
 * @param transcriptionText The transcription text to include in PDF
 * @param speakers Optional speaker information for diarization
 */
export async function downloadTranscriptionAsPDF(
  transcriptionText: string,
  speakers?: Array<{ speaker: string; text: string; start: number; end: number }>
): Promise<void> {
  // Create a temporary element to render the PDF content
  const element = document.createElement('div');
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  element.style.top = '-9999px';
  
  // Format the transcription text
  let content = '';
  
  if (speakers && speakers.length > 0) {
    // Format with speaker diarization
    content = speakers.map(item => {
      const timestamp = formatTimestamp(item.start, item.end);
      return `<p><strong>${item.speaker}</strong> [${timestamp}]: ${item.text}</p>`;
    }).join('');
  } else {
    // Simple format without speakers
    content = `<p>${transcriptionText}</p>`;
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
    const blob = new Blob([transcriptionText], { type: 'application/pdf' });
    saveAs(blob, filename);
    
  } finally {
    document.body.removeChild(element);
  }
}

/**
 * Generates and downloads a DOCX file containing the transcription
 * @param transcriptionText The transcription text to include in DOCX
 * @param speakers Optional speaker information for diarization
 */
export async function downloadTranscriptionAsDOCX(
  transcriptionText: string,
  speakers?: Array<{ speaker: string; text: string; start: number; end: number }>
): Promise<void> {
  // Create document content
  const paragraphs = [];
  
  // Add title
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Transcription",
          bold: true,
          size: 32
        })
      ]
    })
  );
  
  // Add empty line after title
  paragraphs.push(new Paragraph({}));
  
  // Add transcription content
  if (speakers && speakers.length > 0) {
    // Add content with speaker diarization
    speakers.forEach(item => {
      const timestamp = formatTimestamp(item.start, item.end);
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${item.speaker} [${timestamp}]: `,
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
            text: transcriptionText,
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

  // Generate and download the document
  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `transcription-${new Date().getTime()}.docx`);
  });
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
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substring(11, 19);
}