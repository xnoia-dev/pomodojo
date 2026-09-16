'use client';

import { useEffect, useRef } from 'react';

export function CursorFX() {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const reticleRef = useRef<HTMLDivElement | null>(null);
  const raw = useRef({ x: 0, y: 0 });
  const lagged = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reducedMotion) return;

    const handleMove = (e: MouseEvent) => {
      raw.current.x = e.clientX;
      raw.current.y = e.clientY;
      if (!started.current) {
        started.current = true;
        lagged.current.x = e.clientX;
        lagged.current.y = e.clientY;
        glowRef.current?.style.setProperty('opacity', '1');
        reticleRef.current?.style.setProperty('opacity', '1');
      }
    };

    const handleLeave = () => {
      glowRef.current?.style.setProperty('opacity', '0');
      reticleRef.current?.style.setProperty('opacity', '0');
      started.current = false;
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    const tick = () => {
      lagged.current.x += (raw.current.x - lagged.current.x) * 0.16;
      lagged.current.y += (raw.current.y - lagged.current.y) * 0.16;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${raw.current.x - 260}px, ${raw.current.y - 260}px, 0)`;
      }
      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${lagged.current.x - 18}px, ${lagged.current.y - 18}px, 0)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div ref={reticleRef} className="cursor-reticle-wrap" aria-hidden="true">
        <div className="cursor-reticle">
          <svg viewBox="0 0 36 36" width="36" height="36" fill="none">
            <circle cx="18" cy="18" r="11" stroke="currentColor" strokeWidth="1.4" opacity="0.7" />
            <circle cx="18" cy="18" r="1.6" fill="currentColor" />
            <path d="M18 1v6M18 29v6M1 18h6M29 18h6" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>
      </div>
    </>
  );
}
