import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { AppLayout } from '@/components/app-layout';
import './globals.css';
import { LoadingScreen } from '@/components/loading-screen';

export const metadata: Metadata = {
  title: 'Musickly',
  description: 'The future of music creation, powered by AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <LoadingScreen />
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
