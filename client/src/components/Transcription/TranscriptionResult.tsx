import React from "react";
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

interface TranscriptionResultProps {
  transcriptionData: TranscriptionResponse;
  resetTranscription: () => void;
}

const TranscriptionResult = ({
  transcriptionData,
  resetTranscription,
}: TranscriptionResultProps) => {
  const { toast } = useToast();

  if (!transcriptionData) return null;

  // Handle copying the transcription to clipboard
  const copyTranscription = () => {
    navigator.clipboard.writeText(transcriptionData.text);
  };

  // Function to generate formatted output with speaker labels
  const generateFormattedOutput = () => {
    // Check if we have utterances with speaker labels
    if (
      transcriptionData.utterances &&
      transcriptionData.utterances.length > 0 &&
      transcriptionData.speaker_labels
    ) {
      return (
        <div className="space-y-4">
          {transcriptionData.utterances.map((utterance, index) => (
            <div key={index} className="pb-3 last:pb-0">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-primary whitespace-nowrap">
                  {utterance.speaker}:
                </span>
                <span className="text-foreground">{utterance.text}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Default to plain text if no speaker segments
    return <p className="text-foreground whitespace-pre-wrap">{transcriptionData.text}</p>;
  };

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">Transcription Result</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyTranscription}>
            <span className="material-icons mr-1 text-sm">content_copy</span>
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={resetTranscription}>
            <span className="material-icons mr-1 text-sm">refresh</span>
            New Transcription
          </Button>
        </div>
      </div>

      <Card className="border border-border">
        <CardContent className="pt-6">
          {generateFormattedOutput()}
        </CardContent>
      </Card>

      {transcriptionData.wordCount && (
        <div className="mt-4 text-sm text-muted-foreground">
          <span className="mr-4">
            <span className="font-medium">Words:</span> {transcriptionData.wordCount}
          </span>
          {transcriptionData.audioDuration && (
            <span>
              <span className="font-medium">Duration:</span>{" "}
              {Math.floor(transcriptionData.audioDuration / 60)}m{" "}
              {Math.round(transcriptionData.audioDuration % 60)}s
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TranscriptionResult;
