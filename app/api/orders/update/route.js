import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // 1. ดึงค่ามาพักไว้ในตัวแปร (ชื่อต้องตรงกับที่จะใช้ข้างล่าง)
    const orderId = body.id;
    const status = body.status; // ใช้ชื่อ status ให้ตรงกับใน array [ ] ด้านล่าง
    const adminName = body.adminName || "Admin_A";

    const query = `
      UPDATE orders 
      SET status = ?, 
          updated_by = ?, 
          updated_at = NOW() 
      WHERE id = ?
    `;

    // 2. ลำดับใน [ ] ต้องตรงกับ ? ใน query: status -> ?, adminName -> ?, orderId -> ?
    const [result] = await db.query(query, [status, adminName, orderId]);

    // 3. ตรวจสอบว่ามีแถวที่ถูกแก้ไขจริงไหม
    if (result && result.affectedRows > 0) {
      return Response.json({ success: true });
    } else {
      return Response.json({ 
        success: false, 
        error: "ไม่พบรายการสั่งซื้อที่ระบุ (ID อาจไม่ตรงในระบบ)" 
      });
    }

  } catch (error) {
    console.error("Update Error:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}