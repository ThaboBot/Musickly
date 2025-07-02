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
    title: 'AI, NFTs & Royalties',
    features: [
      { id: 1, text: 'AI Track Ownership via NFTs – Each AI-generated track is minted as an NFT, giving users verifiable ownership of the creation.' },
      { id: 2, text: 'Royalty-Backed Music NFTs – Artists and AI-collaborators can create royalty-generating NFTs, where owners earn a percentage when songs are streamed, remixed, or used commercially.' },
      { id: 3, text: 'AI x Human Collaboration Tokens – Co-created music (AI + user + featured artist) can be fractionalized and tokenized for shared ownership and royalty splits on-chain.' },
      { id: 4, text: 'Remix Licensing via Smart Contracts – Automatically handle remix permissions and licensing through smart contracts embedded into music NFTs.' },
      { id: 10, text: 'Modular Sound Licensing NFTs – Assign licenses to specific parts of a song (vocals, beat, melody), enabling reuse in apps, games, or ads with granular control.' },
      { id: 12, text: 'AI Style Profiles as NFTs – Unique AI music-generation profiles (based on user training) can be tokenized, sold, or lent out — essentially a "Musical AI Persona."' },
    ],
  },
  {
    title: 'Decentralized Infrastructure & Data',
    features: [
      { id: 5, text: 'Identity-Linked Music Provenance – All created or modified tracks have a transparent audit trail showing who composed, altered, or shared them — verified via blockchain.' },
      { id: 6, text: 'Decentralized Playlist Hosting – Playlists can be stored on decentralized storage (IPFS/Filecoin) with blockchain-based sharing and versioning.' },
      { id: 8, text: 'Immutable Music Journals – Users can store their mood-linked music memories in timestamped, on-chain music diaries — a blockchain-protected emotional archive.' },
      { id: 13, text: 'Proof of Listening – Generate cryptographic proof that a user listened to a track (e.g., for fan rewards, contests, or artist analytics).' },
      { id: 17, text: 'Blockchain-Based Mood DNA – Store and tokenize a user’s "emotional listening signature" — a dynamic NFT that evolves with mood-linked music habits.' },
      { id: 18, text: 'On-Chain AI Track Customization History – Every edit or regeneration of a song is recorded as a verifiable on-chain version, ensuring traceability of creative evolution.' },
    ],
  },
  {
    title: 'Community, Governance & Economy',
    features: [
      { id: 7, text: 'Tokenized Listening Economy – Users earn Musickly Tokens (MUS) for listening, creating, rating, or sharing — usable for unlocking premium features or tipping artists.' },
      { id: 14, text: 'DAO-Governed Curation – Allow the community to vote on feature tracks, playlist inclusion, and visualizer designs via a Musickly DAO.' },
      { id: 15, text: 'NFT-Based Event Tickets – Virtual concerts, listening parties, or artist jams can be token-gated using on-chain NFT tickets with built-in access control.' },
      { id: 16, text: 'Custom Visualizer NFTs – Users can design and mint custom audio-reactive visualizers as NFTs, available for others to license or remix.' },
      { id: 19, text: 'Interoperable Creator Reputation System – Verified artist actions (drops, collabs, royalties, ethics) tracked on-chain — creates a reputation score usable across platforms.' },
      { id: 20, text: 'Blockchain-Backed Fan Feedback – Verified feedback or ratings can be stored on-chain for artist/fan authenticity and feedback tracking.' },
    ],
  },
  {
    title: 'Marketplace & Interoperability',
    features: [
      { id: 9, text: 'Decentralized Marketplace for AI Stems & Loops – Users can buy, sell, and license AI-generated music components (loops, vocals, stems) as NFTs or open-license tokens with resale support.' },
      { id: 11, text: 'Cross-App NFT Integration – Musickly NFTs and assets (e.g., soundscapes or user avatars) can be used in other apps, metaverses, or games (via ERC-721/1155).' },
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


export default function BlockchainFeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Blockchain-Powered Features"
        description="Exploring the future of music with decentralized technologies."
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
