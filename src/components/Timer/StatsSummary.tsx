'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal } from '@/components/ui/Modal';
import { SessionStats } from '@/types/timer';

interface StatsSummaryProps {
  today: SessionStats;
  allTime: { completedSessions: number; focusTime: number };
  recentDays: SessionStats[];
  onResetStats: () => void;
}

export interface StatsSummaryRef {
  openStats: () => void;
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatDateLabel(dateKey: string): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (dateKey === today.toISOString().slice(0, 10)) return 'Today';
  if (dateKey === yesterday.toISOString().slice(0, 10)) return 'Yesterday';

  const d = new Date(`${dateKey}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export const StatsSummary = forwardRef<StatsSummaryRef, StatsSummaryProps>(
  ({ today, allTime, recentDays, onResetStats }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openStats: () => setIsOpen(true)
    }));

    const handleResetStats = () => {
      if (window.confirm('Clear all tracked stats? This cannot be undone.')) {
        onResetStats();
      }
    };

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="arcade-btn w-12 h-12 rounded-none bg-[color:var(--neon-green)]/10 text-[color:var(--neon-green)] hover:bg-[color:var(--neon-green)]/20 flex items-center justify-center"
          title="Stats"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current">
            <path d="M4 20V10M12 20V4M20 20v-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Session Stats" className="max-w-lg">
          <div className="space-y-5">
            {/* Totals */}
            <div className="grid grid-cols-2 gap-3">
              <div className="neon-panel-cyan p-3 text-center">
                <p className="text-[10px] font-arcade uppercase text-[color:var(--muted-foreground)] mb-1.5">
                  Today
                </p>
                <p className="text-2xl font-terminal neon-text-cyan leading-none">
                  {today.completedSessions}
                </p>
                <p className="text-xs font-terminal text-[color:var(--muted-foreground)] mt-1">
                  {formatMinutes(today.focusTime)} focused
                </p>
              </div>
              <div className="neon-panel-yellow p-3 text-center">
                <p className="text-[10px] font-arcade uppercase text-[color:var(--muted-foreground)] mb-1.5">
                  All-Time
                </p>
                <p className="text-2xl font-terminal neon-text-yellow leading-none">
                  {allTime.completedSessions}
                </p>
                <p className="text-xs font-terminal text-[color:var(--muted-foreground)] mt-1">
                  {formatMinutes(allTime.focusTime)} focused
                </p>
              </div>
            </div>

            {/* Recent log */}
            <div>
              <h3 className="text-xs font-arcade uppercase text-[color:var(--muted-foreground)] mb-2">
                Recent Log
              </h3>
              {recentDays.length === 0 ? (
                <p className="text-sm font-terminal text-[color:var(--muted-foreground)]">
                  No sessions logged yet. Complete a focus round to start tracking.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {recentDays.map((day) => (
                    <div
                      key={day.date}
                      className="flex items-center justify-between border border-[color:var(--hairline)] bg-[rgba(var(--overlay-rgb),0.06)] px-3 py-2 text-sm font-terminal"
                    >
                      <span className="text-[color:var(--foreground)]">{formatDateLabel(day.date)}</span>
                      <span className="text-[color:var(--muted-foreground)]">
                        {day.completedSessions} 🍅 &middot; {formatMinutes(day.focusTime)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleResetStats}
                className="arcade-btn h-9 px-4 bg-[color:var(--neon-red)]/10 text-[color:var(--neon-red)] hover:bg-[color:var(--neon-red)]/20 text-[11px]"
              >
                Clear Stats
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
);

StatsSummary.displayName = 'StatsSummary';
