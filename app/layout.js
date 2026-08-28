import './globals.css';


export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#efe8dc'
};

export const metadata = {
  title: 'Sumedha Bhargava — Art & Illustration',
  description: 'The art portfolio of Sumedha Bhargava — paintings, watercolor studies, drawings and imagined places.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Sumedha Bhargava — Art & Illustration',
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
