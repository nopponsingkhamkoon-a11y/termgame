import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();

    const [rows] = await db.query(
      "SELECT * FROM users WHERE username=?",
      [body.username]
    );

    if (rows.length === 0) {
      return Response.json({ error: "ไม่พบ user" }, { status: 401 });
    }

    const user = rows[0];

    // compare password
    const match = await bcrypt.compare(body.password, user.password);

    if (!match) {
      return Response.json({ error: "รหัสผิด" }, { status: 401 });
    }

    //  แก้ไขตรงนี้: ส่ง object user กลับไปให้ครบตามโครงสร้าง DB ของคุณ
    return Response.json({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        role: user.role // ส่ง role ไปด้วยเพื่อให้หน้าบ้านรู้ว่าเป็น admin หรือ user
      } 
    });

  } catch (error) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
