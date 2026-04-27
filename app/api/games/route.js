import { db } from "@/lib/db";

export async function GET() {
  try {
    //  หัวใจสำคัญ: เรียงตาม priority จากมากไปน้อย (อันดับ 1-5) 
    // และตามด้วย id เพื่อให้เกมที่เหลือเรียงตามลำดับการเพิ่ม
    const [rows] = await db.query(`
      SELECT * FROM games 
      ORDER BY priority DESC, id ASC
    `);

    return Response.json(rows);
  } catch (error) {
    console.error("Fetch games error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
