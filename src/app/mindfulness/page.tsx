'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateMindfulnessMusic } from '@/ai/flows/mindfulness-music-generator';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Waves } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const formSchema = z.object({
  meditationType: z.string().min(1, { message: 'Please select a type.' }),
  durationMinutes: z.number().min(1).max(60),
  environmentDescription: z.string().min(2, { message: 'Please describe the environment.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function MindfulnessPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meditationType: 'sleep',
      durationMinutes: 10,
      environmentDescription: 'Calm rainforest with gentle rain',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setAudioSrc(null);
    try {
      const response = await generateMindfulnessMusic(data);
      setAudioSrc(response.media);
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
        title="Mindfulness Music"
        description="Create personalized soundscapes for relaxation and focus."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="meditationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meditation Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a meditation type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sleep">Sleep</SelectItem>
                          <SelectItem value="yoga">Yoga</SelectItem>
                          <SelectItem value="mindfulness">Mindfulness</SelectItem>
                          <SelectItem value="focus">Focus</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration: {field.value} minutes</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={60}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="environmentDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environment</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., a quiet beach at sunset" {...field} />
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
                    'Generate Soundscape'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="text-accent" />
              Your Soundscape
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-64 items-center justify-center">
            {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
            {audioSrc && (
              <audio controls src={audioSrc} className="w-full">
                Your browser does not support the audio element.
              </audio>
            )}
            {!isLoading && !audioSrc && (
              <p className="text-muted-foreground">Your generated audio will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
