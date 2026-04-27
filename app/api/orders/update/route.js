import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // ดึงค่าตามชื่อที่ปรากฏใน Payload (id, status, adminName)
    const orderId = body.id;
    const orderStatus = body.status;
    const admin = body.adminName || "Admin_A";

    const query = `
      UPDATE orders 
      SET status = ?, 
          updated_by = ?, 
          updated_at = NOW() 
      WHERE id = ?
    `;

    // ลำดับต้องเรียงตาม ? : status, updated_by, id
    // ใช้ตัวแปรที่ดึงมาข้างบนให้ถูกชื่อ
    const [result] = await db.query(query, [orderStatus, admin, orderId]);

    if (result.affectedRows > 0) {
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false, error: "No rows updated. Check ID." });
    }

  } catch (error) {
    console.error("Update Order Error:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}