import { requireSessionUser } from "@/lib/warehouse-session";
import RequestPage from "@/app/ui/RequestPage";

export default async function CabinetRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireSessionUser();
  const { id } = await params;
  return <RequestPage params={Promise.resolve({ token: user.token, id })} basePath="/cabinet" />;
}
