import React from 'react';
import { useTranscription } from '../contexts/TranscriptionContext';
import { PageHeader } from '../components/PageHeader';
import { Card, CardContent } from '../components/ui/card';
import { TranscriptionForm } from '../components/TranscriptionForm';
import { TranscriptionResult } from '../components/TranscriptionResult';
import { Button } from '../components/ui/button';

export default function Transcribe() {
  const {
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
    
    // Methods
    startTranscription,
    resetTranscription,
  } = useTranscription();

  const renderContent = () => {
    if (transcriptionStatus === "idle") {
      return (
        <TranscriptionForm
          inputMethod={inputMethod}
          setInputMethod={setInputMethod}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          audioUrl={audioUrl}
          setAudioUrl={setAudioUrl}
          speechModel={speechModel}
          setSpeechModel={setSpeechModel}
          startTranscription={startTranscription}
          isTranscribing={transcriptionStatus === "loading"}
          isValid={selectedFile !== null || audioUrl !== ""}
        />
      );
    }
    
    if (transcriptionStatus === "loading") {
      return (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <div className="w-16 h-16 mb-6">
            <svg className="animate-spin w-full h-full text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">Transcribing your audio</h3>
          <p className="text-muted-foreground">
            This may take a moment depending on the length of your audio...
          </p>
        </div>
      );
    }
    
    if (transcriptionStatus === "error") {
      return (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <div className="w-16 h-16 mb-6 text-red-500 dark:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">Transcription Failed</h3>
          <p className="text-muted-foreground mb-6">
            {errorMessage || "An error occurred while transcribing your audio."}
          </p>
          <Button onClick={resetTranscription}>Try Again</Button>
        </div>
      );
    }
    
    // Success state
    if (transcriptionData) {
      return (
        <TranscriptionResult 
          transcriptionData={transcriptionData}
          resetTranscription={resetTranscription}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="w-full">
      <PageHeader
        heading="Transcribe Audio"
        text="Convert your audio to text with powerful speech recognition technology"
      />

      <div className="container py-6 space-y-8">
        <Card className="border border-border bg-card/50">
          <CardContent className="pt-6">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 