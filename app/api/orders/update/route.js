import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { id, status, adminName } = await req.json();

    // บังคับว่าถ้าไม่มีชื่อส่งมา ให้ใส่ Admin_System ไปก่อนเพื่อทดสอบ
    const finalAdmin = adminName || "Admin_System";

    const query = `
      UPDATE orders 
      SET status = ?, 
          updated_by = ?, 
          updated_at = NOW() 
      WHERE id = ?
    `;

    // ลำดับต้องเป๊ะ: [1.สถานะ, 2.ชื่อ, 3.ID]
    const [result] = await db.query(query, [status, finalAdmin, id]);

    return Response.json({ success: true, affected: result.affectedRows });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}