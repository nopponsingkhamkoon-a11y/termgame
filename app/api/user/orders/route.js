import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log("กำลังดึงประวัติของ userId:", userId);

    if (!userId) return Response.json({ error: "Missing userId" }, { status: 400 });

    // ดึงเฉพาะออเดอร์ที่มี userId ตรงกับคนที่ส่งมา
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE userId = ? ORDER BY id DESC",
      [userId]
    );

    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}