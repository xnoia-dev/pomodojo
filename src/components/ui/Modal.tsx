import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="neon-panel flex flex-col max-h-[85vh]">
          {title && (
            <div className="flex items-center justify-between p-4 border-b border-[color:var(--neon-magenta)]/30 shrink-0">
              <h2 className="text-sm font-arcade neon-text-magenta">{title}</h2>
              <button
                onClick={onClose}
                className="arcade-btn w-8 h-8 rounded-none bg-[color:var(--neon-red)]/10 text-[color:var(--neon-red)] hover:bg-[color:var(--neon-red)]/20 flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-current">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}
          <div className="p-5 overflow-y-auto min-h-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
