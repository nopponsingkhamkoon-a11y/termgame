import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // รับค่าจาก Payload ที่หน้าบ้านส่งมา
    const { id, status, adminName } = body;

    if (!id || !status) {
      return Response.json({ success: false, error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    // เตรียม SQL สำหรับอัปเดต
    const query = `
      UPDATE orders 
      SET status = ?, 
          updated_by = ?, 
          updated_at = NOW() 
      WHERE id = ?
    `;

    // ใช้ parseInt เพื่อป้องกันปัญหาชนิดข้อมูล ID ในฐานข้อมูล
    const [result] = await db.query(query, [status, adminName || "Unknown Admin", parseInt(id)]);

    if (result.affectedRows > 0) {
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false, error: "ไม่พบรายการสั่งซื้อที่ระบุ" }, { status: 404 });
    }

  } catch (error) {
    console.error("Update Error:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}