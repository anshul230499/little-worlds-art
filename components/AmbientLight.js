'use client';

import { useEffect } from 'react';

export default function AmbientLight() {
  useEffect(() => {
    const root = document.documentElement;

    const update = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      root.style.setProperty('--page-progress', progress.toFixed(4));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="ambient-canvas" aria-hidden="true">
      <div className="ambient-wash" />
      <div className="natural-light" />
      <div className="paper-grain" />
    </div>
  );
}
