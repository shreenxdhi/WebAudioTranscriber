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
from typing import Dict, List, Any, Tuple

try:
    import whisper
    import torch
    import numpy as np
    from pyannote.audio import Pipeline
    from pydub import AudioSegment
except ImportError as e:
    print(f"Error importing required packages: {e}", file=sys.stderr)
    print("This is a fallback transcription. Required Python packages are not installed.")
    print("Please install: pip install -U openai-whisper pyannote.audio torch numpy pydub")
    sys.exit(1)

# Model constants
WHISPER_MODEL = "base"  # Options: tiny, base, small, medium, large
DIARIZATION_MODEL = "pyannote/speaker-diarization-3.1"

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
    try:
        print("Loading speaker diarization model...", file=sys.stderr)
        pipeline = Pipeline.from_pretrained(DIARIZATION_MODEL)
        
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
        raise

def combine_transcription_with_diarization(whisper_result: Dict[str, Any], diarization_result: Dict[str, List[Dict[str, Any]]]) -> Dict[str, Any]:
    """Combine Whisper transcription with speaker diarization"""
    try:
        # Get segments from both sources
        whisper_segments = whisper_result.get("segments", [])
        diarization_segments = diarization_result.get("segments", [])
        
        # Prepare output structure
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
        raise

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
            
        # Check if file is empty or too small
        file_size = os.path.getsize(audio_path)
        if file_size == 0:
            print(f"Error: File is empty: {audio_path}", file=sys.stderr)
            print("This is a fallback transcription because the audio file is empty.")
            return
        
        print(f"Processing audio file: {audio_path}", file=sys.stderr)
        print(f"File size: {file_size} bytes", file=sys.stderr)
        
        start_time = time.time()
        
        # Step 1: Transcribe with Whisper
        whisper_result = transcribe_with_whisper(audio_path)
        
        # Step 2: Perform speaker diarization
        diarization_result = perform_diarization(audio_path)
        
        # Step 3: Combine results
        combined_result = combine_transcription_with_diarization(whisper_result, diarization_result)
        
        # Calculate processing time
        processing_time = time.time() - start_time
        print(f"Processing completed in {processing_time:.2f} seconds", file=sys.stderr)
        
        # Output the combined result as JSON
        print(json.dumps(combined_result))
        
    except Exception as e:
        print(f"Error processing file {audio_path}: {str(e)}", file=sys.stderr)
        print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
        # Provide a fallback transcript for error cases
        fallback_result = {
            "text": "An error occurred during transcription. This is a fallback transcription message.",
            "segments": [
                {
                    "speaker": "SPEAKER_0",
                    "text": "An error occurred during transcription. This is a fallback transcription message.",
                    "start": 0,
                    "end": 1
                }
            ],
            "speakers": ["SPEAKER_0"]
        }
        print(json.dumps(fallback_result))

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Unexpected error in transcription script: {str(e)}", file=sys.stderr)
        print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
        fallback_result = {
            "text": "An error occurred during transcription. This is a fallback message.",
            "segments": [
                {
                    "speaker": "SPEAKER_0",
                    "text": "An error occurred during transcription. This is a fallback message.",
                    "start": 0,
                    "end": 1
                }
            ],
            "speakers": ["SPEAKER_0"]
        }
        print(json.dumps(fallback_result)) 