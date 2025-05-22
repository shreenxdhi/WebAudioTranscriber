#!/usr/bin/env python3
"""
Audio Transcription Script with Speaker Diarization
Developed by Shreenidhi Vasishta

Uses OpenAI's Whisper for transcription and pyannote.audio for speaker diarization
"""

import sys
import os
import json
import time
import tempfile
import traceback
import subprocess
import datetime
from typing import Dict, List, Any, Tuple, Optional

# Try to import required packages with better error handling
REQUIRED_PACKAGES = [
    "whisper",
    "torch",
    "torchaudio",
    "numpy",
    "pydub",
    "pyannote.audio"
]

missing_packages = []
for package in REQUIRED_PACKAGES:
    try:
        __import__(package)
    except ImportError:
        missing_packages.append(package)

if missing_packages:
    print(json.dumps({
        "text": "Server error: Required Python packages are not installed.",
        "error": f"Missing packages: {', '.join(missing_packages)}",
        "instructions": "Please install the required packages using: pip install -r requirements.txt"
    }), file=sys.stderr)
    sys.exit(1)

# Now safely import the packages
import whisper
import torch
import numpy as np
from pydub import AudioSegment

# Try to import pyannote.audio with a fallback
try:
    from pyannote.audio import Pipeline
    DIARIZATION_AVAILABLE = True
except ImportError:
    DIARIZATION_AVAILABLE = False
    print("Warning: pyannote.audio not available, speaker diarization will be disabled", file=sys.stderr)

# Model constants
WHISPER_MODEL = "base"  # Options: tiny, base, small, medium, large
DIARIZATION_MODEL = "pyannote/speaker-diarization"
# Using environment variable for the token
HF_TOKEN = os.environ.get("HF_TOKEN")  # Get from environment variable

def format_timestamp(seconds: float) -> str:
    """Convert seconds to formatted timestamp"""
    return str(datetime.timedelta(seconds=int(seconds)))

def load_audio(audio_path: str) -> Tuple[np.ndarray, int]:
    """Load audio file using pydub and convert to format Whisper expects"""
    try:
        print(f"Loading audio from: {audio_path}", file=sys.stderr)
        # Use pydub to handle different audio formats
        audio = AudioSegment.from_file(audio_path)
        
        # Convert to mono and set sample rate to 16kHz for Whisper
        audio = audio.set_channels(1)
        audio = audio.set_frame_rate(16000)
        
        # Convert to numpy array
        samples = np.array(audio.get_array_of_samples(), dtype=np.float32)
        samples = samples / (1 << (8 * audio.sample_width - 1))  # Normalize
        
        return samples, audio.frame_rate
    except Exception as e:
        print(f"Error loading audio: {e}", file=sys.stderr)
        raise

def transcribe_with_whisper(audio_path: str) -> Dict[str, Any]:
    """Transcribe audio using OpenAI's Whisper"""
    try:
        print(f"Loading Whisper model: {WHISPER_MODEL}", file=sys.stderr)
        model = whisper.load_model(WHISPER_MODEL)
        
        print("Transcribing with Whisper...", file=sys.stderr)
        # Use word_timestamps=False as per user's script
        result = model.transcribe(audio_path, language="en", word_timestamps=False)
        
        print("Transcription complete", file=sys.stderr)
        return result
    except Exception as e:
        print(f"Error in Whisper transcription: {e}", file=sys.stderr)
        raise

def perform_diarization(audio_path: str) -> Any:
    """Perform speaker diarization using pyannote.audio"""
    if not DIARIZATION_AVAILABLE:
        print("Speaker diarization is not available. Missing pyannote.audio.", file=sys.stderr)
        return None
    
    if not HF_TOKEN:
        print("Speaker diarization is not available. Missing Hugging Face token.", file=sys.stderr)
        return None
    
    try:
        print("Loading speaker diarization model...", file=sys.stderr)
        # Use the token for authenticating with Hugging Face Hub
        pipeline = Pipeline.from_pretrained(
            DIARIZATION_MODEL,
            use_auth_token=HF_TOKEN
        )
        
        print("Performing speaker diarization...", file=sys.stderr)
        diarization = pipeline(audio_path)
        print("Diarization complete", file=sys.stderr)
        return diarization
    except Exception as e:
        print(f"Error in speaker diarization: {e}", file=sys.stderr)
        print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
        # Return None as fallback
        return None

