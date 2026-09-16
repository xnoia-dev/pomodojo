import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  isActive: boolean;
  onToggleComplete: (todo: Todo) => void;
  onSetActive: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, isActive, onToggleComplete, onSetActive, onDelete }: TodoItemProps) {
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

  const progressPercentage = Math.min((todo.completedPomodoros / todo.estimatedPomodoros) * 100, 100);

  return (
    <div
      className={`group relative border transition-all duration-150 ${
        isActive
          ? 'bg-[color:var(--neon-cyan)]/10 border-[color:var(--neon-cyan)]/60'
          : 'bg-[rgba(var(--overlay-rgb),0.05)] border-[color:var(--hairline)] hover:border-[color:var(--hairline-strong)]'
      }`}
    >
      <div className="relative flex items-center gap-3 p-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(todo)}
          className="relative w-5 h-5 border-2 border-[color:var(--muted-foreground)] hover:border-[color:var(--neon-green)] transition-colors duration-150 flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-terminal text-[color:var(--foreground)] text-base leading-tight mb-1 break-words">
            {todo.text}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className={`inline-flex items-center px-1.5 py-0.5 border text-[10px] font-arcade uppercase ${getPriorityClass(todo.priority)}`}>
              {todo.priority}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[color:var(--muted-foreground)] font-terminal">
              <span>{todo.completedPomodoros}/{todo.estimatedPomodoros} 🍅</span>
              <div className="w-14 h-1.5 bg-[color:var(--inset-bg)] border border-[color:var(--hairline)] overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out ${
                    isActive ? 'bg-[color:var(--neon-cyan)]' : 'bg-[color:var(--muted-foreground)]'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
          <button
            onClick={() => onSetActive(todo)}
            className={`relative h-7 px-2 border font-arcade text-[10px] uppercase transition-colors duration-150 ${
              isActive
                ? 'bg-[color:var(--neon-cyan)]/20 text-[color:var(--neon-cyan)] border-[color:var(--neon-cyan)]/50'
                : 'bg-[rgba(var(--overlay-rgb),0.05)] text-[color:var(--muted-foreground)] border-[color:var(--hairline)] hover:text-[color:var(--foreground)]'
            }`}
          >
            {isActive ? 'Pause' : 'Focus'}
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            className="relative w-7 h-7 border border-[color:var(--hairline)] bg-[rgba(var(--overlay-rgb),0.05)] hover:bg-[color:var(--neon-red)]/20 text-[color:var(--muted-foreground)] hover:text-[color:var(--neon-red)] hover:border-[color:var(--neon-red)]/40 transition-colors duration-150 flex items-center justify-center"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
