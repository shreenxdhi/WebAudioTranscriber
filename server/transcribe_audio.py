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
DIARIZATION_MODEL = "pyannote/speaker-diarization-3.1"
# Using environment variable for the token or empty string if not set
HF_TOKEN = os.environ.get("HF_TOKEN", "")  # Get from environment variable

def format_timestamp(seconds: float) -> str:
    """Convert seconds to formatted timestamp"""
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    return f"{int(hours):02d}:{int(minutes):02d}:{seconds:06.3f}"

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
        result = model.transcribe(audio_path, language="en")
        
        print("Transcription complete", file=sys.stderr)
        return result
    except Exception as e:
        print(f"Error in Whisper transcription: {e}", file=sys.stderr)
        raise

def perform_diarization(audio_path: str) -> Dict[str, List[Dict[str, Any]]]:
    """Perform speaker diarization using pyannote.audio"""
    if not DIARIZATION_AVAILABLE or not HF_TOKEN:
        print("Speaker diarization is not available. Missing pyannote.audio or HF_TOKEN.", file=sys.stderr)
        return {"segments": []}
    
    try:
        print("Loading speaker diarization model...", file=sys.stderr)
        # Use the token for authenticating with Hugging Face Hub
        pipeline = Pipeline.from_pretrained(DIARIZATION_MODEL, use_auth_token=HF_TOKEN)
        
        print("Performing speaker diarization...", file=sys.stderr)
        diarization = pipeline(audio_path)
        
        # Extract speaker segments
        speakers = {}
        for turn, _, speaker in diarization.itertracks(yield_label=True):
            if speaker not in speakers:
                speakers[speaker] = []
                
            speakers[speaker].append({
                "start": turn.start,
                "end": turn.end,
                "speaker": speaker
            })
        
        # Merge segments that are close to each other (within 0.5s)
        for speaker in speakers:
            segments = speakers[speaker]
            merged_segments = []
            
            for segment in segments:
                if not merged_segments or segment["start"] - merged_segments[-1]["end"] > 0.5:
                    merged_segments.append(segment)
                else:
                    merged_segments[-1]["end"] = segment["end"]
            
            speakers[speaker] = merged_segments
        
        # Flatten segments
        all_segments = []
        for speaker, segments in speakers.items():
            all_segments.extend(segments)
        
        # Sort by start time
        all_segments.sort(key=lambda x: x["start"])
        
        return {"segments": all_segments}
    except Exception as e:
        print(f"Error in speaker diarization: {e}", file=sys.stderr)
        print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
        # Return empty segments as fallback
        return {"segments": []}

