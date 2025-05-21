import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface AudioUrlInputProps {
  audioUrl: string;
  setAudioUrl: Dispatch<SetStateAction<string>>;
}

const AudioUrlInput = ({ audioUrl, setAudioUrl }: AudioUrlInputProps) => {
  const { toast } = useToast();
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);

  // Validate URL and check for audio file extensions
  const validateAudioUrl = (url: string): boolean => {
    try {
      // Check if it's a valid URL
      new URL(url);
      
      // Check if URL points to an audio file
      const audioExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.flac', '.aac'];
      const hasAudioExtension = audioExtensions.some(ext => url.toLowerCase().endsWith(ext));
      
      return hasAudioExtension;
    } catch (e) {
      return false;
    }
  };

  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value.trim();
    setAudioUrl(newUrl);
    
    if (newUrl) {
      const isValid = validateAudioUrl(newUrl);
      setIsValidUrl(isValid);
      
      if (isValid) {
        toast({
          title: "Valid audio URL",
          description: "URL appears to link to an audio file",
        });
      }
    } else {
      setIsValidUrl(null);
    }
  };

  return (
    <div className="mb-4 px-1">
      <Label htmlFor="audio-url" className="block text-sm font-medium text-foreground mb-2">
        Audio URL
      </Label>
      <div className="relative">
        <Input
          type="url"
          id="audio-url"
          placeholder="https://example.com/audio-file.mp3"
          value={audioUrl}
          onChange={handleUrlInput}
          className={`w-full h-12 px-3 py-2 text-base border-border rounded-md focus:outline-none focus:ring-2 focus:border-transparent pr-10 ${
            isValidUrl === true ? 'focus:ring-green-500 border-green-500' : 
            isValidUrl === false ? 'focus:ring-red-500 border-red-500' : 
            'focus:ring-primary'
          }`}
        />
        {isValidUrl !== null && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {isValidUrl ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Enter the direct URL to an audio file (MP3, WAV, etc.)
      </p>
    </div>
  );
};

export default AudioUrlInput;
