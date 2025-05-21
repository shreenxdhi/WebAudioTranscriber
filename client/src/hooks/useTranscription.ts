import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type TranscriptionResponse } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

type InputMethod = "upload" | "url" | "record";
type TranscriptionStatus = "idle" | "loading" | "success" | "error";
type SpeechModel = "base" | "best";

export const useTranscription = () => {
  const { toast } = useToast();
  
  // Form state
  const [inputMethod, setInputMethod] = useState<InputMethod>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [speechModel, setSpeechModel] = useState<SpeechModel>("best");
  
  // Transcription state
  const [transcriptionStatus, setTranscriptionStatus] = useState<TranscriptionStatus>("idle");
  const [transcriptionData, setTranscriptionData] = useState<TranscriptionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Validate input based on input method
  const isInputValid = 
    (inputMethod === "upload" && selectedFile !== null) || 
    (inputMethod === "url" && isValidUrl(audioUrl));
  
  // Check if URL is valid
  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // Transcribe via URL mutation
  const transcribeUrlMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/transcribe/url", {
        url,
        options: {
          speechModel
        }
      });
      return response.json() as Promise<TranscriptionResponse>;
    },
    onSuccess: (data) => {
      setTranscriptionData(data);
      setTranscriptionStatus("success");
      toast({
        title: "Transcription complete",
        description: "Your audio has been successfully transcribed",
      });
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Failed to transcribe audio");
      setTranscriptionStatus("error");
      toast({
        title: "Transcription failed",
        description: error.message || "Failed to transcribe audio",
        variant: "destructive",
      });
    }
  });
  
  // Transcribe via file upload mutation
  const transcribeFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("speechModel", speechModel);
      
      const response = await fetch("/api/transcribe/upload", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      
      return response.json() as Promise<TranscriptionResponse>;
    },
    onSuccess: (data) => {
      setTranscriptionData(data);
      setTranscriptionStatus("success");
      toast({
        title: "Transcription complete",
        description: "Your audio has been successfully transcribed",
      });
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Failed to transcribe audio file");
      setTranscriptionStatus("error");
      toast({
        title: "Transcription failed",
        description: error.message || "Failed to transcribe audio file",
        variant: "destructive",
      });
    }
  });
  
  // Start transcription based on input method
  const startTranscription = async () => {
    if (!isInputValid) return;
    
    setTranscriptionStatus("loading");
    
    if (inputMethod === "upload" && selectedFile) {
      transcribeFileMutation.mutate(selectedFile);
    } else if (inputMethod === "url" && audioUrl) {
      transcribeUrlMutation.mutate(audioUrl);
    }
  };
  
  // Reset transcription state
  const resetTranscription = () => {
    setTranscriptionStatus("idle");
    setTranscriptionData(null);
    setErrorMessage("");
  };
  
  // Return values and methods
  return {
    // Form state
    inputMethod,
    setInputMethod,
    selectedFile,
    setSelectedFile,
    audioUrl,
    setAudioUrl,
    speechModel,
    setSpeechModel,
    
    // Transcription state
    transcriptionStatus,
    transcriptionData,
    errorMessage,
    
    // Derived state
    isTranscribing: transcriptionStatus === "loading",
    isInputValid,
    
    // Methods
    startTranscription,
    resetTranscription,
  };
};
