import { AdminFloatingAssistant } from '@/components/AdminFloatingAssistant';
import { getAdminSessionPayload } from '@/lib/admin-auth';
import { getAdminDashboardData } from '@/lib/data';

export const metadata = {
  title: 'Admin | INTEVOPEDI'
};

export default async function AdminLayout({ children }) {
  const session = getAdminSessionPayload();
  let courses = [];
  if (session) {
    const data = await getAdminDashboardData();
    courses = data.courses;
  }

  return (
    <>
      {children}
      {session ? <AdminFloatingAssistant courses={courses} /> : null}
    </>
  );
}
