import { db } from "@/lib/db";

export async function GET() {
  try {
    // ดึงข้อมูลจากตาราง orders โดยระบุคอลัมน์ให้ครบ
    const query = `
      SELECT 
        id, username, playerId, game, amount, slip, status, 
        updated_by, updated_at 
      FROM orders 
      ORDER BY id DESC
    `;
    
    const [rows] = await db.query(query);
    
    return Response.json({ success: true, orders: rows });
  } catch (error) {
    console.error("Fetch Orders Error:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}