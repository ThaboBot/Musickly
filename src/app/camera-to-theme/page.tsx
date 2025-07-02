'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cameraToThemeMusic, type CameraToThemeMusicOutput } from '@/ai/flows/camera-to-theme-music';
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
import Image from 'next/image';

const formSchema = z.object({
  photo: z.custom<FileList>().transform((file) => file[0]),
});

type FormValues = z.infer<typeof formSchema>;

const toDataURI = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function CameraToThemePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CameraToThemeMusicOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    if (!data.photo) {
      toast({
        title: 'No photo selected',
        description: 'Please upload a photo to generate a soundtrack.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);

    try {
      const photoDataUri = await toDataURI(data.photo);
      const response = await cameraToThemeMusic({ photoDataUri });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating soundtrack',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('photo', event.target.files as FileList);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Camera to Theme"
        description="Snap a photo and get a custom soundtrack."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Upload Your Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="file:text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 {preview && (
                  <div className="mt-4">
                    <Image
                      src={preview}
                      alt="Image preview"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <Button type="submit" disabled={isLoading} className="w-full btn-primary-glow">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Soundtrack'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music4 className="text-accent" />
              Generated Soundtrack
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {result ? (
              <>
                <div className="prose prose-invert prose-p:text-foreground/80 max-h-48 overflow-y-auto pr-2">
                  <p>{result.soundtrackDescription}</p>
                </div>
                <audio controls src={result.soundtrackDataUri} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </>
            ) : (
              !isLoading && (
                <p className="text-muted-foreground">
                  Your generated soundtrack will appear here.
                </p>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
