import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("--- Debug Update Order ---");
    console.log("Data received:", body); // ดูที่จอ Terminal ว่า adminName มีค่าไหม

    const { id, status, adminName } = body;

    if (!id || !status) {
      return Response.json({ success: false, error: "Missing ID or Status" }, { status: 400 });
    }

    // ใช้ 'System Admin' เป็นค่าเริ่มต้นหาก adminName ว่าง
    const finalAdminName = adminName || "System Admin";

    const query = `
      UPDATE orders 
      SET status = ?, 
          updated_by = ?, 
          updated_at = NOW() 
      WHERE id = ?
    `;

    const [result] = await db.query(query, [status, finalAdminName, id]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Update Order Error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}