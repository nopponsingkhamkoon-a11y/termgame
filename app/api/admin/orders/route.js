import { db } from "@/lib/db";

export async function GET() {
  try {
    // ใช้ SELECT * เพื่อดึงทุกคอลัมน์ (รวมถึงอันที่เพิ่งเพิ่มใหม่)
    const query = "SELECT * FROM orders ORDER BY id DESC";
    const [rows] = await db.query(query);
    
    // ส่งข้อมูลกลับไปในรูปแบบที่หน้าบ้านรอรับ (ต้องมี success และ orders)
    return Response.json({ success: true, orders: rows });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message });
  }
}