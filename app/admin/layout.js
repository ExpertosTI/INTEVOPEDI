import { AdminFloatingAssistant } from '@/components/AdminFloatingAssistant';
import { requireAdmin } from '@/lib/admin-auth';
import { getAdminDashboardData } from '@/lib/data';

export const metadata = {
  title: 'Admin | INTEVOPEDI'
};

export default async function AdminLayout({ children }) {
  await requireAdmin();
  const data = await getAdminDashboardData();

  return (
    <>
      {children}
      <AdminFloatingAssistant courses={data.courses} />
    </>
  );
}
