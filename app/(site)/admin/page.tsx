import { AdminGuard, AdminPanelContent } from "@/components/admin";

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminPanelContent />
    </AdminGuard>
  );
}
