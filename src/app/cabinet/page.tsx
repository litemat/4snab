import { requireSessionUser } from "@/lib/warehouse-session";
import RequestsPage from "../ui/RequestsPage";

export default async function CabinetPage({ searchParams }: { searchParams: Promise<{ view?: string; completed?: string; q?: string }> }) {
  const user = await requireSessionUser();
  return <RequestsPage params={Promise.resolve({ token: user.token })} searchParams={searchParams} basePath="/cabinet" />;
}
