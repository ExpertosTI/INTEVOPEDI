import { verifyParticipantAccount } from '@/app/actions';

export const metadata = {
  title: 'Verificación de cuenta | INTEVOPEDI'
};

export default async function VerifyParticipantPage({ searchParams }) {
  await verifyParticipantAccount(searchParams);
  return null;
}
