"use client";
import { useEffect, useState } from "react";
import "./history.css"; 

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. ดึงข้อมูล user จาก localStorage
    const savedUser = JSON.parse(localStorage.getItem("user"));
    
    if (savedUser && savedUser.id) {
      setUser(savedUser);
      // 2. เรียก API ดึงประวัติ
      fetch(`/api/user/orders?userId=${savedUser.id}`)
        .then(res => res.json())
        .then(data => {
          setOrders(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Fetch error:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="loading" style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>กำลังโหลดประวัติ...</div>;

  return (
    <div className="history-container">
      <button 
        onClick={() => window.location.href = "/"} 
        style={{ marginBottom: '20px', background: 'none', border: '1px solid #00ffcc', color: '#00ffcc', cursor: 'pointer', padding: '5px 10px', borderRadius: '5px' }}
      >
        ← กลับหน้าหลัก
      </button>

      <h2>📜 ประวัติการเติมเกม</h2>
      
      <div className="order-list">
        {!user ? (
          <p>กรุณาเข้าสู่ระบบเพื่อดูประวัติ</p>
        ) : orders.length === 0 ? (
          <p>คุณยังไม่มีรายการสั่งซื้อ</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-item">
              <div className="item-details">
                <span className="game-name">{order.game}</span>
                <span className="player-id">ID ผู้เล่น: {order.playerId}</span>
                <span className="date">{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="item-status">
                <span className="amount">{order.amount}฿</span>
                {/* 🌟 แสดงสถานะ พร้อมคลาสสีที่ตั้งไว้ใน CSS */}
                <span className={`status-text ${order.status}`}>{order.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}