import Image from 'next/image';
import Gallery from '../components/Gallery';
import AmbientLight from '../components/AmbientLight';

const works = [
  { src: '/art/cottage-garden.jpg', title: 'Garden House', medium: 'Watercolor on paper', alt: 'Watercolor of a flower-covered cottage and stone path', width: 1683, height: 2048 },
  { src: '/art/dreamscape.jpg', title: 'Memory Field', medium: 'Acrylic on canvas', alt: 'Colorful dreamlike painting with butterflies, hills and small figures', width: 2048, height: 1607 },
  { src: '/art/winter-river.jpg', title: 'Winter River', medium: 'Acrylic on canvas', alt: 'Winter landscape with snow, river, trees and a lit house', width: 1916, height: 1551 },
  { src: '/art/flower-shop.jpg', title: 'Flower Shop', medium: 'Watercolor on paper', alt: 'Watercolor illustration of a flower shop with bicycle and plants', width: 1536, height: 2048 },
  { src: '/art/heritage-door.jpg', title: 'The Painted Door', medium: 'Acrylic on canvas', alt: 'Bright architectural painting of an ornate doorway', width: 1535, height: 2048 },
  { src: '/art/coastal-walk.jpg', title: 'By the Water', medium: 'Watercolor & ink', alt: 'Watercolor scene of a figure walking beside the sea under flowers', width: 1536, height: 2048 },
  { src: '/art/mountain-lake.jpg', title: 'Blue Mountain', medium: 'Acrylic on canvas', alt: 'Mountain and lake landscape painted in blue and green', width: 2048, height: 1625 },
  { src: '/art/quiet-street.jpg', title: 'Quiet Street', medium: 'Watercolor & pencil', alt: 'Delicate watercolor of a narrow old street with flowers and balconies', width: 1536, height: 2048 },
  { src: '/art/evening-gown.jpg', title: 'At the Piano', medium: 'Colored pencil', alt: 'Fashion illustration of a woman in a peach evening gown by a piano', width: 1434, height: 2048 },
  { src: '/art/spiderman.jpg', title: 'After the Mask', medium: 'Acrylic on canvas', alt: 'Painted portrait of a superhero-inspired figure resting beside a small framed image', width: 2048, height: 1536 },
  { src: '/art/cafe-sketch.jpg', title: 'June Afternoon', medium: 'Watercolor & pencil', alt: 'Sketch of a woman sitting at a cafe table beneath pink blossoms', width: 1899, height: 2047 },
  { src: '/art/dragonfly.jpg', title: 'Dragonfly Study', medium: 'Watercolor on paper', alt: 'Soft blue watercolor study of a dragonfly', width: 1536, height: 2048 },
  { src: '/art/star-friends.jpg', title: 'Under the Stars', medium: 'Digital illustration', alt: 'Two soft animal characters holding sparklers beneath a pastel starry sky', width: 945, height: 2048 },
  { src: '/art/star-rabbit.jpg', title: 'A Small Wish', medium: 'Digital illustration', alt: 'Rabbit character holding a glowing star beneath shooting stars', width: 945, height: 2048 },
  { src: '/art/sunset-sea.jpg', title: 'Afterglow', medium: 'Acrylic on canvas', alt: 'Orange sunset over the sea with dark rocks', width: 1280, height: 961 }
];

const studio = [
  { src: '/studio/studio-sunset.jpg', alt: 'A small sunset painting on an artist desk beside paint palette', width: 1440, height: 1920 },
  { src: '/studio/studio-green.jpg', alt: 'Work in progress on a desk with brushes, palette and cat-shaped lamp', width: 1536, height: 2048 },
  { src: '/studio/studio-door.jpg', alt: 'Colorful architectural painting beside a paint palette', width: 1536, height: 2048 },
  { src: '/studio/studio-pair.jpg', alt: 'Two paintings arranged with brushes on a textured surface', width: 2048, height: 1540 }
];

export default function Home() {
  return (
    <main>
      <AmbientLight />

      <header className="site-header">
        <a href="#top" className="brand" aria-label="Sumedha Bhargava portfolio home">
          <span className="brand-name">Sumedha Bhargava</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="#works">Works</a>
          <a href="#studio">Studio</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker">ART &amp; ILLUSTRATION · 2026</div>
        <h1>
          <span>Little</span>
          <span className="hero-indent">worlds.</span>
        </h1>
        <div className="hero-collage" aria-hidden="true">
          <div className="hero-frame hero-frame-a">
            <Image src="/art/quiet-street.jpg" alt="" fill sizes="28vw" priority className="cover-image" />
          </div>
          <div className="hero-frame hero-frame-b">
            <Image src="/art/dreamscape.jpg" alt="" fill sizes="34vw" priority className="cover-image" />
          </div>
          <div className="hero-frame hero-frame-c">
            <Image src="/art/flower-shop.jpg" alt="" fill sizes="20vw" priority className="cover-image" />
          </div>
        </div>
        <div className="hero-foot">
          <p>Paintings, watercolor studies, drawings and imagined places.</p>
          <a href="#works" className="round-link">Explore ↓</a>
        </div>
      </section>

      <section className="intro-strip">
        <p>A collection of quiet rooms, distant skies, small wishes and places that feel a little like memory.</p>
      </section>

      <section className="works-section" id="works">
        <div className="section-head">
          <div>
            <span className="section-index">01</span>
            <h2>Selected works</h2>
          </div>
          <p>Watercolor · Acrylic · Drawing · Digital</p>
        </div>
        <Gallery works={works} />
      </section>

      <section className="feature-quote" aria-label="Quote about art">
        <span className="quote-small">A thought on art</span>
        <p>“I paint flowers so they will not die.”</p>
        <span className="quote-note">— Frida Kahlo</span>
      </section>

      <section className="studio-section" id="studio">
        <div className="studio-glow" aria-hidden="true" />
        <div className="section-head section-head-light">
          <div>
            <span className="section-index">02</span>
            <h2>In the studio</h2>
          </div>
          <p>Process, color, experiments.</p>
        </div>
        <div className="studio-grid">
          {studio.map((photo, index) => (
            <figure className={`studio-photo studio-photo-${index + 1}`} key={photo.src}>
              <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 760px) 92vw, 45vw" />
            </figure>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-label">
          <span className="section-index">03</span>
          <span>About</span>
        </div>
        <div className="about-copy">
          <h2>About the artist.</h2>
          <p>Artist bio to be described and updated.</p>
          <p className="about-subtle">This section will be completed once the preferred bio and artist statement are ready.</p>
        </div>
        <div className="contact-card">
          <span>For commissions, collaborations &amp; hello</span>
          <a href="mailto:hello@example.com">hello@example.com ↗</a>
          <a href="#">Instagram ↗</a>
        </div>
      </section>

      <footer>
        <div>SUMEDHA BHARGAVA</div>
        <div>ART &amp; ILLUSTRATION</div>
        <div>© 2026</div>
      </footer>
    </main>
  );
}
