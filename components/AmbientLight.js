'use client';

import { useEffect } from 'react';

export default function AmbientLight() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      root.style.setProperty('--page-progress', progress.toFixed(4));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="ambient-canvas" aria-hidden="true">
      <div className="ambient-wash" />
      <div className="sun-patch sun-patch-one" />
      <div className="sun-patch sun-patch-two" />
      <div className="window-light" />
      <div className="leaf-shadow" />
      <div className="paper-grain" />
    </div>
  );
}
