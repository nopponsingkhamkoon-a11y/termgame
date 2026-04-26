import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const data = await req.formData();
    
    const userId = data.get("userId");
    const playerId = data.get("playerId");
    const gameName = data.get("gameName");
    const amount = data.get("amount");
    const file = data.get("slip"); // ดึงไฟล์จากชื่อ "slip" ที่หน้าบ้านส่งมา

    if (!file) {
      return Response.json({ success: false, error: "กรุณาแนบสลิป" });
    }

    // --- ส่วนการจัดการบันทึกไฟล์ลงเครื่อง ---
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // // ตั้งชื่อไฟล์ใหม่โดยใช้ Timestamp เพื่อไม่ให้ชื่อซ้ำกัน
    // const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // // กำหนด Path ไปที่ public/uploads (เพื่อให้ Next.js เข้าถึงได้ผ่าน URL)
    // const uploadDir = path.join(process.cwd(), "public", "uploads");

    // // สร้างโฟลเดอร์ถ้ายังไม่มี
    // if (!fs.existsSync(uploadDir)) {
    //   fs.mkdirSync(uploadDir, { recursive: true });
    // }

    // const filePath = path.join(uploadDir, fileName);
    // fs.writeFileSync(filePath, buffer); // บันทึกไฟล์ลงเครื่อง

    // // Path ที่จะเก็บลง Database (ต้องขึ้นต้นด้วย /uploads/ เพื่อให้กดดูได้)
    // const dbPath = `/uploads/${fileName}`;

    // --- ส่วนการบันทึกลง Database ---
    const query = `
      INSERT INTO orders (userId, playerId, game, amount, slip, status) 
      VALUES (?, ?, ?, ?, ?, 'รอเติม')
    `;

    await db.query(query, [
      userId, 
      playerId, 
      gameName, 
      amount, 
      dbPath // บันทึก path ของรูปที่บันทึกจริง
    ]);

    return Response.json({ success: true });

  } catch (error) {
    console.error("Server Error:", error);
    return Response.json({ 
      success: false, 
      error: "เกิดข้อผิดพลาด: " + error.message 
    }, { status: 500 });
  }
}