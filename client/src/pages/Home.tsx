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
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Voice Transcriber</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert your audio to text with AssemblyAI's powerful speech recognition technology
          </p>
        </header>

        {/* Main Application */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
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
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>
            Powered by{" "}
            <a
              href="https://www.assemblyai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              AssemblyAI
            </a>{" "}
            •{" "}
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
