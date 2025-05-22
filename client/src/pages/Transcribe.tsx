import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranscription } from '@/hooks/useTranscription';
import TranscriptionResult from '@/components/Transcription/TranscriptionResult';
import AudioFileUpload from '@/components/Transcription/AudioFileUpload';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Transcribe() {
  const {
    // Form state
    inputMethod,
    setInputMethod,
    selectedFile,
    setSelectedFile,
    audioUrl,
    setAudioUrl,
    speechModel,
    setSpeechModel,
    
    // Transcription state
    transcriptionStatus,
    transcriptionData,
    errorMessage,
    
    // Methods
    startTranscription,
    resetTranscription,
    isInputValid,
  } = useTranscription();

  const isTranscribing = transcriptionStatus === 'transcribing';

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transcribe Audio</CardTitle>
          <p className="text-muted-foreground">Upload an audio file or enter a URL to transcribe</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <Tabs 
                value={inputMethod} 
                onValueChange={(value) => setInputMethod(value as 'upload' | 'url')}
                className="space-y-4"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="url">URL</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <AudioFileUpload 
                    selectedFile={selectedFile} 
                    setSelectedFile={setSelectedFile} 
                  />
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="audioUrl">Audio URL</Label>
                    <Input
                      id="audioUrl"
                      type="url"
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      placeholder="https://example.com/audio.mp3"
                    />
                  </div>
                </TabsContent>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="speechModel">Speech Model</Label>
                    <Select 
                      value={speechModel} 
                      onValueChange={(value) => setSpeechModel(value as 'base' | 'best')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="base">Base (Faster)</SelectItem>
                        <SelectItem value="best">Best Quality</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={startTranscription}
                    disabled={!isInputValid || isTranscribing}
                  >
                    {isTranscribing ? 'Transcribing...' : 'Transcribe'}
                  </Button>
                  
                  {transcriptionStatus !== 'idle' && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={resetTranscription}
                    >
                      Start Over
                    </Button>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {transcriptionStatus === 'transcribing' && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Transcribing your audio...</p>
              </CardContent>
            </Card>
          )}

          {transcriptionStatus === 'error' && (
            <Card className="border-destructive">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-destructive">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <div>
                    <h3 className="font-medium">Error</h3>
                    <p className="text-sm">{errorMessage || 'An error occurred during transcription'}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={resetTranscription}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {(transcriptionStatus === 'completed' || transcriptionStatus === 'error') && transcriptionData && (
            <TranscriptionResult
              status={transcriptionStatus}
              data={transcriptionData}
              errorMessage={errorMessage}
              resetTranscription={resetTranscription}
            />
          )}
        </div>
      </div>
    </div>
  );
}