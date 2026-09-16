import { useState } from 'react';
import { Todo } from '@/types/todo';

interface TodoAddFormProps {
  onAddTodo: (text: string, priority: Todo['priority'], estimatedPomodoros: number) => void;
}

export function TodoAddForm({ onAddTodo }: TodoAddFormProps) {
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<Todo['priority']>('medium');
  const [newTodoPomodoros, setNewTodoPomodoros] = useState(1);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      onAddTodo(newTodoText, newTodoPriority, newTodoPomodoros);
      setNewTodoText('');
      setNewTodoPomodoros(1);
    }
  };

  return (
    <div className="p-3 bg-[color:var(--inset-bg)] border border-[color:var(--neon-cyan)]/30">
      <div className="space-y-3">
        {/* Main Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="> new quest..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            className="w-full h-10 px-3 bg-[color:var(--inset-bg)] border-2 border-[color:var(--neon-cyan)]/40 text-lg font-terminal text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:border-[color:var(--neon-cyan)] transition-colors duration-150"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2">
          {/* Priority Selector */}
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-arcade uppercase text-[color:var(--muted-foreground)]">
              Priority
            </label>
            <div className="relative">
              <select
                value={newTodoPriority}
                onChange={(e) => setNewTodoPriority(e.target.value as Todo['priority'])}
                className="appearance-none h-7 pl-2 pr-6 bg-[color:var(--inset-bg)] border border-[color:var(--neon-cyan)]/40 text-xs font-arcade text-[color:var(--foreground)] focus:outline-none focus:border-[color:var(--neon-cyan)] cursor-pointer"
              >
                <option value="low">LOW</option>
                <option value="medium">MED</option>
                <option value="high">HIGH</option>
              </select>
            </div>
          </div>

          {/* Pomodoros Input */}
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-arcade uppercase text-[color:var(--muted-foreground)]">
              Pomodoros
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={newTodoPomodoros}
              onChange={(e) => setNewTodoPomodoros(parseInt(e.target.value) || 1)}
              className="w-16 h-7 px-2 bg-[color:var(--inset-bg)] border border-[color:var(--neon-cyan)]/40 text-xs font-arcade text-[color:var(--foreground)] text-center focus:outline-none focus:border-[color:var(--neon-cyan)]"
            />
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddTodo}
          disabled={!newTodoText.trim()}
          className="arcade-btn h-9 w-full bg-[color:var(--neon-magenta)]/10 text-[color:var(--neon-magenta)] hover:bg-[color:var(--neon-magenta)]/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-current">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-[11px]">Add Task</span>
        </button>
      </div>
    </div>
  );
}
