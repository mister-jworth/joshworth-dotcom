import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';

export const metadata = {
  title: {
    default: 'Josh Worth Art & Design – Creative direction for the interactive age',
    template: '%s – Josh Worth Art & Design',
  },
  description:
    'Artifacts from my expeditions in the world of design, art and ideas. Portfolio, writings, and interactive projects by Josh Worth.',
  icons: { icon: '/uploads/2019/09/logosmall19-72.png' },
  openGraph: {
    siteName: 'Josh Worth Art & Design',
    images: ['/uploads/2019/09/logomark19-web@0.5x.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Hoefler&Co webfonts (Surveyor SSm, Gotham, Idlewild SSm) — same CSS key
            as the old site. Add the new domain(s) at cloud.typography.com so the
            fonts are served; free fallbacks below cover the gap. */}
        <link rel="stylesheet" href="https://cloud.typography.com/7991154/7229812/css/fonts.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..700&family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
