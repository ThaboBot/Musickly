'use client';

import { useState, useRef } from 'react';
import { generateMusicFromVoice } from '@/ai/flows/voice-to-music';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, Music, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VoiceToMusicPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    setAudioSrc(null);
    setResultSrc(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioSrc(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        title: 'Microphone access denied',
        description: 'Please allow microphone access in your browser settings.',
        variant: 'destructive',
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toDataURI = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const handleGenerateMusic = async () => {
    if (!audioSrc) {
      toast({ title: 'No recording found', description: 'Please record your voice first.' });
      return;
    }

    setIsLoading(true);
    setResultSrc(null);

    try {
      const audioBlob = await fetch(audioSrc).then((r) => r.blob());
      const voiceDataUri = await toDataURI(audioBlob);
      const response = await generateMusicFromVoice({ voiceDataUri });
      setResultSrc(response.musicDataUri);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating music',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Voice-to-Music"
        description="Hum a tune, and let our AI turn it into a full song."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Record Your Idea</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6">
            <Button
              size="icon"
              className={cn(
                'h-24 w-24 rounded-full transition-all duration-300',
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'btn-primary-glow'
              )}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              {isRecording ? <Square className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
            </Button>
            <p className="text-muted-foreground">
              {isRecording ? 'Recording...' : 'Tap to start recording'}
            </p>
            {audioSrc && !isRecording && (
              <div className="w-full space-y-4">
                <audio controls src={audioSrc} className="w-full" />
                <Button
                  onClick={handleGenerateMusic}
                  disabled={isLoading}
                  className="w-full btn-primary-glow"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Music...
                    </>
                  ) : (
                    'Generate Music'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="text-accent" />
              Generated Track
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-64 items-center justify-center">
            {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
            {resultSrc && (
              <audio controls src={resultSrc} className="w-full">
                Your browser does not support the audio element.
              </audio>
            )}
            {!isLoading && !resultSrc && (
              <p className="text-muted-foreground">Your generated track will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
