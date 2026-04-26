"use client";
import { useEffect, useState } from "react";
import "./admin.css";

export default function AdminDashboard() {
  const [view, setView] = useState("orders");
  const [summary, setSummary] = useState({ todaySales: 0, pendingCount: 0, allTimeSales: 0 });
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [packages, setPackages] = useState([]);

  const [gameName, setGameName] = useState("");
  const [gameImage, setGameImage] = useState("");

  const [selectedGameName, setSelectedGameName] = useState("");
  const [pkgLabel, setPkgLabel] = useState("");
  const [pkgPrice, setPkgPrice] = useState("");

  // โหลดข้อมูลทั้งหมดรวมถึงสรุปยอด
  useEffect(() => {
    fetchOrders();
    fetchGames();
    fetchPackages();
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await fetch("/api/admin/summary");
      const data = await res.json();
      if (res.ok) setSummary(data);
    } catch (err) { console.error("Fetch summary failed"); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (res.ok) setOrders(Array.isArray(data) ? data : []);
    } catch (error) { console.error("Fetch error:", error); }
    finally { setLoading(false); }
  };

  const fetchGames = async () => {
    try {
      const res = await fetch("/api/admin/games");
      const data = await res.json();
      setGames(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Fetch games failed"); }
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/admin/packages");
      const data = await res.json();
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error("Fetch packages failed");
      setPackages([]);
    }
  };

  const addPackage = async (e) => {
    e.preventDefault();
    if (!selectedGameName || !pkgLabel || !pkgPrice) {
      return alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }

    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          game_name: selectedGameName, 
          name: pkgLabel, 
          price: pkgPrice 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ เพิ่มแพ็กเกจสำเร็จ");
        setPkgLabel(""); 
        setPkgPrice("");
        setSelectedGameName("");
        fetchPackages();
      } else {
        alert("❌ เกิดข้อผิดพลาด: " + (data.error || "ไม่สามารถเพิ่มได้"));
      }
    } catch (error) {
      alert("❌ เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    }
  };

  const deletePackage = async (id) => {
    if (!confirm("ต้องการลบแพ็กเกจนี้ใช่หรือไม่?")) return;
    try {
      const res = await fetch(`/api/admin/packages?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("ลบสำเร็จ");
        fetchPackages();
      }
    } catch (error) { alert("ลบล้มเหลว"); }
  };

  const addGame = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: gameName, image_url: gameImage }),
    });
    if (res.ok) {
      alert("เพิ่มเกมสำเร็จ");
      setGameName(""); setGameImage("");
      fetchGames();
    }
  };

  const deleteGame = async (id) => {
    if (!confirm("ลบเกมนี้?")) return;
    const res = await fetch("/api/admin/games", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchGames();
  };

  const updateStatus = async (orderId, newStatus) => {
    if (!confirm(`คุณแน่ใจใช่ไหมที่จะเปลี่ยนสถานะเป็น "${newStatus}"?`)) return;
    try {
      const res = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        alert("อัปเดตสถานะสำเร็จ!");
        fetchOrders();
        fetchSummary(); // อัปเดตยอดรวมใหม่หลังจากเปลี่ยนสถานะสำเร็จ
      }
    } catch (error) { alert("เกิดข้อผิดพลาดในการอัปเดต"); }
  };

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <h2>🛡️ Admin Panel</h2>
        <ul>
          <li className={view === "orders" ? "active" : ""} onClick={() => setView("orders")}>📦 จัดการออเดอร์</li>
          <li className={view === "games" ? "active" : ""} onClick={() => setView("games")}>🎮 จัดการเกม</li>
          <li className={view === "packages" ? "active" : ""} onClick={() => setView("packages")}>💰 จัดการแพ็กเกจ</li>
        </ul>
        <button className="logout-btn" onClick={() => window.location.href = "/"}>กลับหน้าหลัก</button>
      </div>

      <div className="admin-content">
        {/* --- ส่วนจัดการออเดอร์ --- */}
        {view === "orders" && (
          <>
            <h1>รายการสั่งซื้อ</h1>

            {/* 🌟 เพิ่มส่วน Summary Cards ตรงนี้ (ของใหม่) */}
            <div className="summary-container">
              <div className="summary-card">
                <span className="summary-label">💰 ยอดขายวันนี้</span>
                <h2 className="summary-value">{Number(summary.todaySales).toLocaleString()} ฿</h2>
              </div>
              <div className="summary-card">
                <span className="summary-label">⏳ รอเติมเงิน</span>
                <h2 className="summary-value warning">{summary.pendingCount} รายการ</h2>
              </div>
              <div className="summary-card">
                <span className="summary-label">📈 รายได้สะสม</span>
                <h2 className="summary-value">{Number(summary.allTimeSales).toLocaleString()} ฿</h2>
              </div>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ลูกค้า</th>
                    <th>เกม</th>
                    <th>ยอดเงิน</th>
                    <th>สลิป</th>
                    <th>สถานะ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        <div className="user-cell">
                          <strong>{order.username || "ทั่วไป"}</strong>
                          <span>ID: {order.playerId}</span>
                        </div>
                      </td>
                      <td>{order.game}</td>
                      <td className="price-cell">{order.amount} ฿</td>
                      <td>
                        <a href={order.slip} target="_blank" rel="noreferrer" className="view-slip">🖼️ ดูสลิป</a>
                      </td>
                      <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                      <td>
                        {order.status === "รอเติม" && (
                          <div className="action-btns">
                            <button onClick={() => updateStatus(order.id, "สำเร็จ")} className="btn-approve">✔️</button>
                            <button onClick={() => updateStatus(order.id, "ยกเลิก")} className="btn-reject">❌</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* --- ส่วนจัดการเกม --- */}
        {view === "games" && (
          <>
            <h1>จัดการเกม</h1>
            <div className="form-container dark-form">
              <form onSubmit={addGame}>
                <input type="text" placeholder="ชื่อเกม" value={gameName} onChange={(e) => setGameName(e.target.value)} required />
                <input type="text" placeholder="URL รูปภาพ" value={gameImage} onChange={(e) => setGameImage(e.target.value)} required />
                <button className="btn-success" type="submit">เพิ่มเกม</button>
              </form>
            </div>
            <div className="table-container">
              <table>
                <thead><tr><th>รูป</th><th>ชื่อเกม</th><th>จัดการ</th></tr></thead>
                <tbody>
                  {games.map((g) => (
                    <tr key={g.id}>
                      <td><img src={g.image_url} alt="" style={{ width: '50px' }} /></td>
                      <td>{g.name}</td>
                      <td><button className="btn-danger" onClick={() => deleteGame(g.id)}>ลบ</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* --- ส่วนจัดการแพ็กเกจ --- */}
        {view === "packages" && (
          <>
            <h1>จัดการแพ็กเกจราคา</h1>
            <div className="form-container dark-form">
              <form onSubmit={addPackage}>
                <select value={selectedGameName} onChange={(e) => setSelectedGameName(e.target.value)} required>
                  <option value="">-- เลือกเกม --</option>
                  {games.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                </select>
                <input type="text" placeholder="เช่น 500 คูปอง" value={pkgLabel} onChange={(e) => setPkgLabel(e.target.value)} required />
                <input type="number" placeholder="ราคา" value={pkgPrice} onChange={(e) => setPkgPrice(e.target.value)} required />
                <button className="btn-success" type="submit">เพิ่มแพ็กเกจ</button>
              </form>
            </div>
            <div className="table-container">
              <table>
                <thead><tr><th>เกม</th><th>แพ็กเกจ</th><th>ราคา</th><th>จัดการ</th></tr></thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td>{pkg.game_name}</td>
                      <td>{pkg.name}</td>
                      <td>{pkg.price}฿</td>
                      <td><button className="btn-danger" onClick={() => deletePackage(pkg.id)}>ลบ</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}