import Image from 'next/image';
import Link from 'next/link';
import { mainNavigation, siteConfig } from '@/lib/site';
import { HeaderNav } from '@/components/HeaderNav';

export function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="shell site-header-inner">
        <Link href="/#inicio" className="brand" aria-label="Ir al inicio de INTEVOPEDI">
          <Image src="/Logo.png" alt="INTEVOPEDI" width={64} height={64} priority />
          <div>
            <strong>{siteConfig.name}</strong>
            <span>{siteConfig.tagline}</span>
          </div>
        </Link>
        <HeaderNav navigation={mainNavigation} />
      </div>
    </header>
  );
}
