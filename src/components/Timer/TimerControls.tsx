import { TimerState } from '@/types/timer';

interface TimerControlsProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onNext?: () => void;
}

export function TimerControls({
  timerState,
  onStart,
  onPause,
  onReset,
  onSkip,
  onNext
}: TimerControlsProps) {
  const canStart = timerState.status === 'idle' || timerState.status === 'paused';
  const canPause = timerState.status === 'running';
  const canReset = timerState.status !== 'idle';
  const canSkip = timerState.status === 'running' || timerState.status === 'paused';
  const showNext = timerState.status === 'completed';

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* Start/Pause Button - Main CTA, big arcade button */}
      {canStart && (
        <button
          onClick={onStart}
          className="arcade-btn group relative w-16 h-16 rounded-full bg-[color:var(--neon-green)]/10 text-[color:var(--neon-green)] hover:bg-[color:var(--neon-green)]/20 flex items-center justify-center"
          title="Start"
        >
          <div
            className="w-0 h-0 border-l-[14px] border-l-current border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent ml-1"
          />
        </button>
      )}

      {canPause && (
        <button
          onClick={onPause}
          className="arcade-btn group relative w-16 h-16 rounded-full bg-[color:var(--neon-red)]/10 text-[color:var(--neon-red)] hover:bg-[color:var(--neon-red)]/20 flex items-center justify-center"
          title="Pause"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-5 bg-current" />
            <div className="w-1.5 h-5 bg-current" />
          </div>
        </button>
      )}

      {/* Secondary Controls */}
      <div className="flex items-center gap-3">
        {canReset && (
          <button
            onClick={onReset}
            className="arcade-btn w-12 h-12 rounded-none bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)] hover:bg-[color:var(--neon-cyan)]/20 flex items-center justify-center"
            title="Reset"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current">
              <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {canSkip && (
          <button
            onClick={onSkip}
            className="arcade-btn w-12 h-12 rounded-none bg-[color:var(--neon-yellow)]/10 text-[color:var(--neon-yellow)] hover:bg-[color:var(--neon-yellow)]/20 flex items-center justify-center"
            title="Skip"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current">
              <polygon points="5,4 15,12 5,20" fill="currentColor"/>
              <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Next Session Button */}
      {showNext && onNext && (
        <button
          onClick={onNext}
          className="arcade-btn relative px-5 py-3 rounded-none bg-[color:var(--neon-magenta)]/10 text-[color:var(--neon-magenta)] hover:bg-[color:var(--neon-magenta)]/20"
        >
          <div className="relative flex items-center gap-2">
            <span className="font-arcade text-xs">Next</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
