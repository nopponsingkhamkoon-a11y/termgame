import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // ดึงค่ามาพักไว้ และใส่ค่าหลอกๆ (Default) กันเหนียว
    const orderId = body.id;
    const newStatus = body.status;
    const name = body.adminName || "Admin_A"; // ถ้า adminName เป็น undefined จะใช้ "Admin_A" แทน

    const query = `
      UPDATE orders 
      SET status = ?, 
          updated_by = ?, 
          updated_at = NOW() 
      WHERE id = ?
    `;

    // ลำดับต้องเป๊ะ: status -> ?, name -> ?, orderId -> ?
    const [result] = await db.query(query, [newStatus, name, orderId]);

    // เช็คใน Console ของ VS Code ว่ามันอัปเดตไปกี่แถว
    console.log("อัปเดตสำเร็จกี่แถว:", result.affectedRows);

    if (result.affectedRows === 0) {
      return Response.json({ success: false, error: "หา ID นี้ไม่เจอในระบบ" });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("SQL ERROR:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}