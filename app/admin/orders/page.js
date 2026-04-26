"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. ดึงข้อมูล User เพื่อเอา ID ไปหาออเดอร์
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchOrders(parsedUser.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (userId) => {
    try {
      // เรียก API เดียวกับที่เราใช้ในหน้าประวัติ
      const res = await fetch(`/api/user/orders?userId=${userId}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch orders failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={centerStyle}>กำลังโหลดข้อมูล...</div>;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>📋 รายการสั่งซื้อของฉัน</h1>
        <Link href="/" style={backBtnStyle}>← กลับหน้าหลัก</Link>
      </header>

      <div style={tableWrapperStyle}>
        {orders.length === 0 ? (
          <div style={emptyStyle}>ยังไม่มีรายการสั่งซื้อในขณะนี้</div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>วันที่</th>
                <th>เกม</th>
                <th>UID ผู้เล่น</th>
                <th>ราคา</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={trStyle}>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: "bold", color: "#00ffcc" }}>{order.game}</td>
                  <td>{order.playerId}</td>
                  <td>{order.amount} ฿</td>
                  <td>
                    <span style={statusBadgeStyle(order.status)}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// --- CSS Styles (Inline) ---
const containerStyle = {
  maxWidth: "1000px",
  margin: "40px auto",
  padding: "20px",
  color: "#fff",
  fontFamily: "sans-serif"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px"
};

const tableWrapperStyle = {
  background: "#1a1a2e",
  borderRadius: "15px",
  overflow: "hidden",
  border: "1px solid #333"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left"
};

const trStyle = {
  borderBottom: "1px solid #252545"
};

const backBtnStyle = {
  color: "#00ffcc",
  textDecoration: "none",
  border: "1px solid #00ffcc",
  padding: "5px 15px",
  borderRadius: "5px"
};

const statusBadgeStyle = (status) => ({
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "0.85rem",
  fontWeight: "bold",
  background: status === "สำเร็จ" ? "#2ecc71" : status === "ยกเลิก" ? "#e74c3c" : "#f1c40f",
  color: status === "รอเติม" ? "#000" : "#fff"
});

const centerStyle = { textAlign: "center", marginTop: "100px", color: "#00ffcc" };
const emptyStyle = { padding: "40px", textAlign: "center", color: "#888" };