import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // แปลง ID เป็นตัวเลข (Number) เพื่อให้มั่นใจว่าตรงกับใน Database
    const orderId = Number(body.id); 
    const newStatus = body.status;
    const adminName = body.adminName || "Admin_A";

    const query = `
      UPDATE orders 
      SET status = ?, 
          updated_by = ?, 
          updated_at = NOW() 
      WHERE id = ?
    `;

    // ส่งค่าไปเรียงตามลำดับ: 1.status, 2.adminName, 3.orderId
    const [result] = await db.query(query, [newStatus, adminName, orderId]);

    // เช็คผลลัพธ์ใน Terminal ของ VS Code
    console.log("--- Update Result ---");
    console.log("Updating ID:", orderId);
    console.log("Rows Affected:", result.affectedRows);

    if (result.affectedRows === 0) {
      return Response.json({ success: false, error: "หา ID นี้ไม่เจอในระบบ" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("SQL Error:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}