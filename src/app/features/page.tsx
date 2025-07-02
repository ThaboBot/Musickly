'use client';

import { PageHeader } from '@/components/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

const featureCategories = [
  {
    title: 'AI, Audio & Composition',
    features: [
      { id: 1, text: 'AI Genre Blending – Mix genres (e.g., jazz + trap + ambient) into seamless hybrid compositions.' },
      { id: 2, text: 'Auto-Key Detection – Instantly detect and display song key and scale.' },
      { id: 3, text: 'Real-Time Music Transposition – Shift pitch/key without losing quality.' },
      { id: 4, text: 'AI Mastering Engine – Polish generated tracks with industry-grade mastering.' },
      { id: 5, text: 'Loop & Sample Generator – Generate royalty-free loops and one-shots for producers.' },
      { id: 6, text: 'Song Structure Customizer – Edit AI-generated track structure (Intro, Verse, Drop, Outro).' },
      { id: 7, text: 'Mood Palette Composer – Drag emotions (e.g., “serene + bittersweet”) to shape compositions.' },
      { id: 8, text: 'Tempo Sync Across Devices – Seamless sync for jam sessions or multiple speakers.' },
      { id: 9, text: 'Sound Alike Search – Upload or hum a track and find musically similar AI-generated versions.' },
      { id: 10, text: 'Frequency Shaping EQ – AI-assisted EQ presets tailored to your headphones/speakers.' },
    ],
  },
  {
    title: 'Personalization & Intelligence',
    features: [
        { id: 11, text: 'Dynamic Dayparting – Different moods and playlists for morning, work, night, etc.' },
        { id: 12, text: 'Activity-Aware Playlists – Music adapts to jogging, studying, cooking, or gaming.' },
        { id: 13, text: 'Music DNA Profile – Breakdown of user taste: rhythm preference, emotional range, artist loyalty.' },
        { id: 14, text: 'Voice Command Music Control – "Play something dreamy and slow in E minor."' },
        { id: 15, text: 'Taste Evolution Timeline – Visualize how your music taste evolves over time.' },
        { id: 16, text: 'Hyperlocal Playlist Discovery – Explore trending sounds within your neighborhood or city.' },
        { id: 17, text: 'Personality-Based Curation – Use MBTI or Enneagram type to suggest music.' },
        { id: 18, text: 'Custom AI DJ Voice – Pick or train your own virtual DJ voice to narrate intros/outros.' },
        { id: 19, text: 'Sleep-Aware Transitions – Fade out or switch to slow-wave sound when user starts dozing.' },
        { id: 20, text: 'Focus Booster Mode – AI minimizes distractions and loops flow-state sounds.' },
    ],
  },
  {
    title: 'Wellness & Mindfulness',
    features: [
        { id: 21, text: 'Breathing Sync Music – Music changes intensity with guided breath pacing.' },
        { id: 22, text: 'Binaural Beat Integration – For sleep, productivity, or anxiety reduction.' },
        { id: 23, text: 'Emotion History Log – Track and reflect on emotional-musical correlation.' },
        { id: 24, text: 'Mental Health Check-Ins – Prompt users for mood logs with AI music therapy suggestions.' },
        { id: 25, text: 'Nature Fusion Generator – Mix music with dynamic nature sounds (rain, wind, ocean).' },
        { id: 26, text: 'Circadian Rhythm Support – AI optimizes tones for wake-up, energy, wind-down cycles.' },
        { id: 27, text: 'ASMR Composition Tool – Generate relaxing ASMR-based music or soundscapes.' },
        { id: 28, text: "Energy Level Meter – Visual indicator of song's energizing or calming power." },
        { id: 29, text: 'Meditation Timer & Tracker – Schedule and reflect on guided sound journeys.' },
        { id: 30, text: 'Synesthesia Mode – Display visual elements tied to harmonic energy and mood.' },
    ],
  },
  {
    title: 'UI/UX, Navigation & Design',
    features: [
        { id: 31, text: 'Quick Switch Themes – Instantly toggle visual themes (e.g., neon, cyberpunk, nature, minimal).' },
        { id: 32, text: 'Drag & Drop Playlist Builder – Easy reordering, grouping, and tagging of tracks.' },
        { id: 33, text: 'Floating Mini Player – Persistent, minimal player across all screens.' },
        { id: 34, text: 'Multi-touch Audio Control – Use gestures to remix during playback.' },
        { id: 35, text: 'Deep Color Customizer – Fully personalize color palettes across the UI.' },
        { id: 36, text: 'Modular Home Dashboard – Let users pin features they use most.' },
        { id: 37, text: 'Live Sound Wave UI – Playback area shows real-time audio waveforms.' },
        { id: 38, text: 'Vertical and Horizontal Modes – Optimized layouts for both orientations.' },
        { id: 39, text: 'Intelligent Search with Autocomplete – Predicts user intent and queries.' },
        { id: 40, text: 'Screen Reader & Accessibility Modes – For users with visual or motor impairments.' },
    ],
  },
  {
    title: 'Social, Sharing & Community',
    features: [
        { id: 41, text: 'Collaborative Playlists – Co-curate playlists with friends in real-time.' },
        { id: 42, text: 'Live Listening Rooms – Host synchronized listening sessions with chat.' },
        { id: 43, text: 'Music Reaction Emojis – React to tracks with emojis during group sessions.' },
        { id: 44, text: 'Remix Challenges – Community battles around AI stems or templates.' },
        { id: 45, text: 'Track Commenting – Comment timestamped feedback on songs like SoundCloud.' },
        { id: 46, text: 'Virtual Listening Avatars – Animated characters that reflect your current vibe.' },
        { id: 47, text: 'Public Music Profiles – Let users share their mood stats, playlists, and creations.' },
        { id: 48, text: 'Playlist QR Codes – Instantly share via scannable codes.' },
        { id: 49, text: '“What’s Your Soundtrack?” Quiz – Personality quiz that generates a custom theme song.' },
        { id: 50, text: 'Fan Collab Rooms – Create and remix songs with fans of a favorite artist using AI tools.' },
    ],
  },
];

const FeatureItem = ({ text }: { text: string }) => {
  const parts = text.split(' – ');
  const title = parts[0];
  const description = parts.length > 1 ? parts.slice(1).join(' – ') : '';

  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-1 size-5 shrink-0 text-accent" />
      <div>
        <p className="font-semibold">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
};


export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Musickly Feature Roadmap"
        description="A comprehensive list of 50 must-have features for a next-gen music platform."
      />
      <Accordion type="multiple" defaultValue={[featureCategories[0].title]} className="w-full space-y-4">
        {featureCategories.map((category) => (
          <AccordionItem value={category.title} key={category.title} className="glass-card rounded-xl border-none">
             <AccordionTrigger className="px-6 py-4 text-lg font-bold hover:no-underline">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-4">
                  <span>{category.title}</span>
                  <Badge variant="secondary">{category.features.length} features</Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <ul className="space-y-4 pt-4">
                {category.features.map((feature) => (
                  <li key={feature.id}>
                    <FeatureItem text={feature.text} />
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
