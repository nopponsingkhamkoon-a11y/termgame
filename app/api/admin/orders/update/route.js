import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { id, status } = await req.json();
    await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}