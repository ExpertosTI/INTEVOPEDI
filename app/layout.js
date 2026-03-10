import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/lib/site';
import '@/app/globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c4a8a'
};

export const metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: 'INTEVOPEDI | Cursos accesibles y certificados verificables',
    template: '%s | INTEVOPEDI'
  },
  description: 'App moderna de cursos accesibles para INTEVOPEDI con inscripciones, progreso, portafolios y certificados PDF verificables por QR.',
  applicationName: 'INTEVOPEDI',
  category: 'education',
  referrer: 'strict-origin-when-cross-origin',
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'INTEVOPEDI | Cursos accesibles y certificados verificables',
    description: 'Formación inclusiva con inscripciones persistentes, verificación pública y experiencia moderna para participantes.',
    url: siteConfig.baseUrl,
    siteName: 'INTEVOPEDI',
    locale: 'es_DO',
    type: 'website',
    images: [
      {
        url: '/Logo.png',
        width: 512,
        height: 512,
        alt: 'INTEVOPEDI'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INTEVOPEDI | Cursos accesibles y certificados verificables',
    description: 'Plataforma moderna de formación inclusiva con certificados validables por QR.',
    images: ['/Logo.png']
  },
  icons: {
    icon: '/Logo.png',
    apple: '/Logo.png'
  }
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: siteConfig.name,
    url: siteConfig.baseUrl,
    logo: `${siteConfig.baseUrl}/Logo.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DO',
      streetAddress: siteConfig.address
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contactPhone,
      contactType: 'customer service'
    }
  };

  return (
    <html lang="es-DO">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="site-body">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <Header />
        <main id="main-content" tabIndex="-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