def combine_transcription_with_diarization(whisper_result: Dict[str, Any], diarization_result: Dict[str, List[Dict[str, Any]]]) -> Dict[str, Any]:
    """Combine Whisper transcription with speaker diarization"""
    try:
        # Get segments from both sources
        whisper_segments = whisper_result.get("segments", [])
        diarization_segments = diarization_result.get("segments", [])
        
        # If no diarization segments, create simple output with a single speaker
        if not diarization_segments:
            print("No speaker diarization data available, using fallback with single speaker", file=sys.stderr)
            output_segments = []
            for segment in whisper_segments:
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
        
        # Prepare output structure for normal diarization
        output_segments = []
        
        # Assign speakers to transcription segments based on overlap
        for segment in whisper_segments:
            start = segment["start"]
            end = segment["end"]
            text = segment["text"].strip()
            
            # Find the speaker with the most overlap
            max_overlap = 0
            assigned_speaker = "SPEAKER_UNKNOWN"
            
            for speaker_segment in diarization_segments:
                # Calculate overlap
                overlap_start = max(start, speaker_segment["start"])
                overlap_end = min(end, speaker_segment["end"])
                overlap = max(0, overlap_end - overlap_start)
                
                if overlap > max_overlap:
                    max_overlap = overlap
                    assigned_speaker = speaker_segment["speaker"]
            
            # Create output segment
            output_segments.append({
                "speaker": assigned_speaker,
                "text": text,
                "start": start,
                "end": end
            })
        
        # Group by speaker and text for cleaner output
        grouped_segments = []
        current_segment = None
        
        for segment in output_segments:
            if current_segment is None or current_segment["speaker"] != segment["speaker"]:
                if current_segment is not None:
                    grouped_segments.append(current_segment)
                current_segment = segment.copy()
            else:
                # Same speaker, append text and update end time
                current_segment["text"] += " " + segment["text"]
                current_segment["end"] = segment["end"]
        
        if current_segment is not None:
            grouped_segments.append(current_segment)
        
        # Map speaker IDs to sequential numbers (SPEAKER_0, SPEAKER_1, etc.)
        speakers = {}
        for i, segment in enumerate(grouped_segments):
            if segment["speaker"] not in speakers:
                speakers[segment["speaker"]] = f"SPEAKER_{len(speakers)}"
            segment["speaker"] = speakers[segment["speaker"]]
        
        return {
            "text": whisper_result.get("text", ""),
            "segments": grouped_segments,
            "speakers": list(speakers.values())
        }
    except Exception as e:
        print(f"Error combining results: {e}", file=sys.stderr)
        # Provide a simple fallback with the full transcript and one speaker
        return {
            "text": whisper_result.get("text", ""),
            "segments": [{
                "speaker": "SPEAKER_0",
                "text": whisper_result.get("text", ""),
                "start": 0,
                "end": whisper_result.get("segments", [{}])[-1].get("end", 1) if whisper_result.get("segments") else 1
            }],
            "speakers": ["SPEAKER_0"]
        }

def main():
    print("Transcription script started!", file=sys.stderr)
    
    if len(sys.argv) < 2:
        print("Error: Please provide an audio file path", file=sys.stderr)
        print("This is a fallback transcription because no audio file path was provided.")
        return
    
    audio_path = sys.argv[1]
    print(f"Received audio path: {audio_path}", file=sys.stderr)
    
    try:
        # Verify the file exists and has proper permissions
        if not os.path.exists(audio_path):
            print(f"Error: File not found: {audio_path}", file=sys.stderr)
            print("This is a fallback transcription because the audio file could not be found.")
            return
            
        if not os.access(audio_path, os.R_OK):
            print(f"Error: No read permissions for file: {audio_path}", file=sys.stderr)
            print("This is a fallback transcription because the audio file could not be read due to permission issues.")
            return
        
        # Check file size
        file_size_mb = os.path.getsize(audio_path) / (1024 * 1024)
        if file_size_mb > 50:  # 50MB limit
            error_msg = {
                "text": "Error: Audio file is too large. Maximum size is 50MB.",
                "error": "File too large"
            }
            print(json.dumps(error_msg), file=sys.stderr)
            sys.exit(1)
        
        # Transcribe the audio
        whisper_result = transcribe_with_whisper(audio_path)
        
        # Only perform diarization if we have a valid transcription
        if not whisper_result or "text" not in whisper_result or not whisper_result["text"].strip():
            error_msg = {
                "text": "Error: Failed to transcribe audio. The audio might be too short, silent, or in an unsupported format.",
                "error": "Transcription failed"
            }
            print(json.dumps(error_msg), file=sys.stderr)
            sys.exit(1)
        
        # Perform speaker diarization if available
        diarization_result = perform_diarization(audio_path)
        
        # Combine the results
        combined_result = combine_transcription_with_diarization(whisper_result, diarization_result)
        
        # Add metadata
        combined_result["metadata"] = {
            "model": WHISPER_MODEL,
            "language": "en",
            "diarization_available": DIARIZATION_AVAILABLE and bool(HF_TOKEN)
        }
        
        # Output the result as JSON
        print(json.dumps(combined_result, ensure_ascii=False))
        
    except Exception as e:
        error_msg = {
            "text": f"An error occurred during transcription: {str(e)}",
            "error": str(e),
            "traceback": traceback.format_exc()
        }
        print(json.dumps(error_msg), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main() 