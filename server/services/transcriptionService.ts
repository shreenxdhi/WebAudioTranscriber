import fs from 'fs';
import path from 'path';
import { spawn, execSync } from 'child_process';
import { Request, Response } from 'express';
import * as os from 'os';

// Interface for transcription result
export interface TranscriptionResult {
  text: string;
  segments?: Array<{
    speaker: string;
    text: string;
    start: number;
    end: number;
  }>;
  speakers?: string[];
  error?: string;
}

// Helper to format timestamps
function formatTimestamp(seconds: number): string {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substring(11, 19);
}

// Main transcription function using our custom Python script
export async function transcribeAudio(audioPath: string): Promise<TranscriptionResult> {
  return new Promise((resolve, reject) => {
    console.log(`Processing transcription for: ${audioPath}`);
    
    try {
      // Get path to the Python script
      const scriptPath = path.resolve(process.cwd(), 'server/transcribe_audio.py');
      
      // Check if Python script exists
      if (!fs.existsSync(scriptPath)) {
        console.error(`Transcription script not found at: ${scriptPath}`);
        return resolve({
          text: "Transcription script not found. This is a fallback response.",
          error: "Script not found"
        });
      }
      
      // Make the script executable
      try {
        execSync(`chmod +x "${scriptPath}"`);
      } catch (error: any) {
        console.warn(`Failed to chmod script: ${error.message}, continuing anyway`);
      }
      
      // Prepare to run the Python script
      const pythonProcess = spawn('python3', [scriptPath, audioPath]);
      
      let outputData = '';
      let errorData = '';
      
      // Collect standard output
      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });
      
      // Collect error output
      pythonProcess.stderr.on('data', (data) => {
        console.log(`Python script log: ${data.toString()}`);
        errorData += data.toString();
      });
      
      // Handle process completion
      pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
        
        if (code !== 0) {
          console.error(`Python script error: ${errorData}`);
          // Provide a fallback response if the script failed
          return resolve({
            text: "An error occurred in the transcription process. This is a fallback response.",
            error: `Python process exited with code ${code}`
          });
        }
        
        try {
          // Parse JSON output from the Python script
          const result = JSON.parse(outputData);
          console.log("Transcription result received successfully");
          resolve(result);
        } catch (error: any) {
          console.error(`Failed to parse Python script output: ${error.message}`);
          console.error(`Raw output: ${outputData}`);
          
          // Handle case where output isn't valid JSON
          if (outputData.trim()) {
            // If there's some text output, use it as plain text
            resolve({
              text: outputData.trim()
            });
          } else {
            // No usable output
            resolve({
              text: "Failed to parse transcription result. This is a fallback response.",
              error: "Invalid output format"
            });
          }
        }
      });
      
      // Handle process errors
      pythonProcess.on('error', (err) => {
        console.error(`Failed to start Python process: ${err.message}`);
        resolve({
          text: "Failed to start transcription process. This is a fallback response.",
          error: err.message
        });
      });
      
      // Set a timeout in case the process hangs
      const timeout = setTimeout(() => {
        pythonProcess.kill();
        console.error("Transcription process timed out");
        resolve({
          text: "Transcription process timed out. This is a fallback response.",
          error: "Process timeout"
        });
      }, 3 * 60 * 1000); // 3 minute timeout
      
      // Clear the timeout if the process completes
      pythonProcess.on('close', () => {
        clearTimeout(timeout);
      });
      
    } catch (error: any) {
      console.error('Error in transcription process:', error);
      resolve({ 
        text: "An unexpected error occurred during transcription. This is a fallback response.", 
        error: error.message || "Unknown error" 
      });
    }
  });
}

