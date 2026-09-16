import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerState, TimerConfig, SessionType } from '@/types/timer';
import { useLocalStorage } from './useLocalStorage';
import { useAudio } from './useAudio';
import { DEFAULT_TIMER_CONFIG, STORAGE_KEYS } from '@/lib/constants';

interface UseTimerProps {
  onFocusSessionComplete?: (sessionNumber: number) => void;
}

export function useTimer({ onFocusSessionComplete }: UseTimerProps = {}) {
  const [config, setConfig] = useLocalStorage<TimerConfig>(
    STORAGE_KEYS.TIMER_CONFIG,
    DEFAULT_TIMER_CONFIG
  );

  const [timerState, setTimerState] = useState<TimerState>({
    status: 'idle',
    sessionType: 'focus',
    timeRemaining: config.focusTime * 60,
    currentSession: 1,
    totalSessions: 0,
    config,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { playNotification } = useAudio();

  const getSessionDuration = useCallback((sessionType: SessionType, config: TimerConfig): number => {
    switch (sessionType) {
      case 'focus':
        return config.focusTime;
      case 'break':
        return config.shortBreak;
      case 'longBreak':
        return config.longBreak;
      default:
        return config.focusTime;
    }
  }, []);

  const getNextSessionType = useCallback((): SessionType => {
    if (timerState.sessionType === 'focus') {
      const isLongBreakTime = timerState.currentSession % config.sessionsUntilLongBreak === 0;
      return isLongBreakTime ? 'longBreak' : 'break';
    }
    return 'focus';
  }, [timerState.sessionType, timerState.currentSession, config.sessionsUntilLongBreak]);

  const handleSessionComplete = useCallback(() => {
    playNotification();
    
    setTimerState(prev => {
      const newTotalSessions = prev.sessionType === 'focus' ? prev.totalSessions + 1 : prev.totalSessions;
      
      // Call the callback for focus session completion
      if (prev.sessionType === 'focus' && onFocusSessionComplete) {
        onFocusSessionComplete(newTotalSessions);
      }
      
      return {
        ...prev,
        status: 'completed',
        totalSessions: newTotalSessions,
      };
    });

    // Send browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const sessionName = timerState.sessionType === 'focus' ? 'Focus' : 'Break';
      new Notification(`${sessionName} session completed!`, {
        body: 'Ready for the next session?',
        icon: '/pomodojo.png',
      });
    }
  }, [timerState.sessionType, playNotification, onFocusSessionComplete]);

  // Update timer state when config changes
  useEffect(() => {
    if (timerState.status === 'idle') {
      setTimerState(prev => ({
        ...prev,
        config,
        timeRemaining: getSessionDuration(prev.sessionType, config) * 60,
      }));
    }
  }, [config, timerState.status, getSessionDuration]);

  // Timer countdown logic
  useEffect(() => {
    if (timerState.status === 'running' && timerState.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.status, timerState.timeRemaining]);

  // Handle session completion
  useEffect(() => {
    if (timerState.status === 'running' && timerState.timeRemaining === 0) {
      handleSessionComplete();
    }
  }, [timerState.timeRemaining, timerState.status, handleSessionComplete]);

  const startTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, status: 'running' }));
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, status: 'paused' }));
  }, []);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimerState(prev => {
      const correctDuration = getSessionDuration(prev.sessionType, config);
      return {
        ...prev,
        status: 'idle',
        timeRemaining: correctDuration * 60,
      };
    });
  }, [config, getSessionDuration]);

  // Full reset: wipes session/round progress and starts back at Round 1,
  // unlike resetTimer() which only restarts the current session's clock.
  const hardReset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimerState({
      status: 'idle',
      sessionType: 'focus',
      timeRemaining: config.focusTime * 60,
      currentSession: 1,
      totalSessions: 0,
      config,
    });
  }, [config]);

  const skipSession = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // If skipping a focus session, count it as completed for todo progress
    if (timerState.sessionType === 'focus' && onFocusSessionComplete) {
      onFocusSessionComplete(timerState.totalSessions + 1);
    }
    
    const nextSessionType = getNextSessionType();
    const nextSession = timerState.sessionType === 'focus' 
      ? timerState.currentSession + 1 
      : timerState.currentSession;

    setTimerState(prev => ({
      ...prev,
      status: 'idle',
      sessionType: nextSessionType,
      currentSession: nextSession,
      timeRemaining: getSessionDuration(nextSessionType, config) * 60,
      totalSessions: prev.sessionType === 'focus' ? prev.totalSessions + 1 : prev.totalSessions,
    }));
  }, [timerState.sessionType, timerState.currentSession, timerState.totalSessions, config, getNextSessionType, getSessionDuration, onFocusSessionComplete]);

  const startNextSession = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    const nextSessionType = getNextSessionType();
    const nextSession = timerState.sessionType === 'break' || timerState.sessionType === 'longBreak'
      ? timerState.currentSession + 1 
      : timerState.currentSession;

    setTimerState(prev => ({
      ...prev,
      status: 'idle',
      sessionType: nextSessionType,
      currentSession: nextSession,
      timeRemaining: getSessionDuration(nextSessionType, config) * 60,
    }));
  }, [timerState.sessionType, timerState.currentSession, config, getNextSessionType, getSessionDuration]);

  const updateConfig = useCallback((newConfig: Partial<TimerConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
  }, [config, setConfig]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    hardReset,
    skipSession,
    startNextSession,
    updateConfig,
    config,
  };
}