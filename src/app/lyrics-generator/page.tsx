'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateLyrics } from '@/ai/flows/lyrics-generator';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Music4 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  genre: z.string().min(2, { message: 'Genre must be at least 2 characters.' }),
  mood: z.string().min(2, { message: 'Mood must be at least 2 characters.' }),
  theme: z.string().min(2, { message: 'Theme must be at least 2 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LyricsGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: 'Neon Dreams',
      genre: 'Synthwave',
      mood: 'Nostalgic',
      theme: 'City nights',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setLyrics(null);
    try {
      const response = await generateLyrics(data);
      setLyrics(response.lyrics);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating lyrics',
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
        title="Lyrics Generator"
        description="Craft the perfect lyrics for your next hit song."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Song Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Midnight Drive" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Pop, Rock, Lo-fi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mood</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Happy, Melancholic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Love, Adventure" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full btn-primary-glow">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Lyrics'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="glass-card h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music4 className="text-accent" />
              Generated Lyrics
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ScrollArea className="h-full pr-4">
              {isLoading && (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {lyrics ? (
                <pre className="whitespace-pre-wrap font-body text-lg leading-relaxed text-foreground/90">
                  {lyrics}
                </pre>
              ) : (
                !isLoading && <p className="text-muted-foreground">Your lyrics will appear here.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
