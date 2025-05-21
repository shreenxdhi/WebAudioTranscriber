import { Dispatch, SetStateAction } from "react";
import AudioFileUpload from "./AudioFileUpload";
import AudioUrlInput from "./AudioUrlInput";
import AdvancedOptions from "./AdvancedOptions";
import { Button } from "@/components/ui/button";

interface TranscriptionFormProps {
  inputMethod: "upload" | "url";
  setInputMethod: Dispatch<SetStateAction<"upload" | "url">>;
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
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Transcribe Audio</h2>

      {/* Input Method Toggle */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-6">
        <button
          onClick={() => setInputMethod("upload")}
          className={`flex-1 py-2 text-center font-medium transition flex justify-center items-center ${
            inputMethod === "upload"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span className="material-icons text-sm align-middle mr-1">upload_file</span>
          Upload File
        </button>
        <button
          onClick={() => setInputMethod("url")}
          className={`flex-1 py-2 text-center font-medium transition flex justify-center items-center ${
            inputMethod === "url"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span className="material-icons text-sm align-middle mr-1">link</span>
          Audio URL
        </button>
      </div>

      {/* Input Methods */}
      <div className={inputMethod === "upload" ? "block" : "hidden"}>
        <AudioFileUpload selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
      </div>

      <div className={inputMethod === "url" ? "block" : "hidden"}>
        <AudioUrlInput audioUrl={audioUrl} setAudioUrl={setAudioUrl} />
      </div>

      {/* Advanced Options */}
      <AdvancedOptions speechModel={speechModel} setSpeechModel={setSpeechModel} />

      {/* Submit Button */}
      <Button
        onClick={startTranscription}
        disabled={!isInputValid || isTranscribing}
        className="w-full py-3 px-4 h-auto"
      >
        {isTranscribing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
