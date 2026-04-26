import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  const body = await req.json();

  // hash password
  const hashed = await bcrypt.hash(body.password, 10);

  try {
    await db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [body.username, hashed]
    );

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "username ซ้ำ" });
  }
}