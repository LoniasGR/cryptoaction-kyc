import AdminStatistics from "./admin-statistics";
import AdminTable from "./admin-table";

export function AdminPage() {
  
  return (
    <div className="bg-muted flex min-h-screen w-full flex-col gap-6 px-4 py-6 lg:px-8">
      <AdminStatistics />
      <AdminTable />
    </div>
  );
}
