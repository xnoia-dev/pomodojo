import { TimerState } from '@/types/timer';
import { clsx } from 'clsx';

interface TimerDisplayProps {
  timerState: TimerState;
}

export function TimerDisplay({ timerState }: TimerDisplayProps) {
  const minutes = Math.floor(timerState.timeRemaining / 60);
  const seconds = timerState.timeRemaining % 60;

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  const getSessionTitle = () => {
    switch (timerState.sessionType) {
      case 'focus':
        return 'Focus Time';
      case 'break':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Timer';
    }
  };

  const getSessionTextClass = () => {
    switch (timerState.sessionType) {
      case 'focus':
        return 'neon-text-magenta';
      case 'break':
        return 'neon-text-cyan';
      case 'longBreak':
        return 'neon-text-yellow';
      default:
        return 'neon-text-magenta';
    }
  };

  const getProgressPercentage = () => {
    const totalTime = (() => {
      switch (timerState.sessionType) {
        case 'focus':
          return timerState.config.focusTime * 60;
        case 'break':
          return timerState.config.shortBreak * 60;
        case 'longBreak':
          return timerState.config.longBreak * 60;
        default:
          return timerState.config.focusTime * 60;
      }
    })();

    return ((totalTime - timerState.timeRemaining) / totalTime) * 100;
  };

  return (
    <div className="text-center flex flex-col items-center gap-3">
      {/* Session Type */}
      <div>
        <h1 className={clsx('text-lg sm:text-xl font-arcade timer-title', getSessionTextClass())}>
          {getSessionTitle()}<span className="blink">_</span>
        </h1>
        <p className="text-[color:var(--muted-foreground)] font-terminal text-lg tracking-widest uppercase mt-1">
          Round {timerState.currentSession} :: {timerState.totalSessions} cleared
        </p>
      </div>

      {/* Timer Circle */}
      <div className={clsx('relative w-52 h-52 sm:w-60 sm:h-60 mx-auto', getSessionTextClass())}>
        <svg className="w-full h-full transform -rotate-90 timer-circle" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-15"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
            className="transition-all duration-1000 ease-in-out"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
          />
        </svg>

        {/* Timer Text - Centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={clsx(
              'text-4xl sm:text-5xl timer-text leading-none',
              timerState.status === 'running' ? 'animate-pulse' : ''
            )}
          >
            {formatTime(minutes)}:{formatTime(seconds)}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm text-[color:var(--muted-foreground)] font-arcade uppercase tracking-wide">
          [ {timerState.status} ]
        </div>

        {timerState.status === 'completed' && (
          <div className="neon-panel-cyan rounded-none px-4 py-2 hud-corners text-cyan-300">
            <span className="hud-tr" />
            <span className="hud-br" />
            <p className="text-sm font-arcade neon-text-cyan">
              LEVEL CLEAR!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
