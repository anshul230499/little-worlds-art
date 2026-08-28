'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Gallery({ works }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (event) => {
      if (event.key === 'Escape') setActive(null);
      if (event.key === 'ArrowRight') {
        const index = works.findIndex((work) => work.src === active.src);
        setActive(works[(index + 1) % works.length]);
      }
      if (event.key === 'ArrowLeft') {
        const index = works.findIndex((work) => work.src === active.src);
        setActive(works[(index - 1 + works.length) % works.length]);
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-open');
    };
  }, [active, works]);

  return (
    <>
      <div className="gallery-grid">
        {works.map((work, index) => (
          <button
            className={`work-card work-${(index % 5) + 1}`}
            key={work.src}
            onClick={() => setActive(work)}
            aria-label={`Open ${work.title}`}
          >
            <span className="work-image-wrap">
              <Image
                src={work.src}
                alt={work.alt}
                width={work.width}
                height={work.height}
                sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 31vw"
                className="work-image"
              />
            </span>
            <span className="work-meta">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{work.title}</span>
              <span>{work.medium}</span>
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.title}>
          <button className="lightbox-backdrop" aria-label="Close artwork" onClick={() => setActive(null)} />
          <div className="lightbox-inner">
            <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Close">×</button>
            <Image
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="90vw"
              className="lightbox-image"
              priority
            />
            <div className="lightbox-caption">
              <span>{active.title}</span>
              <span>{active.medium}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
