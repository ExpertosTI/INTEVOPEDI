import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { HeaderNav } from '@/components/HeaderNav';

export function Header() {
  return (
    <header className="ea-nav-header" role="banner">
      <div className="shell ea-nav-inner">
        <Link href="/" className="ea-brand" aria-label="INTEVOPEDI Academy">
          <div className="ea-brand-logo-wrap">
            <Image src="/Logo.png" alt="INTEVOPEDI" width={42} height={42} priority />
          </div>
          <div className="ea-brand-text">
            <span className="ea-brand-title">INTEVOPEDI</span>
            <span className="ea-brand-subtitle">Academy</span>
          </div>
        </Link>

        <HeaderNav />
      </div>
    </header>
  );
}
