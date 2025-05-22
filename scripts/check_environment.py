#!/usr/bin/env python3
"""
Environment Check Script for WebAudioTranscriber

This script checks if all required dependencies are installed and properly configured.
"""

import sys
import subprocess
import json
import platform
from typing import Dict, List, Tuple

# Required Python packages with their minimum versions
REQUIRED_PYTHON_PACKAGES = {
    "whisper": "20231117",
    "torch": "2.1.2",
    "torchaudio": "2.1.2",
    "numpy": "1.20.0",
    "pydub": "0.25.1",
    "pyannote.audio": "3.1.1",
    "ffmpeg-python": "0.2.0"
}

# Required system tools
REQUIRED_TOOLS = ["ffmpeg", "python3"]

def check_python_version() -> Tuple[bool, str]:
    """Check if Python version is 3.8 or higher."""
    if sys.version_info >= (3, 8):
        return True, f"Python {platform.python_version()} (OK)"
    return False, f"Python {platform.python_version()} (Python 3.8 or higher required)"

def check_tool_installed(tool: str) -> Tuple[bool, str]:
    """Check if a command-line tool is installed and available in PATH."""
    try:
        result = subprocess.run(
            [tool, "--version"] if tool != "python3" else ["python3", "--version"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        if result.returncode == 0:
            version = result.stdout.strip() if tool != "python3" else f"Python {result.stdout.strip()}"
            return True, f"{tool}: {version} (OK)"
        return False, f"{tool}: Not found"
    except FileNotFoundError:
        return False, f"{tool}: Not found"

def check_python_package(package: str, min_version: str = None) -> Tuple[bool, str]:
    """Check if a Python package is installed and meets the minimum version requirement."""
    try:
        module = __import__(package)
        if min_version:
            version = getattr(module, "__version__", "0.0.0")
            if version < min_version:
                return False, f"{package}: {version} (version {min_version} or higher required)"
        return True, f"{package}: {getattr(module, '__version__', 'unknown version')} (OK)"
    except ImportError:
        return False, f"{package}: Not installed"

def check_cuda_available() -> Tuple[bool, str]:
    """Check if CUDA is available for PyTorch."""
    try:
        import torch
        cuda_available = torch.cuda.is_available()
        if cuda_available:
            return True, f"CUDA: Available (Device: {torch.cuda.get_device_name(0)})"
        return False, "CUDA: Not available (Using CPU)"
    except Exception as e:
        return False, f"CUDA: Error checking availability: {str(e)}"

def check_ffmpeg_codecs() -> Tuple[bool, str]:
    """Check if FFmpeg has the required codecs."""
    try:
        result = subprocess.run(
            ["ffmpeg", "-codecs"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        if result.returncode != 0:
            return False, "FFmpeg codecs: Error checking codecs"
            
        # Check for common audio codecs
        codecs = ["libmp3lame", "aac", "libvorbis", "opus"]
        missing = [codec for codec in codecs if codec not in result.stdout]
        if missing:
            return False, f"FFmpeg missing codecs: {', '.join(missing)}"
        return True, "FFmpeg codecs: All required codecs available"
    except Exception as e:
        return False, f"FFmpeg codecs: Error checking: {str(e)}"

def check_environment() -> Dict[str, List[Tuple[bool, str]]]:
    """Run all environment checks."""
    results = {
        "system": [],
        "python": [],
        "packages": [],
        "tools": []
    }
    
    # System information
    results["system"].append((True, f"OS: {platform.system()} {platform.release()}"))
    results["system"].append((True, f"Architecture: {platform.machine()}"))
    
    # Python version
    python_ok, python_msg = check_python_version()
    results["python"].append((python_ok, python_msg))
    
    # CUDA availability
    cuda_ok, cuda_msg = check_cuda_available()
    results["system"].append((cuda_ok, cuda_msg))
    
    # Check required tools
    for tool in REQUIRED_TOOLS:
        tool_ok, tool_msg = check_tool_installed(tool)
        results["tools"].append((tool_ok, tool_msg))
    
    # Check FFmpeg codecs if FFmpeg is installed
    if any("ffmpeg" in msg.lower() and "not found" not in msg.lower() for _, msg in results["tools"]):
        ffmpeg_codecs_ok, ffmpeg_codecs_msg = check_ffmpeg_codecs()
        results["tools"].append((ffmpeg_codecs_ok, ffmpeg_codecs_msg))
    
    # Check Python packages
    for package, version in REQUIRED_PYTHON_PACKAGES.items():
        pkg_ok, pkg_msg = check_python_package(package, version)
        results["packages"].append((pkg_ok, pkg_msg))
    
    return results

def print_results(results: Dict[str, List[Tuple[bool, str]]]) -> bool:
    """Print the environment check results and return overall status."""
    all_ok = True
    
    print("\n=== Environment Check ===\n")
    
    for category, checks in results.items():
        print(f"=== {category.upper()} ===")
        for ok, msg in checks:
            status = "[PASS]" if ok else "[FAIL]"
            print(f"{status} {msg}")
            if not ok:
                all_ok = False
        print()
    
    if all_ok:
        print("✅ All checks passed! Your environment is ready to run WebAudioTranscriber.")
    else:
        print("❌ Some checks failed. Please address the issues above before running WebAudioTranscriber.")
    
    return all_ok

if __name__ == "__main__":
    results = check_environment()
    status_ok = print_results(results)
    sys.exit(0 if status_ok else 1)
