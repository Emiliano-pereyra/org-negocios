import {
  createStockProducts,
  deleteStockProduct,
  getStockByUser,
  updateStockProduct,
} from "@/controllers/stockController";
import { withAuth } from "@/lib/api/withAuth";

async function getHandler(_request, user) {
  const result = await getStockByUser(user.idusuario);

  if (!result.ok) {
    return Response.json({ error: result.message }, { status: result.status });
  }

  return Response.json({ data: result.data, fromCache: Boolean(result.fromCache) });
}

async function postHandler(request, user) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Cuerpo de peticion invalido." }, { status: 400 });
  }

  const result = await createStockProducts(user.idusuario, body?.products);

  if (!result.ok) {
    return Response.json({ error: result.message }, { status: result.status });
  }

  return Response.json({
    data: result.data,
    cache: result.cache ?? null,
  });
}

async function putHandler(request, user) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Cuerpo de peticion invalido." }, { status: 400 });
  }

  const result = await updateStockProduct(user.idusuario, body?.product);

  if (!result.ok) {
    return Response.json({ error: result.message }, { status: result.status });
  }

  return Response.json({
    data: result.data,
    cache: result.cache ?? null,
  });
}

async function deleteHandler(request, user) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Cuerpo de peticion invalido." }, { status: 400 });
  }

  const result = await deleteStockProduct(user.idusuario, body?.id);

  if (!result.ok) {
    return Response.json({ error: result.message }, { status: result.status });
  }

  return Response.json({
    data: result.data,
    cache: result.cache ?? null,
  });
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
export const PUT = withAuth(putHandler);
export const DELETE = withAuth(deleteHandler);
