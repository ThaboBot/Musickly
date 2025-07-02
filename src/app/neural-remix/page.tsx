'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { neuralRemix } from '@/ai/flows/neural-remix';
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
import { Loader2, GitBranch } from 'lucide-react';

const formSchema = z.object({
  track: z.custom<FileList>().transform((file) => file[0]),
  genre: z.string().min(2, { message: 'Genre is required.' }),
});

type FormValues = z.infer<typeof formSchema>;

const toDataURI = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function NeuralRemixPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      genre: 'Lo-fi Hip Hop',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);

    try {
      const trackDataUri = await toDataURI(data.track);
      const response = await neuralRemix({
        trackDataUri,
        genre: data.genre,
      });
      setResult(response.remixedTrackDataUri);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error creating remix',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      form.setValue('track', event.target.files as FileList);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Neural Remix Engine"
        description="Remix any track into a different genre using AI."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Upload & Configure</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="track"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audio Track</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="audio/*"
                          onChange={handleFileChange}
                          className="file:text-foreground"
                        />
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
                      <FormLabel>Target Genre</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Synthwave, Orchestral" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full btn-primary-glow">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Remixing...
                    </>
                  ) : (
                    'Create Remix'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="text-accent" />
              Your Remix
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-64 items-center justify-center">
            {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
            {result && (
              <audio controls src={result} className="w-full">
                Your browser does not support the audio element.
              </audio>
            )}
            {!isLoading && !result && (
              <p className="text-muted-foreground">Your remixed track will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
