"use client";
import { useState } from "react";
import "./login.css";

export default function Login() {
  // 1. ตั้งชื่อตัวแปรให้ตรงกับที่จะส่งไป API เพื่อป้องกันความสับสน
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    // เช็คก่อนว่ากรอกข้อมูลครบไหม
    if (!username || !password) {
      return alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ เก็บข้อมูล user ทั้งก้อน (มี username และ role)
        localStorage.setItem("user", JSON.stringify(data.user));
        
        alert("🎉 เข้าสู่ระบบสำเร็จ!");
        
       // ✅ 2. เช็ค Role เพื่อส่งไปหน้าพิกัดที่ถูกต้อง
        if (data.user.role === "admin") {
          window.location.href = "/admin"; // 🛡️ วาร์ปไปหน้าแอดมินทันที
        } else {
          window.location.href = "/"; // 🏠 ส่งไปหน้าหลักปกติ
        }
        
      } else {
        alert(data.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>🎮 GAMING<span>SHOP</span></h1>
        <p className="subtitle">ยินดีต้อนรับกลับมา! กรุณาเข้าสู่ระบบ</p>

        <div className="input-group">
          <input 
            type="text"
            placeholder="ชื่อผู้ใช้งาน (Username)" 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>

        <div className="input-group">
          <input 
            type="password" 
            placeholder="รหัสผ่าน (Password)" 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button className="login-btn" onClick={login}>เข้าสู่ระบบ</button>

        <p className="link-text">
          ยังไม่มีบัญชีสมาชิก? <a href="/register">สมัครสมาชิกที่นี่</a>
        </p>
      </div>
    </div>
  );
}