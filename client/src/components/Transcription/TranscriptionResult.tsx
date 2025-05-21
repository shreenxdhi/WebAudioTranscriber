import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TranscriptionResponse } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { downloadTranscriptionAsPDF, downloadTranscriptionAsDOCX } from "@/lib/fileGenerators";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TranscriptionResultProps {
  status: "idle" | "loading" | "success" | "error";
  data: TranscriptionResponse | null;
  errorMessage: string;
  resetTranscription: () => void;
}

const TranscriptionResult = ({
  status,
  data,
  errorMessage,
  resetTranscription,
}: TranscriptionResultProps) => {
  const { toast } = useToast();
  const [copyButtonText, setCopyButtonText] = useState("Copy Text");

  // Format audio duration from seconds to MM:SS
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Copy transcription text to clipboard
  const copyToClipboard = async () => {
    if (!data?.text) return;

    try {
      await navigator.clipboard.writeText(data.text);
      setCopyButtonText("Copied!");
      toast({
        title: "Copied to clipboard",
        description: "The transcription has been copied to your clipboard",
      });
      
      // Reset the button text after 2 seconds
      setTimeout(() => {
        setCopyButtonText("Copy Text");
      }, 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Initial State */}
      {status === "idle" && (
        <div className="py-6 sm:py-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted mb-3 sm:mb-4">
            <span className="material-icons text-xl sm:text-2xl text-muted-foreground">record_voice_over</span>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-card-foreground">No transcription yet</h3>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Upload or provide a URL to an audio file to get started
          </p>
        </div>
      )}

      {/* Loading State */}
      {status === "loading" && (
        <div className="py-8 sm:py-10 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-muted border-t-primary mb-3 sm:mb-4"></div>
          <h3 className="text-base sm:text-lg font-medium text-card-foreground">Transcribing your audio</h3>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            This may take a few moments depending on the file size
          </p>
          <div className="w-full max-w-md mx-auto mt-4 bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-3/4"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="py-6 sm:py-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-100 dark:bg-red-900 mb-3 sm:mb-4">
            <span className="material-icons text-xl sm:text-2xl text-red-500 dark:text-red-400">error_outline</span>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-card-foreground">Transcription failed</h3>
          <p className="text-red-500 dark:text-red-400 text-xs sm:text-sm mt-1 px-4">{errorMessage || "Unable to process the audio file. Please try again."}</p>
          <Button 
            variant="outline"
            className="mt-4 px-4 py-2 h-10"
            onClick={resetTranscription}
          >
            Try again
          </Button>
        </div>
      )}

      {/* Success State */}
      {status === "success" && data && (
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h3 className="text-base sm:text-lg font-medium text-card-foreground">Transcription Results</h3>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 h-9">
                    <span className="material-icons text-base">file_download</span>
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => downloadTranscriptionAsPDF(data.text)}>
                    PDF Document
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadTranscriptionAsDOCX(data.text)}>
                    Word Document (DOCX)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <button
                className="text-primary hover:text-primary/80 font-medium text-sm inline-flex items-center h-9 px-2"
                onClick={copyToClipboard}
              >
                <span className="material-icons mr-1 text-base">
                  {copyButtonText === "Copied!" ? "check" : "content_copy"}
                </span>
                {copyButtonText}
              </button>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3 sm:p-4 mb-4 max-h-48 sm:max-h-64 overflow-y-auto">
            <p className="text-card-foreground text-sm sm:text-base whitespace-pre-wrap">{data.text}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 text-xs sm:text-sm">
            <div className="text-muted-foreground">
              <span>{formatDuration(data.audioDuration)}</span> minutes •{" "}
              <span>{data.wordCount || data.text.split(/\s+/).filter(Boolean).length}</span> words
            </div>
            <button
              className="text-muted-foreground hover:text-card-foreground py-1"
              onClick={resetTranscription}
            >
              New Transcription
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionResult;
