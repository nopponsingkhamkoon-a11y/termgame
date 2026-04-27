import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { id, status, adminName } = await req.json();

    const query = `
      UPDATE orders 
      SET status = ?, 
          updated_by = ?, 
          updated_at = NOW() 
      WHERE id = ?
    `;

    // ลำดับต้องเป๊ะ: [สถานะ, ชื่อแอดมิน, ID ของออเดอร์]
    const [result] = await db.query(query, [status, adminName || "System Admin", id]);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}