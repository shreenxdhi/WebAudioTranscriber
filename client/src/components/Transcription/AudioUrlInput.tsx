import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AudioUrlInputProps {
  audioUrl: string;
  setAudioUrl: Dispatch<SetStateAction<string>>;
}

const AudioUrlInput = ({ audioUrl, setAudioUrl }: AudioUrlInputProps) => {
  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioUrl(e.target.value.trim());
  };

  return (
    <div className="mb-4 px-1">
      <Label htmlFor="audio-url" className="block text-sm font-medium text-foreground mb-2">
        Audio URL
      </Label>
      <Input
        type="url"
        id="audio-url"
        placeholder="https://example.com/audio-file.mp3"
        value={audioUrl}
        onChange={handleUrlInput}
        className="w-full h-12 px-3 py-2 text-base border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Enter the direct URL to an audio file (MP3, WAV, etc.)
      </p>
    </div>
  );
};

export default AudioUrlInput;
