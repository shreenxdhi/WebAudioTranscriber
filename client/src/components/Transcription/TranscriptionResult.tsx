import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TranscriptionResponse } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

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
    <div className="p-6">
      {/* Initial State */}
      {status === "idle" && (
        <div className="py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <span className="material-icons text-2xl text-gray-400">record_voice_over</span>
          </div>
          <h3 className="text-lg font-medium text-gray-700">No transcription yet</h3>
          <p className="text-gray-500 text-sm mt-1">
            Upload or provide a URL to an audio file to get started
          </p>
        </div>
      )}

      {/* Loading State */}
      {status === "loading" && (
        <div className="py-10 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary mb-4"></div>
          <h3 className="text-lg font-medium text-gray-700">Transcribing your audio</h3>
          <p className="text-gray-500 text-sm mt-1">
            This may take a few moments depending on the file size
          </p>
          <div className="w-full max-w-md mx-auto mt-4 bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full w-3/4"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <span className="material-icons text-2xl text-red-500">error_outline</span>
          </div>
          <h3 className="text-lg font-medium text-gray-700">Transcription failed</h3>
          <p className="text-red-500 text-sm mt-1">{errorMessage || "Unable to process the audio file. Please try again."}</p>
          <Button 
            variant="outline"
            className="mt-4 px-4 py-2"
            onClick={resetTranscription}
          >
            Try again
          </Button>
        </div>
      )}

      {/* Success State */}
      {status === "success" && data && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Transcription Results</h3>
            <button
              className="text-primary hover:text-blue-700 font-medium text-sm inline-flex items-center"
              onClick={copyToClipboard}
            >
              <span className="material-icons mr-1 text-base">
                {copyButtonText === "Copied!" ? "check" : "content_copy"}
              </span>
              {copyButtonText}
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap">{data.text}</p>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-500">
              <span>{formatDuration(data.audioDuration)}</span> minutes •{" "}
              <span>{data.wordCount || data.text.split(/\s+/).filter(Boolean).length}</span> words
            </div>
            <button
              className="text-gray-500 hover:text-gray-700"
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
