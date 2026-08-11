import { getStockByUser } from "@/controllers/stockController";
import { withAuth } from "@/lib/api/withAuth";

async function handler(_request, user) {
  const result = await getStockByUser(user.idusuario);

  if (!result.ok) {
    return Response.json({ error: result.message }, { status: result.status });
  }

  return Response.json({ data: result.data });
}

export const GET = withAuth(handler);
