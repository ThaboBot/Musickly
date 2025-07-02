import { FeatureCard } from '@/components/feature-card';
import { PageHeader } from '@/components/page-header';
import { BrainCircuit, Camera, GitBranch, LayoutDashboard, MicVocal, Music4, Sparkles, Rocket, Blocks, Image as ImageIcon } from 'lucide-react';

const features = [
  {
    title: 'Inspiration Mode',
    description: 'Get a unique, AI-generated song idea every day.',
    href: '/inspiration',
    icon: <Sparkles className="size-8 text-primary" />,
  },
  {
    title: 'Lyrics Generator',
    description: 'Create lyrics for any genre, mood, and theme.',
    href: '/lyrics-generator',
    icon: <Music4 className="size-8 text-primary" />,
  },
  {
    title: 'Mindfulness Music',
    description: 'Generate calming soundscapes for meditation or focus.',
    href: '/mindfulness',
    icon: <BrainCircuit className="size-8 text-primary" />,
  },
  {
    title: 'Voice-to-Music',
    description: 'Hum a melody and let AI compose a full track.',
    href: '/voice-to-music',
    icon: <MicVocal className="size-8 text-primary" />,
  },
  {
    title: 'Neural Remix Engine',
    description: 'Remix any track into a completely new genre.',
    href: '/neural-remix',
    icon: <GitBranch className="size-8 text-primary" />,
  },
  {
    title: 'Camera to Theme',
    description: 'Snap a photo to generate a matching soundtrack.',
    href: '/camera-to-theme',
    icon: <Camera className="size-8 text-primary" />,
  },
  {
    title: 'Album Art Generator',
    description: 'Create stunning, AI-generated album art for your music.',
    href: '/album-art',
    icon: <ImageIcon className="size-8 text-primary" />,
  },
   {
    title: 'Features Roadmap',
    description: 'See what new and exciting features are coming soon.',
    href: '/features',
    icon: <Rocket className="size-8 text-primary" />,
  },
   {
    title: 'Blockchain Features',
    description: 'Explore the future of music with decentralized tech.',
    href: '/blockchain',
    icon: <Blocks className="size-8 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Dashboard"
        description="Welcome to Musickly. Your AI music co-pilot."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.href}
            href={feature.href}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
}
