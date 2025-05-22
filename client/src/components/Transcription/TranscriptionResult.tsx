import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type TranscriptionResponse } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { downloadTranscriptionAsPDF, downloadTranscriptionAsDOCX } from "@/lib/fileGenerators";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TranscriptionStatus = 'idle' | 'transcribing' | 'completed' | 'error';

interface Utterance {
  text: string;
  start: number;
  end: number;
  speaker: string;
  confidence?: number;
}

interface TranscriptionResultProps {
  status: TranscriptionStatus;
  data: TranscriptionResponse | null;
  errorMessage?: string;
  resetTranscription: () => void;
}

const TranscriptionResult: React.FC<TranscriptionResultProps> = ({
  status,
  data,
  errorMessage,
  resetTranscription,
}) => {
  const { toast } = useToast();

  if (!data || status === 'idle') return null;

  const handleDownload = (format: 'pdf' | 'docx') => {
    if (!data) return;
    
    try {
      if (format === 'pdf') {
        downloadTranscriptionAsPDF(data);
      } else {
        downloadTranscriptionAsDOCX(data);
      }
      
      toast({
        title: 'Download started',
        description: `Your transcription is being downloaded as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Error downloading transcription',
        description: 'An error occurred while downloading your transcription.',
        variant: 'destructive',
      });
    }
  };

  const copyTranscription = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.text);
    toast({
      title: 'Copied to clipboard!',
      description: 'The transcription has been copied to your clipboard.',
    });
  };

  const formatTranscription = () => {
    if (!data?.utterances) return data?.text || '';
    
    return data.utterances.map((utterance: Utterance) => {
      const speakerLabel = utterance.speaker ? `Speaker ${utterance.speaker}: ` : '';
      return `${speakerLabel}${utterance.text}`;
    }).join('\n\n');
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Transcription Result</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyTranscription}>
            Copy to Clipboard
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Download As
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('docx')}>
                Word (DOCX)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={resetTranscription}>
            Start Over
          </Button>
        </div>
      </div>

      {status === 'transcribing' && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Transcribing...</span>
        </div>
      )}

      {status === 'error' && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-destructive">
            <p className="font-medium">Error during transcription:</p>
            <p>{errorMessage || 'An unknown error occurred'}</p>
          </CardContent>
        </Card>
      )}

      {status === 'completed' && data && (
        <Card>
          <CardContent className="p-4">
            <div className="whitespace-pre-wrap">
              {formatTranscription()}
            </div>
            {data.wordCount && (
              <p className="mt-4 text-sm text-muted-foreground">
                {data.wordCount} words • {data.audioDuration ? `${Math.round(data.audioDuration / 60)} min` : ''}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TranscriptionResult;
