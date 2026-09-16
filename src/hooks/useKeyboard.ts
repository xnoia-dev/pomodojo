import { useEffect } from 'react';
import { KEYBOARD_SHORTCUTS } from '@/lib/constants';

interface UseKeyboardProps {
  onStartPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onHardReset?: () => void;
  onSummarize?: () => void;
  onSettings?: () => void;
  onAudioToggle?: () => void;
  enabled?: boolean;
}

export function useKeyboard({
  onStartPause,
  onReset,
  onSkip,
  onHardReset,
  onSummarize,
  onSettings,
  onAudioToggle,
  enabled = true
}: UseKeyboardProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in input fields
      if (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Don't trigger shortcuts when modal is open
      if (document.querySelector('[role="dialog"]') ||
          document.querySelector('.fixed.inset-0')) {
        return;
      }

      switch (event.key) {
        case KEYBOARD_SHORTCUTS.START_PAUSE:
          event.preventDefault();
          onStartPause();
          break;
        case KEYBOARD_SHORTCUTS.RESET:
          event.preventDefault();
          onReset();
          break;
        case KEYBOARD_SHORTCUTS.SKIP:
          event.preventDefault();
          onSkip();
          break;
        case KEYBOARD_SHORTCUTS.HARD_RESET:
          event.preventDefault();
          if (onHardReset) {
            onHardReset();
          }
          break;
        case KEYBOARD_SHORTCUTS.SUMMARIZE:
          event.preventDefault();
          if (onSummarize) {
            onSummarize();
          }
          break;
        case KEYBOARD_SHORTCUTS.SETTINGS:
          event.preventDefault();
          if (onSettings) {
            onSettings();
          }
          break;
        case KEYBOARD_SHORTCUTS.AUDIO:
          event.preventDefault();
          if (onAudioToggle) {
            onAudioToggle();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onStartPause, onReset, onSkip, onHardReset, onSummarize, onSettings, onAudioToggle, enabled]);
}
