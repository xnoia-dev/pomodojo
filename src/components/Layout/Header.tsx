import { Button } from '@/components/ui/Button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const DEFAULT_PLAYER_NAME = 'PLAYER ONE';

export function Header() {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.THEME, 'system');
  const [playerName, setPlayerName] = useLocalStorage(STORAGE_KEYS.PLAYER_NAME, DEFAULT_PLAYER_NAME);
  const [mounted, setMounted] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(playerName);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep the draft in sync with the stored value (e.g. once it loads from
  // localStorage after mount), but never clobber an in-progress edit.
  useEffect(() => {
    if (!isEditingName) setDraftName(playerName);
  }, [playerName, isEditingName]);

  useEffect(() => {
    if (isEditingName) {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }
  }, [isEditingName]);

  const commitName = () => {
    const trimmed = draftName.trim().toUpperCase().slice(0, 14);
    setPlayerName(trimmed || DEFAULT_PLAYER_NAME);
    setIsEditingName(false);
  };

  const cancelNameEdit = () => {
    setDraftName(playerName);
    setIsEditingName(false);
  };

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let effectiveTheme = theme;
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    root.classList.add(effectiveTheme);
    root.setAttribute('data-theme', effectiveTheme);
  }, [theme, mounted]);

  useEffect(() => {
    if (theme !== 'system' || !mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      root.setAttribute('data-theme', systemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    if (!mounted) return '⬢';
    switch (theme) {
      case 'light':
        return '☼';
      case 'dark':
        return '☾';
      default:
        return '⬢';
    }
  };

  return (
    <header className="shrink-0 border-b-2 border-[color:var(--neon-magenta)]/40 bg-[color:var(--chrome-bg)] backdrop-blur-sm transition-colors duration-300">
      <div className="px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-[color:var(--neon-cyan)] flex items-center justify-center shadow-[0_0_10px_rgba(0,255,249,0.5)]">
            <Image
              src="/pomodojo.png"
              alt="Pomodojo Logo"
              width={20}
              height={20}
              priority
            />
          </div>
          <h1 className="text-sm sm:text-lg font-arcade neon-text-magenta tracking-tight">
            POMODOJO
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isEditingName ? (
            <input
              ref={nameInputRef}
              value={draftName}
              onChange={(e) => setDraftName(e.target.value.toUpperCase())}
              onBlur={commitName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitName();
                if (e.key === 'Escape') cancelNameEdit();
              }}
              maxLength={14}
              className="hidden sm:block w-32 bg-[color:var(--inset-bg)] border border-[color:var(--neon-cyan)]/50 text-[color:var(--neon-cyan)] text-xs font-arcade uppercase px-2 py-1.5 focus:outline-none focus:border-[color:var(--neon-cyan)]"
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-arcade text-[color:var(--muted-foreground)] uppercase hover:text-[color:var(--neon-cyan)] transition-colors duration-150"
              title="Click to rename"
            >
              <span>{mounted ? playerName : DEFAULT_PLAYER_NAME}</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="opacity-50">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            className="w-9 h-9 rounded-none border border-[color:var(--neon-cyan)]/40 text-[color:var(--neon-cyan)] hover:bg-[color:var(--neon-cyan)]/10"
            title={`Theme: ${theme}`}
          >
            {getThemeIcon()}
          </Button>
        </div>
      </div>
    </header>
  );
}
