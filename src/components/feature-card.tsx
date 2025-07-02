import NextLink from 'next/link';

type FeatureCardProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

export function FeatureCard({
  href,
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <NextLink href={href} className="group block">
      <div className="glass-card flex h-full flex-col p-6">
        <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-secondary/50">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-shadow-glow-accent">{title}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
    </NextLink>
  );
}
