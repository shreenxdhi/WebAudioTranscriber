import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AudioRecorderProps {
  setSelectedFile: (file: File | null) => void;
}

const AudioRecorder = ({ setSelectedFile }: AudioRecorderProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Handle recording stop
      mediaRecorder.onstop = () => {
        // Create blob from chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Convert blob to file
        const fileName = `recording-${new Date().toISOString()}.wav`;
        const file = new File([audioBlob], fileName, { type: 'audio/wav' });
        setSelectedFile(file);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Clear timer
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Your microphone is now recording audio",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording failed",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording stopped",
        description: "Your recording is ready to be transcribed",
      });
    }
  };

  // Discard recording
  const discardRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setAudioBlob(null);
    setSelectedFile(null);
    setIsRecording(false);
    setRecordingTime(0);
    
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    toast({
      title: "Recording discarded",
      description: "Your recording has been discarded",
    });
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg mb-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Record Audio</h3>
      
      {/* Recording timer */}
      {isRecording && (
        <div className="mb-4 text-center">
          <div className="text-xl font-bold text-primary">
            {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-gray-500">
            Recording in progress...
          </div>
        </div>
      )}
      
      {/* Audio preview */}
      {audioBlob && !isRecording && (
        <div className="mb-4">
          <audio 
            src={URL.createObjectURL(audioBlob)} 
            controls 
            className="w-full mb-2"
          />
          <div className="text-sm text-gray-500 text-center">
            Recording duration: {formatTime(recordingTime)}
          </div>
        </div>
      )}
      
      {/* Recording controls */}
      <div className="flex justify-center space-x-3">
        {!isRecording && !audioBlob && (
          <Button
            onClick={startRecording}
            className="bg-red-500 hover:bg-red-600"
          >
            <span className="material-icons mr-2">mic</span>
            Start Recording
          </Button>
        )}
        
        {isRecording && (
          <Button
            onClick={stopRecording}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <span className="material-icons mr-2">stop</span>
            Stop Recording
          </Button>
        )}
        
        {audioBlob && !isRecording && (
          <Button
            onClick={discardRecording}
            variant="outline"
            className="border-gray-300 text-gray-700"
          >
            <span className="material-icons mr-2">delete</span>
            Discard
          </Button>
        )}
        
        {isRecording && (
          <Button
            onClick={discardRecording}
            variant="outline"
            className="border-gray-300 text-gray-700"
          >
            <span className="material-icons mr-2">delete</span>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;