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
    <div className="p-3 sm:p-4 bg-card rounded-lg mb-4 border border-border">
      <h3 className="text-base sm:text-lg font-medium text-card-foreground mb-3">Record Audio</h3>
      
      {/* Recording timer - Mobile optimized */}
      {isRecording && (
        <div className="mb-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-muted-foreground">
            Recording in progress...
          </div>
        </div>
      )}
      
      {/* Audio preview - Mobile optimized */}
      {audioBlob && !isRecording && (
        <div className="mb-4">
          <audio 
            src={URL.createObjectURL(audioBlob)} 
            controls 
            className="w-full mb-2 h-12"
          />
          <div className="text-sm text-muted-foreground text-center">
            Recording duration: {formatTime(recordingTime)}
          </div>
        </div>
      )}
      
      {/* Recording controls - Mobile optimized */}
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
        {!isRecording && !audioBlob && (
          <Button
            onClick={startRecording}
            className="bg-red-500 hover:bg-red-600 h-12 w-full sm:w-auto"
          >
            <span className="material-icons mr-2">mic</span>
            Start Recording
          </Button>
        )}
        
        {isRecording && (
          <Button
            onClick={stopRecording}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50 h-12 w-full sm:w-auto mb-2 sm:mb-0"
          >
            <span className="material-icons mr-2">stop</span>
            Stop Recording
          </Button>
        )}
        
        {audioBlob && !isRecording && (
          <Button
            onClick={discardRecording}
            variant="outline"
            className="border-border text-muted-foreground h-12 w-full sm:w-auto"
          >
            <span className="material-icons mr-2">delete</span>
            Discard
          </Button>
        )}
        
        {isRecording && (
          <Button
            onClick={discardRecording}
            variant="outline"
            className="border-border text-muted-foreground h-12 w-full sm:w-auto"
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