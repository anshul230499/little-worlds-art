'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

const tones = [
  '226 188 124',
  '180 198 170',
  '174 199 210',
  '232 188 174',
  '218 167 112',
  '176 200 206',
  '169 193 183',
  '221 195 163',
  '230 177 154',
  '187 187 205',
  '220 188 174',
  '174 202 211',
  '201 188 219',
  '196 190 220',
  '231 168 112'
];

const threadPath = 'M510 0 C735 160 735 330 545 450 C350 575 315 755 560 880 C790 995 790 1180 535 1295 C300 1405 300 1580 540 1705 C785 1830 755 2020 500 2135 C255 2250 310 2455 575 2565 C815 2670 770 2860 515 2980 C275 3095 330 3330 520 3600';

function Lightbox({ active, works, onClose, onChange }) {
  useEffect(() => {
    if (!active) return undefined;

    const onKey = (event) => {
      const index = works.findIndex((work) => work.src === active.src);
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onChange(works[(index + 1) % works.length]);
      if (event.key === 'ArrowLeft') onChange(works[(index - 1 + works.length) % works.length]);
    };

    document.addEventListener('keydown', onKey);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-open');
    };
  }, [active, works, onClose, onChange]);

  if (!active) return null;

  const index = works.findIndex((work) => work.src === active.src);
  const previous = works[(index - 1 + works.length) % works.length];
  const next = works[(index + 1) % works.length];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.title}>
      <button className="lightbox-backdrop" aria-label="Close artwork" onClick={onClose} />
      <div className="lightbox-inner">
        <button className="lightbox-close" onClick={onClose} aria-label="Close">×</button>
        <button className="lightbox-nav lightbox-prev" onClick={() => onChange(previous)} aria-label={`Previous: ${previous.title}`}>←</button>
        <Image
          src={active.src}
          alt={active.alt}
          width={active.width}
          height={active.height}
          sizes="90vw"
          className="lightbox-image"
          priority
        />
        <button className="lightbox-nav lightbox-next" onClick={() => onChange(next)} aria-label={`Next: ${next.title}`}>→</button>
        <div className="lightbox-caption">
          <span>{active.title}</span>
          <span>{active.medium}</span>
          <span className="art-rights">{active.rights}</span>
        </div>
      </div>
    </div>
  );
}

