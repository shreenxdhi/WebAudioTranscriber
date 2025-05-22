export interface TranscriptionResult {
  text: string;
  segments?: Array<{
    speaker: string;
    text: string;
    start: number;
    end: number;
  }>;
  speakers?: string[];
  error?: string;
}

export function transcribeFromUrl(url: string): Promise<TranscriptionResult>;
export function transcribeFromFile(file: { path: string }): Promise<TranscriptionResult>;
export function formatTranscriptionResult(result: TranscriptionResult): {
  utterances: Array<{ speaker: string; text: string; start: number; end: number }>;
  speaker_labels: boolean;
  speakers: string[];
};
