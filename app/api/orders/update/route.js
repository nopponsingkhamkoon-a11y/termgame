import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // ดึงค่าตามชื่อที่ปรากฏใน Payload (id, status, adminName)
    const { id, status, adminName } = await req.json();

        // ใช้ชื่อที่ส่งมาบันทึกลงฐานข้อมูล
        const query = `
        UPDATE orders 
        SET status = ?, 
            updated_by = ?, 
            updated_at = NOW() 
        WHERE id = ?
        `;
        const [result] = await db.query(query, [status, adminName, id]);

   

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