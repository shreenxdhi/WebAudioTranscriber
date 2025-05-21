import { Dispatch, SetStateAction, useRef, DragEvent, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";

interface AudioFileUploadProps {
  selectedFile: File | null;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
}

const AudioFileUpload = ({ selectedFile, setSelectedFile }: AudioFileUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size to human-readable format
  const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes) return "";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `(${bytes.toFixed(1)} ${units[i]})`;
  };

  // Check if file is a valid audio file
  const isAudioFile = (file: File): boolean => {
    return file.type.startsWith("audio/");
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (isAudioFile(file)) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a valid audio file (MP3, WAV, M4A, etc.)",
          variant: "destructive",
        });
        removeFile();
      }
    }
  };

  // Handle drag over
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("border-primary", "bg-blue-50");
  };

  // Handle drag leave
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-primary", "bg-blue-50");
  };

  // Handle drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-primary", "bg-blue-50");

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (isAudioFile(file)) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a valid audio file (MP3, WAV, M4A, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition duration-300 cursor-pointer bg-gray-50"
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*"
          onChange={handleFileChange}
        />
        <span className="material-icons text-4xl text-gray-400 mb-2">cloud_upload</span>
        <p className="text-gray-600 mb-1">
          Drag & drop your audio file here or click to browse
        </p>
        <p className="text-xs text-gray-500">
          Supports MP3, WAV, M4A, and other audio formats
        </p>
      </div>

      {selectedFile && (
        <div className="flex mt-4 items-center p-3 bg-gray-50 rounded-lg">
          <span className="material-icons text-gray-500 mr-2">audiotrack</span>
          <div className="flex-1 truncate">
            <span className="text-sm font-medium text-gray-700">
              {selectedFile.name}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              {formatFileSize(selectedFile.size)}
            </span>
          </div>
          <button
            className="text-gray-500 hover:text-red-500 transition"
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
          >
            <span className="material-icons">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioFileUpload;
