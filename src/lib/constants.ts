import { TimerConfig } from '@/types/timer';

export const DEFAULT_TIMER_CONFIG: TimerConfig = {
  focusTime: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsUntilLongBreak: 4,
};

export const STORAGE_KEYS = {
  TIMER_CONFIG: 'pomodoro_config',
  TIMER_STATE: 'pomodoro_state',
  SESSION_STATS: 'pomodoro_stats',
  THEME: 'pomodoro_theme',
  SOUND_ENABLED: 'pomodoro_sound',
  TODOS: 'pomodoro_todos',
  PLAYER_NAME: 'pomodoro_player_name',
} as const;

export const KEYBOARD_SHORTCUTS = {
  START_PAUSE: ' ', // Space
  RESET: 'r',
  SKIP: 's',
  HARD_RESET: 't',
  SUMMARIZE: 'w',
  SETTINGS: 'q',
  AUDIO: 'a',
} as const;