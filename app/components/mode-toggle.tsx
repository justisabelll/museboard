'use client';

import * as React from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/app/components/ui/button';

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      onClick={toggleTheme}
      className="bg-background text-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-300 uppercase tracking-widest text-xs h-10 px-4 flex items-center shadow-sm"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-[14px] w-[14px] mr-1.5" />
      ) : (
        <MoonIcon className="h-[14px] w-[14px] mr-1.5" />
      )}
      <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </Button>
  );
}
