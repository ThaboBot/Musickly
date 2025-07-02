'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateAlbumArt } from '@/ai/flows/album-art-generator';
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
import { Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  mood: z.string().min(2, { message: 'Mood must be at least 2 characters.' }),
  style: z.string().min(2, { message: 'Style must be at least 2 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AlbumArtGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: 'Cosmic Echoes',
      mood: 'Mysterious and epic',
      style: 'Sci-fi digital painting',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setImageUrl(null);
    try {
      const response = await generateAlbumArt(data);
      setImageUrl(response.albumArtDataUri);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating album art',
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
        title="Album Art Generator"
        description="Create stunning, AI-generated album art for your music."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Art Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Song/Album Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Midnight Drive" {...field} />
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
                        <Input placeholder="e.g., Nostalgic, Energetic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visual Style</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Abstract, Photorealistic" {...field} />
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
                    'Generate Album Art'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="text-accent" />
              Generated Art
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {isLoading && (
              <div className="flex h-full min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Generated album art"
                width={512}
                height={512}
                className="aspect-square rounded-lg object-cover"
              />
            ) : (
              !isLoading && (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center text-muted-foreground">
                  <ImageIcon className="mb-4 size-16" />
                  <p>Your generated album art will appear here.</p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
