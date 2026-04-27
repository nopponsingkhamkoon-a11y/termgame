import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { id, status, adminName } = await req.json();

    // บังคับให้เป็น Admin_A ถ้าค่าส่งมาว่าง
    const finalAdmin = adminName || "Admin_A";

    const query = `
      UPDATE orders 
      SET status = ?, 
          updated_by = ?, 
          updated_at = NOW() 
      WHERE id = ?
    `;

    // ใช้ db.query และส่งค่าไปตามลำดับ ?
    const [result] = await db.query(query, [status, finalAdmin, id]);

    if (result.affectedRows === 0) {
      return Response.json({ success: false, error: "ไม่พบรายการที่ระบุ (ID ไม่ตรง)" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}