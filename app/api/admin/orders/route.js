import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM orders ORDER BY id DESC");
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}