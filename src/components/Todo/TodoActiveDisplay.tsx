import { Todo } from '@/types/todo';

interface TodoActiveDisplayProps {
  activeTodo: Todo;
}

export function TodoActiveDisplay({ activeTodo }: TodoActiveDisplayProps) {
  const getPriorityClass = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-[color:var(--neon-red)] border-[color:var(--neon-red)]/40';
      case 'medium':
        return 'text-[color:var(--neon-yellow)] border-[color:var(--neon-yellow)]/40';
      case 'low':
        return 'text-[color:var(--neon-green)] border-[color:var(--neon-green)]/40';
      default:
        return 'text-[color:var(--muted-foreground)] border-[color:var(--hairline-strong)]';
    }
  };

  return (
    <div className="relative bg-[color:var(--neon-magenta)]/5 border border-[color:var(--neon-magenta)]/40">
      <div className="relative p-3">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 border-2 border-[color:var(--neon-magenta)] flex items-center justify-center flex-shrink-0 text-[color:var(--neon-magenta)]">
            <span className="text-sm">▶</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-arcade neon-text-magenta uppercase tracking-wide">
                Now Playing
              </span>
              <div className="flex-1 h-px bg-[color:var(--neon-magenta)]/30" />
            </div>

            <h3 className="text-sm font-terminal text-[color:var(--foreground)] mb-2 leading-tight break-words">
              {activeTodo.text}
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-arcade text-[color:var(--muted-foreground)]">
                  PROGRESS
                </span>
                <span className="text-sm font-terminal neon-text-magenta">
                  {activeTodo.completedPomodoros}/{activeTodo.estimatedPomodoros} 🍅
                </span>
              </div>

              <div className={`inline-flex items-center px-1.5 py-0.5 border text-[10px] font-arcade uppercase ${getPriorityClass(activeTodo.priority)}`}>
                {activeTodo.priority}
              </div>
            </div>

            <div className="w-full h-1.5 mt-2 bg-[color:var(--inset-bg)] border border-[color:var(--hairline)] overflow-hidden">
              <div
                className="h-full bg-[color:var(--neon-magenta)] transition-all duration-500"
                style={{ width: `${Math.min((activeTodo.completedPomodoros / activeTodo.estimatedPomodoros) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
