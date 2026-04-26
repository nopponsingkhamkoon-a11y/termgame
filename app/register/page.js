"use client";
import { useState } from "react";
import "../login/login.css";

export default function Register() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const register = async () => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username: user, password: pass })
    });

    const data = await res.json();

    if (data.success) {
      alert("สมัครสำเร็จ 🎉");
      window.location.href = "/login";
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-box">
        <h1>🎮 Game Shop</h1>
        <p>สมัครสมาชิก</p>

        <input placeholder="Username" onChange={e=>setUser(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e=>setPass(e.target.value)} />

        <button onClick={register}>Register</button>

        <p className="link">
          มีบัญชีแล้ว? <a href="/login">เข้าสู่ระบบ</a>
        </p>
      </div>

    </div>
  );
}