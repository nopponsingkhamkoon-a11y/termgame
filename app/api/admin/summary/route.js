import { db } from "@/lib/db";

export async function GET() {
  try {
    // 1. หาผลรวมยอดขายวันนี้ (ที่สถานะเป็น 'สำเร็จ')
    const [todaySales] = await db.query(`
      SELECT SUM(amount) as total 
      FROM orders 
      WHERE status = 'สำเร็จ' 
      AND DATE(createdAt) = CURDATE()
    `);

    // 2. นับจำนวนออเดอร์ที่ยังไม่ได้เติม
    const [pendingCount] = await db.query(`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE status = 'รอเติม'
    `);

    // 3. หาผลรวมยอดขายทั้งหมด
    const [allTimeSales] = await db.query(`
      SELECT SUM(amount) as total 
      FROM orders 
      WHERE status = 'สำเร็จ'
    `);

    return Response.json({
      todaySales: todaySales[0].total || 0,
      pendingCount: pendingCount[0].count || 0,
      allTimeSales: allTimeSales[0].total || 0
    });
  } catch (error) {
    console.error("Summary API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}