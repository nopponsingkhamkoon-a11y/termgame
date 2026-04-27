import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    //  หน้าบ้านจะส่งมาเป็น ?game=ชื่อเกม
    const gameName = searchParams.get("game");

    if (!gameName) {
      return Response.json([]);
    }

    // Decode ชื่อเกม (เผื่อเป็นภาษาไทย) และตัดช่องว่าง
    const cleanGameName = decodeURIComponent(gameName).trim();

    //  ค้นหาใน DB โดยเทียบกับคอลัมน์ game_name
    const [rows] = await db.query(
      "SELECT * FROM packages WHERE game_name = ? ORDER BY price ASC",
      [cleanGameName]
    );

    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
