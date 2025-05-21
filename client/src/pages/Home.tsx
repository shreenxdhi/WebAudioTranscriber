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
            Convert your audio to text with powerful speech recognition technology
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Developed by Shreenidhi Vasishta
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
            © 2023 Shreenidhi Vasishta • 
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