// Process an audio URL
export async function transcribeFromUrl(url: string): Promise<TranscriptionResult> {
  try {
    console.log(`Transcribing from URL: ${url}`);
    
    // Get path to the Python script
    const scriptPath = path.resolve(process.cwd(), 'server/transcribe_audio.py');
    
    // Check if Python script exists
    if (!fs.existsSync(scriptPath)) {
      console.error(`Transcription script not found at: ${scriptPath}`);
      return {
        text: "Transcription script not found. This is a fallback response.",
        error: "Script not found"
      };
    }
    
    // Make the script executable
    try {
      execSync(`chmod +x "${scriptPath}"`);
    } catch (error: any) {
      console.warn(`Failed to chmod script: ${error.message}, continuing anyway`);
    }
    
    // Prepare to run the Python script with URL parameter
    const pythonProcess = spawn('python3', [scriptPath, '--url', url]);
    
    let outputData = '';
    let errorData = '';
    
    // Collect standard output
    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });
    
    // Collect error output
    pythonProcess.stderr.on('data', (data) => {
      console.log(`Python script log: ${data.toString()}`);
      errorData += data.toString();
    });
    
    // Handle process completion
    return new Promise((resolve) => {
      pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
        
        if (code !== 0) {
          console.error(`Python script error: ${errorData}`);
          // Provide a fallback response if the script failed
          return resolve({
            text: "An error occurred in the transcription process. This is a fallback response.",
            error: `Python process exited with code ${code}`
          });
        }
        
        try {
          // Parse JSON output from the Python script
          const result = JSON.parse(outputData);
          console.log("Transcription result received successfully");
          resolve(result);
        } catch (error: any) {
          console.error(`Failed to parse Python script output: ${error.message}`);
          console.error(`Raw output: ${outputData}`);
          
          // Handle case where output isn't valid JSON
          if (outputData.trim()) {
            // If there's some text output, use it as plain text
            resolve({
              text: outputData.trim()
            });
          } else {
            // No usable output
            resolve({
              text: "Failed to parse transcription result. This is a fallback response.",
              error: "Invalid output format"
            });
          }
        }
      });
      
      // Handle process errors
      pythonProcess.on('error', (err) => {
        console.error(`Failed to start Python process: ${err.message}`);
        resolve({
          text: "Failed to start transcription process. This is a fallback response.",
          error: err.message
        });
      });
      
      // Set a timeout in case the process hangs
      const timeout = setTimeout(() => {
        pythonProcess.kill();
        console.error("Transcription process timed out");
        resolve({
          text: "Transcription process timed out. This is a fallback response.",
          error: "Process timeout"
        });
      }, 5 * 60 * 1000); // 5 minute timeout
      
      // Clear the timeout if the process completes
      pythonProcess.on('close', () => {
        clearTimeout(timeout);
      });
    });
  } catch (error: any) {
    console.error('Error transcribing from URL:', error);
    return { 
      text: "", 
      error: "Failed to process the audio URL"
    };
  }
}

// Process an uploaded file
export async function transcribeFromFile(file: any): Promise<TranscriptionResult> {
  try {
    console.log(`Transcribing from file: ${file.originalname}`);
    return transcribeAudio(file.path);
  } catch (error) {
    console.error('Error transcribing file:', error);
    return { 
      text: "", 
      error: "Failed to process the uploaded file"
    };
  }
}

// Format the transcription result for the frontend
export function formatTranscriptionResult(result: TranscriptionResult): any {
  // If there was an error, return it
  if (result.error) {
    return {
      status: "error",
      error: result.error
    };
  }
  
  // Format the result in the expected structure
  const formattedOutput = {
    id: `transcript-${Date.now()}`,
    text: result.text,
    status: "completed",
    audio_url: "",
    language_code: "en",
    confidence: 0.95,
    words: [] as any[],
    utterances: [] as any[],
    speaker_labels: result.segments && result.segments.length > 0
  };
  
  // Add speaker segments if available
  if (result.segments && result.segments.length > 0) {
    formattedOutput.utterances = result.segments.map(segment => {
      return {
        speaker: segment.speaker,
        text: segment.text,
        start: segment.start,
        end: segment.end,
        confidence: 0.9
      };
    });
  }
  
  return formattedOutput;
}