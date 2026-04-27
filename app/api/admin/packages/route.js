import { db } from "@/lib/db";

// ดึงแพ็กเกจทั้งหมดมาโชว์ในตารางแอดมิน
export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM packages ORDER BY game_name ASC");
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// เพิ่มแพ็กเกจใหม่ (ต้องบันทึก game_name ลงไปด้วย)
export async function POST(req) {
  try {
    const { name, price, game_name } = await req.json();
    const [result] = await db.query(
      "INSERT INTO packages (name, price, game_name) VALUES (?, ?, ?)",
      [name, price, game_name]
    );
    return Response.json({ success: true, id: result.insertId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, name, price } = await req.json();

    if (!id) {
      return Response.json({ success: false, error: "ไม่พบ ID แพ็กเกจที่ต้องการแก้ไข" });
    }

    const query = `
      UPDATE packages 
      SET name = ?, price = ? 
      WHERE id = ?
    `;

    await db.query(query, [name, price, id]);

    return Response.json({ success: true });

  } catch (error) {
    console.error("Update Package Error:", error);
    return Response.json({ 
      success: false, 
      error: "เกิดข้อผิดพลาด: " + error.message 
    }, { status: 500 });
  }
}

// ลบแพ็กเกจ
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await db.query("DELETE FROM packages WHERE id = ?", [id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}