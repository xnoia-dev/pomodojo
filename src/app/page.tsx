// src/app/page.tsx
'use client';

import { Header } from '@/components/Layout/Header';
import { CursorFX } from '@/components/Layout/CursorFX';
import { TimerDisplay } from '@/components/Timer/TimerDisplay';
import { TimerControls } from '@/components/Timer/TimerControls';
import { TimerSettings } from '@/components/Timer/TimerSettings';
import { StatsSummary, StatsSummaryRef } from '@/components/Timer/StatsSummary';
import { TodoList } from '@/components/Todo/TodoList';
import { useTimer } from '@/hooks/useTimer';
import { useTodos } from '@/hooks/useTodos';
import { useStats } from '@/hooks/useStats';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import { useRef, useState } from 'react';
import { clsx } from 'clsx';

export default function HomePage() {
  const [showTodos, setShowTodos] = useState(false);
  const timerSettingsRef = useRef<{ openSettings: () => void } | null>(null);
  const statsSummaryRef = useRef<StatsSummaryRef | null>(null);

  const { incrementPomodoro, getActiveTodo } = useTodos();
  const { today, allTime, recentDays, recordFocusSession, resetStats } = useStats();
  const [soundEnabled, setSoundEnabled] = useLocalStorage(STORAGE_KEYS.SOUND_ENABLED, true);

  const {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    hardReset,
    skipSession,
    startNextSession,
    updateConfig,
    config,
  } = useTimer({
    onFocusSessionComplete: () => {
      const activeTodo = getActiveTodo();
      if (activeTodo) {
        incrementPomodoro(activeTodo.id);
      }
      recordFocusSession(config.focusTime);
    }
  });

  const handleHardReset = () => {
    if (window.confirm('Hard reset? This clears the current round back to Round 1.')) {
      hardReset();
    }
  };

  const handleStartPause = () => {
    if (timerState.status === 'running') {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const handleOpenSettings = () => {
    timerSettingsRef.current?.openSettings();
  };

  const handleOpenStats = () => {
    statsSummaryRef.current?.openStats();
  };

  const handleToggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  useKeyboard({
    onStartPause: handleStartPause,
    onReset: resetTimer,
    onSkip: skipSession,
    onHardReset: handleHardReset,
    onSummarize: handleOpenStats,
    onSettings: handleOpenSettings,
    onAudioToggle: handleToggleSound,
    enabled: true,
  });

  const activeTodo = getActiveTodo();

  const sessionAccent =
    timerState.sessionType === 'focus'
      ? 'neon-panel text-[color:var(--neon-magenta)]'
      : timerState.sessionType === 'break'
        ? 'neon-panel-cyan text-[color:var(--neon-cyan)]'
        : 'neon-panel-yellow text-[color:var(--neon-yellow)]';

  return (
    <div className="relative h-dvh w-screen flex flex-col overflow-hidden">
      <div className="arcade-bg" />
      <CursorFX />
      <div className="crt-overlay" />

      <div className="relative z-10 flex flex-col h-full min-h-0">
        <Header />

        <main className="flex-1 min-h-0 overflow-hidden px-3 sm:px-5 py-3">
          <div className="h-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 min-h-0">
            {/* Timer column */}
            <div className="flex flex-col min-h-0 items-center justify-center gap-3 sm:gap-4 overflow-y-auto py-1">
              {/* Active quest strip */}
              {activeTodo && (
                <div className="w-full max-w-md neon-panel px-3 py-2 flex items-center gap-2 text-xs font-terminal shrink-0">
                  <span className="text-[color:var(--neon-magenta)]">▶</span>
                  <span className="flex-1 truncate text-[color:var(--foreground)]">{activeTodo.text}</span>
                  <span className="text-[color:var(--muted-foreground)] whitespace-nowrap">
                    {activeTodo.completedPomodoros}/{activeTodo.estimatedPomodoros}🍅
                  </span>
                </div>
              )}

              {/* Timer Panel */}
              <div className={clsx('hud-corners w-full max-w-md px-6 sm:px-10 py-5 sm:py-7 shrink-0', sessionAccent)}>
                <span className="hud-tr" />
                <span className="hud-br" />
                <TimerDisplay timerState={timerState} />
              </div>

              {/* Controls */}
              <div className="shrink-0">
                <TimerControls
                  timerState={timerState}
                  onStart={startTimer}
                  onPause={pauseTimer}
                  onReset={resetTimer}
                  onSkip={skipSession}
                  onNext={startNextSession}
                />
              </div>

              {/* Settings row */}
              <div className="flex items-center justify-center gap-3 shrink-0">
                <TimerSettings
                  ref={timerSettingsRef}
                  config={config}
                  onConfigChange={updateConfig}
                  soundEnabled={soundEnabled}
                  onToggleSound={handleToggleSound}
                />

                <StatsSummary
                  ref={statsSummaryRef}
                  today={today}
                  allTime={allTime}
                  recentDays={recentDays}
                  onResetStats={resetStats}
                />

                {/* Hard Reset - wipes round progress back to Round 1 */}
                <button
                  onClick={handleHardReset}
                  className="arcade-btn w-12 h-12 rounded-none bg-[color:var(--neon-red)]/10 text-[color:var(--neon-red)] hover:bg-[color:var(--neon-red)]/20 flex items-center justify-center"
                  title="Hard Reset (back to Round 1)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current">
                    <path d="M11 19V5l-9 7 9 7z" fill="currentColor"/>
                    <path d="M22 19V5l-9 7 9 7z" fill="currentColor"/>
                  </svg>
                </button>

                {/* Quest Log toggle - mobile only */}
                <button
                  onClick={() => setShowTodos(true)}
                  className="arcade-btn w-12 h-12 rounded-none bg-[color:var(--neon-yellow)]/10 text-[color:var(--neon-yellow)] hover:bg-[color:var(--neon-yellow)]/20 flex items-center justify-center lg:hidden"
                  title="Quest Log"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current">
                    <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Todo sidebar - desktop only, mobile uses overlay below */}
            <div className="hidden lg:flex min-h-0">
              <TodoList />
            </div>
          </div>
        </main>

        {/* Footer: control legend */}
        <footer className="shrink-0 border-t-2 border-[color:var(--neon-magenta)]/30 bg-[color:var(--chrome-bg)] px-2 sm:px-6 py-1.5 transition-colors duration-300">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-1 text-[8px] sm:text-[11px] font-arcade uppercase text-[color:var(--muted-foreground)]">
            <span><kbd className="text-[color:var(--neon-cyan)]">SPACE</kbd> Start/Pause</span>
            <span><kbd className="text-[color:var(--neon-green)]">R</kbd> Reset</span>
            <span><kbd className="text-[color:var(--neon-yellow)]">S</kbd> Skip</span>
            <span><kbd className="text-[color:var(--neon-red)]">T</kbd> Hard Reset</span>
            <span><kbd className="text-[color:var(--neon-green)]">W</kbd> Stats</span>
            <span><kbd className="text-[color:var(--neon-magenta)]">Q</kbd> Settings</span>
            <span><kbd className="text-[color:var(--neon-cyan)]">A</kbd> Sound</span>
            <span className="hidden sm:inline">POMODOJO</span>
          </div>
        </footer>
      </div>

      {/* Mobile Quest Log overlay */}
      {showTodos && (
        <div className="fixed inset-0 z-50 flex lg:hidden p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowTodos(false)} />
          <div className="relative z-10 flex flex-col w-full min-h-0">
            <button
              onClick={() => setShowTodos(false)}
              className="arcade-btn self-end w-10 h-10 mb-2 rounded-none bg-[color:var(--neon-red)]/10 text-[color:var(--neon-red)] hover:bg-[color:var(--neon-red)]/20 flex items-center justify-center shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="flex-1 min-h-0">
              <TodoList />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
