import { Dispatch, SetStateAction } from "react";
import AudioFileUpload from "./AudioFileUpload";
import AudioUrlInput from "./AudioUrlInput";
import AudioRecorder from "./AudioRecorder";
import AdvancedOptions from "./AdvancedOptions";
import { Button } from "@/components/ui/button";

interface TranscriptionFormProps {
  inputMethod: "upload" | "url" | "record";
  setInputMethod: Dispatch<SetStateAction<"upload" | "url" | "record">>;
  selectedFile: File | null;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  audioUrl: string;
  setAudioUrl: Dispatch<SetStateAction<string>>;
  isTranscribing: boolean;
  isInputValid: boolean;
  startTranscription: () => void;
  speechModel: "base" | "best";
  setSpeechModel: Dispatch<SetStateAction<"base" | "best">>;
}

const TranscriptionForm = ({
  inputMethod,
  setInputMethod,
  selectedFile,
  setSelectedFile,
  audioUrl,
  setAudioUrl,
  isTranscribing,
  isInputValid,
  startTranscription,
  speechModel,
  setSpeechModel,
}: TranscriptionFormProps) => {
  return (
    <div className="p-4 sm:p-6 border-b border-border">
      <h2 className="text-xl font-semibold text-card-foreground mb-4">Transcribe Audio</h2>

      {/* Input Method Toggle - Improved for mobile */}
      <div className="flex flex-col sm:flex-row border border-border rounded-lg overflow-hidden mb-5">
        <button
          onClick={() => setInputMethod("upload")}
          className={`py-3 text-sm sm:text-base text-center font-medium transition flex justify-center items-center ${
            inputMethod === "upload"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground hover:bg-muted"
          } ${inputMethod === "upload" ? "" : "border-b sm:border-b-0 sm:border-r border-border"}`}
        >
          <span className="material-icons text-sm align-middle mr-1">upload_file</span>
          Upload File
        </button>
        <button
          onClick={() => setInputMethod("url")}
          className={`py-3 text-sm sm:text-base text-center font-medium transition flex justify-center items-center ${
            inputMethod === "url"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground hover:bg-muted"
          } ${inputMethod === "url" ? "" : "border-b sm:border-b-0 sm:border-r border-border"}`}
        >
          <span className="material-icons text-sm align-middle mr-1">link</span>
          Audio URL
        </button>
        <button
          onClick={() => setInputMethod("record")}
          className={`py-3 text-sm sm:text-base text-center font-medium transition flex justify-center items-center ${
            inputMethod === "record"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground hover:bg-muted"
          }`}
        >
          <span className="material-icons text-sm align-middle mr-1">mic</span>
          Record Audio
        </button>
      </div>

      {/* Input Methods */}
      <div className={inputMethod === "upload" ? "block" : "hidden"}>
        <AudioFileUpload selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
      </div>

      <div className={inputMethod === "url" ? "block" : "hidden"}>
        <AudioUrlInput audioUrl={audioUrl} setAudioUrl={setAudioUrl} />
      </div>
      
      <div className={inputMethod === "record" ? "block" : "hidden"}>
        <AudioRecorder setSelectedFile={setSelectedFile} />
      </div>

      {/* Advanced Options */}
      <AdvancedOptions speechModel={speechModel} setSpeechModel={setSpeechModel} />

      {/* Submit Button - Made taller and more touch-friendly */}
      <Button
        onClick={startTranscription}
        disabled={!isInputValid || isTranscribing}
        className="w-full py-4 px-4 h-auto text-base rounded-md mt-4"
      >
        {isTranscribing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          "Transcribe Audio"
        )}
      </Button>
    </div>
  );
};

export default TranscriptionForm;
