import { DashboardView } from "@/components/dashboard-view";
import { getDashboard } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const data = await getDashboard();
  return <DashboardView data={data} />;
}