export default function Gallery({ works }) {
  const [active, setActive] = useState(null);
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef(null);
  const slideRefs = useRef([]);
  const threadRef = useRef(null);
  const scrollFrame = useRef(0);
  const featured = useMemo(() => works.slice(0, 9), [works]);

  const closeLightbox = useCallback(() => setActive(null), []);
  const changeLightbox = useCallback((work) => setActive(work), []);

  const applyTone = useCallback((index) => {
    const tone = tones[index % tones.length];
    document.documentElement.style.setProperty('--ambient-tint', tone);
  }, []);

  const goTo = useCallback((index, behavior = 'smooth') => {
    const count = featured.length;
    const nextIndex = (index + count) % count;
    const scroller = carouselRef.current;
    const slide = slideRefs.current[nextIndex];
    if (!scroller || !slide) return;

    const left = slide.offsetLeft - (scroller.clientWidth - slide.clientWidth) / 2;
    scroller.scrollTo({ left, behavior });
    setCurrent(nextIndex);
    applyTone(nextIndex);
  }, [featured.length, applyTone]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => goTo(0, reduce ? 'auto' : 'smooth'), 20);
    return () => window.clearTimeout(timer);
  }, [goTo]);

  useEffect(() => {
    const scroller = carouselRef.current;
    if (!scroller) return undefined;

    const updateCurrent = () => {
      scrollFrame.current = 0;
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let closest = 0;
      let distance = Number.POSITIVE_INFINITY;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
        const delta = Math.abs(center - slideCenter);
        if (delta < distance) {
          distance = delta;
          closest = index;
        }
      });

      setCurrent((previous) => {
        if (previous !== closest) applyTone(closest);
        return closest;
      });
    };

    const onScroll = () => {
      if (scrollFrame.current) return;
      scrollFrame.current = window.requestAnimationFrame(updateCurrent);
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      if (scrollFrame.current) window.cancelAnimationFrame(scrollFrame.current);
    };
  }, [applyTone]);

  useEffect(() => {
    const gallery = threadRef.current;
    if (!gallery) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateThread = () => {
      if (reduce) {
        gallery.style.setProperty('--thread-progress', '1');
        return;
      }

      const rect = gallery.getBoundingClientRect();
      // Keep the illuminated end of the thread close to the viewer's scroll position.
      // This maps viewport position directly to the full gallery height, with a small lead
      // so fast scrolling never makes the line feel like it is catching up.
      const viewportHead = window.innerHeight * 0.82;
      const localHead = viewportHead - rect.top;
      const progress = Math.min(1, Math.max(0, (localHead / Math.max(rect.height, 1)) * 1.22 + 0.035));
      gallery.style.setProperty('--thread-progress', progress.toFixed(4));
    };

    updateThread();
    window.addEventListener('scroll', updateThread, { passive: true });
    window.addEventListener('resize', updateThread);
    return () => {
      window.removeEventListener('scroll', updateThread);
      window.removeEventListener('resize', updateThread);
    };
  }, []);

  return (
    <>
      <section className="featured-block" aria-label="Featured artwork carousel">
        <div className="featured-topline">
          <div>
            <span className="eyebrow">Alpine window</span>
            <p>A moving exhibition set against the mountains. Swipe, drag, or use the arrows.</p>
          </div>
          <div className="carousel-controls" aria-label="Carousel controls">
            <button type="button" onClick={() => goTo(current - 1)} aria-label="Previous artwork">←</button>
            <span aria-live="polite">{String(current + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => goTo(current + 1)} aria-label="Next artwork">→</button>
          </div>
        </div>

        <div className="alps-window-shell">
          <div className="alps-window-view" aria-hidden="true" />
          <div className="alps-window-glass" aria-hidden="true" />
          <div className="featured-carousel" ref={carouselRef}>
            {featured.map((work, index) => (
              <article
                className={`featured-slide ${index === current ? 'is-current' : ''}`}
                key={`featured-${work.src}`}
                ref={(node) => { slideRefs.current[index] = node; }}
              >
                <button type="button" className="featured-art" onClick={() => setActive(work)} aria-label={`Open ${work.title}`}>
                  <span className="featured-image-stage">
                    <Image
                      src={work.src}
                      alt={work.alt}
                      fill
                      sizes="(max-width: 700px) 68vw, (max-width: 1000px) 52vw, 40vw"
                      className="featured-image"
                      priority={index < 2}
                    />
                  </span>
                </button>
                <div className="featured-caption">
                  <span>{work.title}</span>
                  <span>{work.medium}</span>
                  <span className="art-rights">{work.rights}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="alps-window-sill" aria-hidden="true" />
        </div>
      </section>

      <div className="thread-intro">
        <span className="eyebrow">The thread</span>
        <p>A single golden line moves through the works — one imagination, many little worlds.</p>
      </div>

      <div className="thread-gallery" ref={threadRef}>
        <svg className="thread-line" viewBox="0 0 1000 3600" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="threadGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8f6324" />
              <stop offset="28%" stopColor="#f7df8e" />
              <stop offset="52%" stopColor="#c89439" />
              <stop offset="78%" stopColor="#fff0ae" />
              <stop offset="100%" stopColor="#9e6d2b" />
            </linearGradient>
            <filter id="threadGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path className="thread-path-base" d={threadPath} />
          <path className="thread-path thread-path-halo" pathLength="1" d={threadPath} />
          <path className="thread-path thread-path-gold" pathLength="1" d={threadPath} />
          <path className="thread-path thread-path-shine" pathLength="1" d={threadPath} />
        </svg>

        {works.map((work, index) => (
          <button
            className={`work-card work-${(index % 5) + 1}`}
            key={work.src}
            onClick={() => setActive(work)}
            aria-label={`Open ${work.title}`}
          >
            <span className="work-pin" aria-hidden="true" />
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
              <span className="art-rights">{work.rights}</span>
            </span>
          </button>
        ))}
      </div>

      <Lightbox active={active} works={works} onClose={closeLightbox} onChange={changeLightbox} />
    </>
  );
}
