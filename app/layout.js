import './globals.css';

export const metadata = {
  title: 'Studio B. — Art & Illustration',
  description: 'An intimate portfolio of paintings, watercolor studies, drawings and imagined places.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Studio B. — Art & Illustration',
    description: 'Paintings, watercolor studies, drawings and imagined places.',
    type: 'website'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
