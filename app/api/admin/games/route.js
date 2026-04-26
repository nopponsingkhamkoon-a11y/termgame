import { db } from "@/lib/db";

// GET: ดึงรายชื่อเกมทั้งหมด
export async function GET() {
  const [rows] = await db.query("SELECT * FROM games ORDER BY priority DESC, id ASC");
  return Response.json(rows);
}

// POST: เพิ่มเกมใหม่
export async function POST(req) {
  try {
    const { name, image_url } = await req.json();
    
    // ลอง log ค่าที่ส่งมาดูว่ารับค่าได้ไหม
    console.log("ข้อมูลที่รับมา:", name, image_url); 

    await db.query(
      "INSERT INTO games (name, image_url) VALUES (?, ?)",
      [name, image_url]
    );
    return Response.json({ success: true });
  } catch (error) {
    // พิมพ์ Error ออกมาดูใน Terminal (หน้าจอหน้าดำๆ ที่รัน npm run dev)
    console.error("❌ Database Error:", error); 
    
    // ส่ง error กลับไปให้หน้าเว็บแจ้งเตือนด้วย
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: ลบเกม
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await db.query("DELETE FROM games WHERE id = ?", [id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "ไม่สามารถลบเกมได้" }, { status: 500 });
  }
}