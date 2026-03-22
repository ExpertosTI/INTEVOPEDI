import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToastProvider } from '@/components/ToastProvider';
import { siteConfig } from '@/lib/site';
import '@/app/globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb'
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
  },
  manifest: '/manifest.json'
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
    <html lang="es-DO" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('intevopedi_theme');
                  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="site-body">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <ToastProvider>
          <Header />
          <main id="main-content" tabIndex="-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
