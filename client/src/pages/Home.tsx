import TranscriptionForm from "@/components/Transcription/TranscriptionForm";
import TranscriptionResult from "@/components/Transcription/TranscriptionResult";
import { useTranscription } from "@/hooks/useTranscription";

const Home = () => {
  const {
    inputMethod,
    setInputMethod,
    selectedFile,
    setSelectedFile,
    audioUrl,
    setAudioUrl,
    isTranscribing,
    transcriptionStatus,
    transcriptionData,
    errorMessage,
    resetTranscription,
    startTranscription,
    isInputValid,
    speechModel,
    setSpeechModel,
  } = useTranscription();

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Voice Transcriber</h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            Convert your audio to text with powerful speech recognition technology
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground/80 mt-2">
            Developed by Shreenidhi Vasishta
          </p>
        </header>

        {/* Main Application */}
        <div className="max-w-3xl mx-auto bg-card rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden border border-border">
          <TranscriptionForm
            inputMethod={inputMethod}
            setInputMethod={setInputMethod}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            audioUrl={audioUrl}
            setAudioUrl={setAudioUrl}
            isTranscribing={isTranscribing}
            isInputValid={isInputValid}
            startTranscription={startTranscription}
            speechModel={speechModel}
            setSpeechModel={setSpeechModel}
          />

          <TranscriptionResult
            status={transcriptionStatus}
            data={transcriptionData}
            errorMessage={errorMessage}
            resetTranscription={resetTranscription}
          />
        </div>

        {/* Footer */}
        <footer className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground/80">
          <p>
            © {new Date().getFullYear()} Shreenidhi Vasishta • 
            Voice Transcription App
            {" "}•{" "}
            <a href="#" className="hover:underline">
              Terms
            </a>{" "}
            •{" "}
            <a href="#" className="hover:underline">
              Privacy
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
