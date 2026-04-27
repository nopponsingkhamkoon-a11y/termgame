import { db } from "@/lib/db";
import { v2 as cloudinary } from 'cloudinary';

// ตั้งค่า Cloudinary (ดึงค่าจาก Environment Variables ใน Vercel)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const data = await req.formData();
    
    const userId = data.get("userId");
    const playerId = data.get("playerId");
    const gameName = data.get("gameName");
    const amount = data.get("amount");
    const file = data.get("slip");

    // 1. Validation: ตรวจสอบความพร้อมของข้อมูล
    if (!file || !userId || !playerId) {
      return Response.json({ success: false, error: "ข้อมูลไม่ครบถ้วน หรือไม่ได้แนบสลิป" });
    }

    // 2. Cloudinary Upload Logic: แปลงไฟล์และส่งขึ้น Cloud
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: "game_slips", // จัดกลุ่มรูปใน Cloudinary
          resource_type: "image"
        }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 3. Database Logic: บันทึก URL ที่ได้จาก Cloudinary ลง TiDB
    const dbPath = uploadResponse.secure_url; // ลิงก์รูปภาพตัวจริง (https://...)

    const query = `
    INSERT INTO orders (userId, playerId, game, amount, slip, status) 
    VALUES (?, ?, ?, ?, ?, 'รอเติม')
  `;
  // updated_by จะเป็น NULL โดยอัตโนมัติในฐานข้อมูลเมื่อสร้างใหม่
  await db.query(query, [userId, playerId, gameName, amount, dbPath]);

    return Response.json({ success: true });

  } catch (error) {
    console.error("Payment Confirmation Error:", error);
    return Response.json({ 
      success: false, 
      error: "เกิดข้อผิดพลาด: " + error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // *** ต้องเพิ่ม updated_by และ updated_at เข้าไปใน SELECT ***
    // ต้องมั่นใจว่า SELECT เอา updated_by ออกมาด้วย
const query = "SELECT id, username, playerId, game, amount, slip, status, updated_by, updated_at FROM orders ORDER BY id DESC";
    
    const [rows] = await db.query(query);
    
    // ตรวจสอบโครงสร้างข้อมูลที่ส่งกลับไปให้หน้า AdminDashboard
    return Response.json({ success: true, orders: rows });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}