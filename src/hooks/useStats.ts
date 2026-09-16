import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import { SessionStats } from '@/types/timer';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyStats(date: string): SessionStats {
  return { date, completedSessions: 0, focusTime: 0, totalTime: 0 };
}

export function useStats() {
  const [statsByDate, setStatsByDate] = useLocalStorage<Record<string, SessionStats>>(
    STORAGE_KEYS.SESSION_STATS,
    {}
  );

  const recordFocusSession = useCallback((focusMinutes: number) => {
    const key = todayKey();
    setStatsByDate(prev => {
      const existing = prev[key] ?? emptyStats(key);
      return {
        ...prev,
        [key]: {
          ...existing,
          completedSessions: existing.completedSessions + 1,
          focusTime: existing.focusTime + focusMinutes,
          totalTime: existing.totalTime + focusMinutes,
        },
      };
    });
  }, [setStatsByDate]);

  const resetStats = useCallback(() => {
    setStatsByDate({});
  }, [setStatsByDate]);

  const today = statsByDate[todayKey()] ?? emptyStats(todayKey());

  const allTime = useMemo(
    () =>
      Object.values(statsByDate).reduce(
        (acc, s) => ({
          completedSessions: acc.completedSessions + s.completedSessions,
          focusTime: acc.focusTime + s.focusTime,
        }),
        { completedSessions: 0, focusTime: 0 }
      ),
    [statsByDate]
  );

  const recentDays = useMemo(
    () => Object.values(statsByDate).sort((a, b) => b.date.localeCompare(a.date)),
    [statsByDate]
  );

  return { today, allTime, recentDays, recordFocusSession, resetStats };
}
