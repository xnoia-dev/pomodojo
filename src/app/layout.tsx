'use client';

import './globals.css';
import { useEffect, useState } from 'react';
import { Press_Start_2P, VT323 } from 'next/font/google';
import { clsx } from 'clsx';

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-arcade',
  display: 'swap',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-terminal',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <html lang="en">
        <head>
          <title>Pomodojo - Focus & Productivity Timer</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          <meta name="theme-color" content="#ff2fd0" />
        </head>
        <body className={clsx(pressStart.variable, vt323.variable)}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Pomodojo - Focus & Productivity Timer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ff2fd0" />
      </head>
      <body className={clsx(pressStart.variable, vt323.variable)} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}