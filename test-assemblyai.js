const { AssemblyAI } = require('assemblyai');

// Get API key from environment variable
const apiKey = process.env.ASSEMBLYAI_API_KEY;

if (!apiKey) {
  console.error('Please set ASSEMBLYAI_API_KEY environment variable');
  process.exit(1);
}

// Test AssemblyAI transcription
async function testTranscription() {
  try {
    // Initialize AssemblyAI client
    const client = new AssemblyAI({ apiKey });
    
    // URL to transcribe
    const audioUrl = 'https://storage.googleapis.com/aai-web-samples/news.mp3';
    
    console.log('Starting transcription...');
    
    // Start transcription
    const transcript = await client.transcripts.transcribe({
      audio: audioUrl,
    });
    
    console.log('Transcription completed successfully!');
    console.log('Transcript:', transcript.text);
    
  } catch (error) {
    console.error('Transcription failed:', error);
  }
}

// Run the test
testTranscription();