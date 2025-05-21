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

  // Improve file validation and add better error handling for the file upload component
  const validateFile = (file: File): boolean => {
    // Check file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 50MB",
        variant: "destructive",
      });
      return false;
    }

    // Check if file is an audio file
    if (!file.type.startsWith("audio/") && 
        !file.name.endsWith(".mp3") && 
        !file.name.endsWith(".wav") && 
        !file.name.endsWith(".m4a") && 
        !file.name.endsWith(".ogg")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3, WAV, M4A, OGG)",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        toast({
          title: "File accepted",
          description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
        });
      }
    }
  };

  // Handle drag over
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("border-primary", "bg-primary/5");
  };

  // Handle drag leave
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-primary", "bg-primary/5");
  };

  // Add enhanced file drop handling
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-primary", "bg-primary/5");
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        toast({
          title: "File accepted",
          description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
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
    <div className="px-1">
      <div
        className="border-2 border-dashed border-border rounded-lg p-4 sm:p-8 text-center hover:border-primary transition duration-300 cursor-pointer bg-card/50 min-h-[120px] flex flex-col items-center justify-center"
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*"
          onChange={handleFileChange}
        />
        <span className="material-icons text-3xl sm:text-4xl text-muted-foreground mb-2">cloud_upload</span>
        <p className="text-sm sm:text-base text-foreground mb-1">
          Drag & drop your audio file here or tap to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Supports MP3, WAV, M4A, and other audio formats
        </p>
      </div>

      {selectedFile && (
        <div className="flex mt-4 items-center p-3 sm:p-4 bg-card/50 rounded-lg border border-border">
          <span className="material-icons text-muted-foreground mr-2">audiotrack</span>
          <div className="flex-1 truncate">
            <span className="text-sm font-medium text-foreground">
              {selectedFile.name}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {formatFileSize(selectedFile.size)}
            </span>
          </div>
          <button
            className="text-muted-foreground hover:text-red-500 transition p-2 -mr-1"
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
            aria-label="Remove file"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioFileUpload;
