import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Interface for transcription result
export const TranscriptionResult = {};

/**
 * Format the transcription results for the frontend
 */
export function formatTranscriptionResult(result) {
  // If there are no segments, return a simplified format
  if (!result.segments || result.segments.length === 0) {
    return {
      utterances: [],
      speaker_labels: false,
      speakers: []
    };
  }

  // Group segments by speaker
  const utterances = result.segments.map(segment => ({
    speaker: segment.speaker,
    text: segment.text,
    start: segment.start,
    end: segment.end
  }));

  // Extract unique speakers
  const speakers = [...new Set(result.segments.map(segment => segment.speaker))];

  return {
    utterances,
    speaker_labels: true,
    speakers
  };
}

/**
 * Transcribe audio using the Python script
 */
export async function transcribeAudio(audioPath) {
  return new Promise((resolve) => {
    console.log(`Processing transcription for: ${audioPath}`);
    
    try {
      // Get path to the Python script
      const scriptPath = path.resolve(process.cwd(), 'server/transcribe_audio.py');
      
      // Check if Python script exists
      if (!fs.existsSync(scriptPath)) {
        console.error(`Transcription script not found at: ${scriptPath}`);
        return resolve({
          text: "Transcription script not found.",
          error: "Script not found"
        });
      }
      
      // Make the script executable
      try {
        execAsync(`chmod +x "${scriptPath}"`);
      } catch (error) {
        console.warn(`Failed to chmod script: ${error?.message || error}, continuing anyway`);
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
            text: "An error occurred in the transcription process.",
            error: `Python process exited with code ${code}`
          });
        }
        
        try {
          // Parse JSON output from the Python script
          const result = JSON.parse(outputData);
          console.log("Transcription result received successfully");
          resolve(result);
        } catch (error) {
          console.error(`Failed to parse Python script output: ${error?.message || error}`);
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
              text: "Failed to parse transcription result.",
              error: "Invalid output format"
            });
          }
        }
      });
      
      // Handle process errors
      pythonProcess.on('error', (err) => {
        console.error(`Failed to start Python process: ${err.message}`);
        resolve({
          text: "Failed to start transcription process.",
          error: err.message
        });
      });
      
      // Set a timeout in case the process hangs
      const timeout = setTimeout(() => {
        pythonProcess.kill();
        console.error("Transcription process timed out");
        resolve({
          text: "Transcription process timed out.",
          error: "Process timeout"
        });
      }, 5 * 60 * 1000); // 5 minute timeout
      
      // Clear the timeout if the process completes
      pythonProcess.on('close', () => {
        clearTimeout(timeout);
      });
      
    } catch (error) {
      console.error('Error in transcription process:', error);
      resolve({ 
        text: "An unexpected error occurred during transcription.", 
        error: error?.message || "Unknown error" 
      });
    }
  });
}

// Process an audio URL
export async function transcribeFromUrl(url) {
  try {
    console.log(`Transcribing from URL: ${url}`);
    
    // Get path to the Python script
    const scriptPath = path.resolve(process.cwd(), 'server/transcribe_audio.py');
    
    // Check if Python script exists
    if (!fs.existsSync(scriptPath)) {
      console.error(`Transcription script not found at: ${scriptPath}`);
      return {
        text: "Transcription script not found.",
        error: "Script not found"
      };
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
            text: "An error occurred in the transcription process.",
            error: `Python process exited with code ${code}`
          });
        }
        
        try {
          // Parse JSON output from the Python script
          const result = JSON.parse(outputData);
          console.log("Transcription result received successfully");
          resolve(result);
        } catch (error) {
          console.error(`Failed to parse Python script output: ${error?.message || error}`);
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
              text: "Failed to parse transcription result.",
              error: "Invalid output format"
            });
          }
        }
      });
      
      // Handle process errors
      pythonProcess.on('error', (err) => {
        console.error(`Failed to start Python process: ${err.message}`);
        resolve({
          text: "Failed to start transcription process.",
          error: err.message
        });
      });
      
      // Set a timeout in case the process hangs
      const timeout = setTimeout(() => {
        pythonProcess.kill();
        console.error("Transcription process timed out");
        resolve({
          text: "Transcription process timed out.",
          error: "Process timeout"
        });
      }, 5 * 60 * 1000); // 5 minute timeout
      
      // Clear the timeout if the process completes
      pythonProcess.on('close', () => {
        clearTimeout(timeout);
      });
    });
  } catch (error) {
    console.error('Error transcribing from URL:', error);
    return { 
      text: "Failed to process the audio URL", 
      error: error?.message || "Unknown error"
    };
  }
}

// Process an uploaded file
export async function transcribeFromFile(file) {
  try {
    console.log(`Transcribing from file: ${file.originalname}`);
    return transcribeAudio(file.path);
  } catch (error) {
    console.error('Error transcribing file:', error);
    return { 
      text: "Failed to process the uploaded file", 
      error: error?.message || "Unknown error"
    };
  }
} 