def combine_transcription_with_diarization(whisper_result: Dict[str, Any], diarization) -> Dict[str, Any]:
    """Combine Whisper transcription with speaker diarization using the user's approach"""
    try:
        # If no diarization result, create simple output with a single speaker
        if diarization is None:
            print("No speaker diarization data available, using fallback with single speaker", file=sys.stderr)
            output_segments = []
            for segment in whisper_result.get("segments", []):
                output_segments.append({
                    "speaker": "SPEAKER_0",
                    "text": segment["text"].strip(),
                    "start": segment["start"],
                    "end": segment["end"]
                })
            
            return {
                "text": whisper_result.get("text", ""),
                "segments": output_segments,
                "speakers": ["SPEAKER_0"]
            }
        
        # Combine Whisper and diarization using user's approach
        final_output = []
        unique_speakers = set()
        
        for segment in whisper_result["segments"]:
            segment_start = segment["start"]
            segment_end = segment["end"]
            text = segment["text"].strip()
            
            # Find which speaker is speaking during this segment
            speaker_found = False
            for turn, _, speaker in diarization.itertracks(yield_label=True):
                # If overlap between whisper segment and diarized turn
                if turn.end < segment_start or turn.start > segment_end:
                    continue
                
                unique_speakers.add(speaker)
                final_output.append({
                    "speaker": speaker,
                    "text": text,
                    "start": segment_start,
                    "end": segment_end
                })
                speaker_found = True
                break  # Take only first matching speaker
            
            # If no speaker found for this segment, assign unknown speaker
            if not speaker_found:
                final_output.append({
                    "speaker": "SPEAKER_UNKNOWN",
                    "text": text,
                    "start": segment_start,
                    "end": segment_end
                })
                unique_speakers.add("SPEAKER_UNKNOWN")
        
        # Prepare the full transcript
        full_text = whisper_result.get("text", "")
        
        # Print nicely for debugging
        print("Final transcript with speakers:", file=sys.stderr)
        for entry in final_output:
            formatted_start = format_timestamp(entry["start"])
            formatted_end = format_timestamp(entry["end"])
            print(f"{entry['speaker']} [{formatted_start} - {formatted_end}]: {entry['text']}", file=sys.stderr)
        
        return {
            "text": full_text,
            "segments": final_output,
            "speakers": list(unique_speakers)
        }
    except Exception as e:
        print(f"Error combining transcription with diarization: {e}", file=sys.stderr)
        print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
        # Return simple output as fallback
        return {
            "text": whisper_result.get("text", ""),
            "error": f"Failed to combine transcription with diarization: {str(e)}"
        }

def process_url(url: str) -> Dict[str, Any]:
    """Process audio from a URL"""
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_file:
            temp_path = temp_file.name
        
        # Download the file
        print(f"Downloading audio from URL: {url}", file=sys.stderr)
        command = ["curl", "-L", "--max-time", "30", "-o", temp_path, url]
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            raise Exception(f"Failed to download URL: {stderr.decode()}")
        
        # Process the downloaded file
        result = process_audio_file(temp_path)
        
        # Clean up
        try:
            os.unlink(temp_path)
        except:
            pass
        
        return result
    except Exception as e:
        print(f"Error processing URL: {e}", file=sys.stderr)
        return {"text": "", "error": str(e)}

def process_audio_file(file_path: str) -> Dict[str, Any]:
    """Process an audio file for transcription and diarization"""
    try:
        start_time = time.time()
        
        # Transcribe with Whisper
        whisper_result = transcribe_with_whisper(file_path)
        
        # Perform diarization
        diarization_result = perform_diarization(file_path)
        
        # Combine results
        result = combine_transcription_with_diarization(whisper_result, diarization_result)
        
        # Calculate processing time
        processing_time = time.time() - start_time
        print(f"Total processing time: {processing_time:.2f} seconds", file=sys.stderr)
        
        return result
    except Exception as e:
        print(f"Error processing audio file: {e}", file=sys.stderr)
        return {"text": "", "error": str(e)}

def main():
    """Main function to handle command-line arguments and process audio"""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input file or URL specified"}))
        sys.exit(1)
    
    # Check for --url flag
    if sys.argv[1] == "--url" and len(sys.argv) >= 3:
        url = sys.argv[2]
        result = process_url(url)
    else:
        file_path = sys.argv[1]
        result = process_audio_file(file_path)
    
    # Print the result as JSON
    print(json.dumps(result))

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(json.dumps({
            "text": "",
            "error": f"Unexpected error: {str(e)}",
            "traceback": traceback.format_exc()
        }))
        sys.exit(1) 