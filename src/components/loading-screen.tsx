'use client';

import { useState, useEffect } from 'react';
import { Logo } from './icons';
import { cn } from '@/lib/utils';

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    // This is a simple timer to simulate loading.
    // In a real app, you might wait for data to load.
    const timer = setTimeout(() => {
      setHiding(true);
      const fadeOutTimer = setTimeout(() => {
        setLoading(false);
      }, 500); // This duration should match the opacity transition
      return () => clearTimeout(fadeOutTimer);
    }, 2500); // Show loading screen for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!loading) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-500 ease-out',
        hiding ? 'opacity-0' : 'opacity-100'
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex items-center justify-center">
        <div className="animate-pulse">
            <Logo />
        </div>
        {/* Spinning rings */}
        <div className="absolute -inset-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin-slow"></div>
        <div className="absolute -inset-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin-slow-reverse"></div>
      </div>
    </div>
  );
}
