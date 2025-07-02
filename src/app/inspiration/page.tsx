'use client';

import { useState } from 'react';
import { generateSongIdea, type SongIdeaOutput } from '@/ai/flows/inspiration-mode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Music, Sparkles, Wand2 } from 'lucide-react';

export default function InspirationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [idea, setIdea] = useState<SongIdeaOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setIdea(null);
    try {
      const newIdea = await generateSongIdea({});
      setIdea(newIdea);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating idea',
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
        title="Inspiration Mode"
        description="Generate a unique song idea to spark your creativity."
      />
      <div className="flex flex-col items-center">
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          size="lg"
          className="btn-primary-glow gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="h-5 w-5" />
          )}
          Generate New Idea
        </Button>

        <div className="mt-8 w-full max-w-2xl">
          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}
          {idea && (
            <Card className="glass-card animate-in fade-in duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Sparkles className="size-8 text-accent text-shadow-glow-accent" />
                  <span className="text-shadow-glow-accent">{idea.name}</span>
                </CardTitle>
                <CardDescription>Style: {idea.style}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Music className="mt-1 size-5 text-primary" />
                  <p className="text-lg text-foreground/90">{idea.theme}</p>
                </div>
              </CardContent>
            </Card>
          )}
           {!idea && !isLoading && (
            <div className="text-center text-muted-foreground mt-8">
              <p>Click the button to get your first song idea!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
