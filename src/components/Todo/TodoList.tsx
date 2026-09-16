import { useState } from 'react';
import { Todo } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
import { TodoAddForm } from './TodoAddForm';
import { TodoItem } from './TodoItem';
import { TodoActiveDisplay } from './TodoActiveDisplay';

interface TodoListProps {
  onActiveTodoChange?: (todo: Todo | null) => void;
}

export function TodoList({ onActiveTodoChange }: TodoListProps) {
  const [showCompleted, setShowCompleted] = useState(false);

  const {
    addTodo,
    updateTodo,
    deleteTodo,
    setActiveTodo,
    getPendingTodos,
    getCompletedTodos,
    activeTodo,
  } = useTodos();

  const pendingTodos = getPendingTodos();
  const completedTodos = getCompletedTodos();

  const handleAddTodo = (text: string, priority: Todo['priority'], estimatedPomodoros: number) => {
    addTodo(text, priority, estimatedPomodoros);
  };

  const handleToggleComplete = (todo: Todo) => {
    updateTodo(todo.id, { completed: !todo.completed });
    if (activeTodo === todo.id) {
      setActiveTodo(null);
      onActiveTodoChange?.(null);
    }
  };

  const handleSetActive = (todo: Todo) => {
    const newActiveTodo = activeTodo === todo.id ? null : todo.id;
    setActiveTodo(newActiveTodo);
    onActiveTodoChange?.(newActiveTodo ? todo : null);
  };

  const currentActiveTodo = pendingTodos.find((t) => t.id === activeTodo) ?? null;

  return (
    <div className="neon-panel-cyan hud-corners h-full flex flex-col min-h-0 text-[color:var(--neon-cyan)]">
      <span className="hud-tr" />
      <span className="hud-br" />

      {/* Header */}
      <div className="shrink-0 p-3 border-b border-[color:var(--neon-cyan)]/30 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-arcade neon-text-cyan uppercase truncate">
            Quest Log
          </h3>
          <p className="text-xs font-terminal text-[color:var(--muted-foreground)]">
            {pendingTodos.length} pending
          </p>
        </div>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className={`shrink-0 h-7 px-3 border font-arcade text-[10px] uppercase transition-colors duration-150 ${
            showCompleted
              ? 'bg-[color:var(--neon-cyan)]/20 border-[color:var(--neon-cyan)]/50 text-[color:var(--neon-cyan)]'
              : 'bg-[rgba(var(--overlay-rgb),0.05)] border-[color:var(--hairline)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]'
          }`}
        >
          Done {completedTodos.length > 0 && `(${completedTodos.length})`}
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
        {/* Add Form */}
        <TodoAddForm onAddTodo={handleAddTodo} />

        {/* Active Todo Display */}
        {currentActiveTodo && (
          <TodoActiveDisplay activeTodo={currentActiveTodo} />
        )}

        {/* Pending Todos */}
        <div className="space-y-2">
          {pendingTodos.length === 0 ? (
            <div className="border border-[color:var(--hairline)] bg-[rgba(var(--overlay-rgb),0.05)] p-6 text-center">
              <p className="text-sm font-arcade text-[color:var(--muted-foreground)] uppercase mb-1">
                All Clear
              </p>
              <p className="text-xs font-terminal text-[color:var(--muted-foreground)]">
                No pending quests. Add one above!
              </p>
            </div>
          ) : (
            pendingTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isActive={activeTodo === todo.id}
                onToggleComplete={handleToggleComplete}
                onSetActive={handleSetActive}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>

        {/* Completed Todos */}
        {showCompleted && completedTodos.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-[color:var(--hairline)]">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-arcade text-[10px] uppercase text-[color:var(--neon-green)]">
                Completed
              </h4>
              <div className="flex-1 h-px bg-[color:var(--neon-green)]/30" />
              <span className="text-[10px] font-arcade text-[color:var(--neon-green)]">
                {completedTodos.length}
              </span>
            </div>

            {completedTodos.map((todo) => (
              <div
                key={todo.id}
                className="group relative border border-[color:var(--hairline)] bg-[rgba(var(--overlay-rgb),0.05)]"
              >
                <div className="relative flex items-center gap-3 p-2.5 opacity-60 hover:opacity-90 transition-opacity duration-150">
                  <button
                    onClick={() => handleToggleComplete(todo)}
                    className="relative w-5 h-5 border-2 border-[color:var(--neon-green)] bg-[color:var(--neon-green)]/20 text-[color:var(--neon-green)] flex items-center justify-center flex-shrink-0"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="font-terminal text-[color:var(--muted-foreground)] line-through truncate text-sm">
                      {todo.text}
                    </div>
                    <div className="text-[10px] font-arcade text-[color:var(--muted-foreground)] mt-0.5">
                      {todo.completedPomodoros}/{todo.estimatedPomodoros}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 border border-[color:var(--hairline)] hover:border-[color:var(--neon-red)]/40 hover:bg-[color:var(--neon-red)]/20 text-[color:var(--muted-foreground)] hover:text-[color:var(--neon-red)] transition-all duration-150 flex items-center justify-center"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
