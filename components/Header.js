import Image from 'next/image';
import Link from 'next/link';
import { getParticipantSession } from '@/lib/participant-auth';
import { siteConfig } from '@/lib/site';
import { HeaderNav } from '@/components/HeaderNav';

const baseNavigation = [
  { href: '/', label: 'Inicio' },
  { href: '/cursos', label: 'Cursos' },
  { href: '/recursos', label: 'Recursos' },
  { href: '/grupo-atrevete', label: 'Grupo Atrévete' },
  { href: '/verificar', label: 'Verificar certificado' }
];

export async function Header() {
  const participantSession = await getParticipantSession();
  const navigation = [
    ...baseNavigation.slice(0, 2),
    participantSession ? { href: '/campus', label: 'Mi campus' } : { href: '/participantes', label: 'Participantes' },
    ...baseNavigation.slice(2)
  ];

  return (
    <header className="site-header" role="banner">
      <div className="shell site-header-inner">
        <Link href="/" className="brand" aria-label="Ir al inicio de INTEVOPEDI">
          <Image src="/Logo.png" alt="INTEVOPEDI" width={64} height={64} priority />
          <div>
            <strong>{siteConfig.name}</strong>
            <span>{siteConfig.tagline}</span>
          </div>
        </Link>
        <HeaderNav navigation={navigation} />
      </div>
    </header>
  );
}
