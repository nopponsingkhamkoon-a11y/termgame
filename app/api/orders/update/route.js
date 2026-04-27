import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("--- Debug Update Order ---");
    console.log("Data received:", body); 

    const { id, status, adminName } = body;

    if (!id || !status) {
      return Response.json({ success: false, error: "Missing ID or Status" }, { status: 400 });
    }

    // แก้ชื่อตัวแปรให้ตรงกัน
    const finalAdminName = adminName || "System Admin";

    const query = `
      UPDATE orders 
      SET status = ?, 
          updated_by = ?, 
          updated_at = NOW() 
      WHERE id = ?
    `;

    // *** แก้จาก finalAdmin เป็น finalAdminName ***
    const [result] = await db.query(query, [status, finalAdminName, id]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Update Order Error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}