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
    let frame = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateThread = () => {
      frame = 0;
      if (reduce) {
        gallery.style.setProperty('--thread-progress', '1');
        return;
      }

      const rect = gallery.getBoundingClientRect();
      const start = window.innerHeight * 0.78;
      const travel = Math.max(rect.height + window.innerHeight * 0.18, 1);
      const progress = Math.min(1, Math.max(0, (start - rect.top) / travel));
      gallery.style.setProperty('--thread-progress', progress.toFixed(4));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateThread);
    };

    updateThread();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <section className="featured-block" aria-label="Featured artwork carousel">
        <div className="featured-topline">
          <div>
            <span className="eyebrow">Moving exhibition</span>
            <p>Swipe, drag, or use the arrows.</p>
          </div>
          <div className="carousel-controls" aria-label="Carousel controls">
            <button type="button" onClick={() => goTo(current - 1)} aria-label="Previous artwork">←</button>
            <span aria-live="polite">{String(current + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => goTo(current + 1)} aria-label="Next artwork">→</button>
          </div>
        </div>

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
                    sizes="(max-width: 700px) 84vw, 68vw"
                    className="featured-image"
                    priority={index < 2}
                  />
                </span>
              </button>
              <div className="featured-caption">
                <span>{work.title}</span>
                <span>{work.medium}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="thread-intro">
        <span className="eyebrow">The thread</span>
        <p>A single line moves through the works — one imagination, many little worlds.</p>
      </div>

      <div className="thread-gallery" ref={threadRef}>
        <svg className="thread-line" viewBox="0 0 1000 3600" preserveAspectRatio="none" aria-hidden="true">
          <path
            className="thread-path thread-path-shadow"
            pathLength="1"
            d="M510 0 C735 160 735 330 545 450 C350 575 315 755 560 880 C790 995 790 1180 535 1295 C300 1405 300 1580 540 1705 C785 1830 755 2020 500 2135 C255 2250 310 2455 575 2565 C815 2670 770 2860 515 2980 C275 3095 330 3330 520 3600"
          />
          <path
            className="thread-path"
            pathLength="1"
            d="M510 0 C735 160 735 330 545 450 C350 575 315 755 560 880 C790 995 790 1180 535 1295 C300 1405 300 1580 540 1705 C785 1830 755 2020 500 2135 C255 2250 310 2455 575 2565 C815 2670 770 2860 515 2980 C275 3095 330 3330 520 3600"
          />
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
            </span>
          </button>
        ))}
      </div>

      <Lightbox active={active} works={works} onClose={closeLightbox} onChange={changeLightbox} />
    </>
  );
}
