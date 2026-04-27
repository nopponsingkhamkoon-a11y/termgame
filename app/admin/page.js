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

  const [editGame, setEditGame] = useState(null);
  const [editPkg, setEditPkg] = useState(null);

   // ดึงชื่อจากคนที่ Login จริงๆ
  const [adminName, setAdminName] = useState("Admin_A");

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
      // ปรับให้รองรับข้อมูล orders ที่ส่งกลับมาพร้อม success status
      if (res.ok) setOrders(data.orders || (Array.isArray(data) ? data : []));
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
    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_name: selectedGameName, name: pkgLabel, price: pkgPrice }),
      });
      if (res.ok) {
        alert("✅ เพิ่มสำเร็จ");
        setPkgLabel(""); setPkgPrice("");
        fetchPackages();
      }
    } catch (error) { alert("❌ เชื่อมต่อเซิร์ฟเวอร์ไม่ได้"); }
  };

  const handleUpdatePkg = async () => {
    try {
      const res = await fetch("/api/admin/packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editPkg),
      });
      if (res.ok) {
        setEditPkg(null);
        fetchPackages();
      }
    } catch (error) { alert("แก้ไขไม่สำเร็จ"); }
  };

  const deletePackage = async (id) => {
    if (!confirm("ลบแพ็กเกจนี้?")) return;
    try {
      const res = await fetch(`/api/admin/packages?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchPackages();
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

  const handleUpdateGame = async () => {
    const res = await fetch("/api/admin/games", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editGame),
    });
    if (res.ok) {
      setEditGame(null);
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
    const testAdminName = "Admin_A";
    if (!confirm(`เปลี่ยนสถานะเป็น "${newStatus}"?`)) return;
    try {
      const res = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: orderId, 
          status: newStatus,
          adminName: testAdminName // ส่งชื่อ Admin ไปบันทึก
        }),
      });
      if (res.ok) {
        fetchOrders();
        fetchSummary();
      }
    } catch (error) { alert("เกิดข้อผิดพลาด"); }
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
                    <th>ผู้ดำเนินการ / เวลาอัปเดต</th> {/* คอลัมน์ที่เพิ่ม */}
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
                      <td><a href={order.slip} target="_blank" rel="noreferrer" className="view-slip">🖼️ ดูสลิป</a></td>
                      <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                      <td>
                        {/* แสดงข้อมูล Admin และเวลา */}
                        <div className="admin-log">
                          <div className="admin-user">{order.updated_by || "-"}</div>
                          <div className="admin-time">
                            {order.updated_at ? new Date(order.updated_at).toLocaleString("th-TH") : "รอดำเนินการ"}
                          </div>
                        </div>
                      </td>
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
                      <td>
                        <button onClick={() => setEditGame(g)} className="btn-edit-small">แก้ไข</button>
                        <button onClick={() => deleteGame(g.id)} className="btn-danger">ลบ</button>
                      </td>
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
                      <td>
                        <button onClick={() => setEditPkg(pkg)} className="btn-edit-small">แก้ไข</button>
                        <button className="btn-danger" onClick={() => deletePackage(pkg.id)}>ลบ</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* --- Modals อยู่ล่างสุดเพื่อให้ซ้อนทับได้ถูกต้อง --- */}
        {editGame && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>แก้ไขข้อมูลเกม</h2>
              <div className="modal-group">
                <label>ชื่อเกม</label>
                <input className="modal-input" value={editGame.name} onChange={(e) => setEditGame({...editGame, name: e.target.value})} />
              </div>
              <div className="modal-group">
                <label>URL รูปภาพ</label>
                <input className="modal-input" value={editGame.image_url} onChange={(e) => setEditGame({...editGame, image_url: e.target.value})} />
              </div>
              <div className="modal-group">
                <label>ลำดับ (Priority)</label>
                <input type="number" className="modal-input" value={editGame.priority || 0} onChange={(e) => setEditGame({...editGame, priority: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setEditGame(null)}>ยกเลิก</button>
                <button className="btn-save" onClick={handleUpdateGame}>บันทึก</button>
              </div>
            </div>
          </div>
        )}

        {editPkg && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>แก้ไขแพ็กเกจ</h2>
              <div className="modal-group">
                <label>ชื่อแพ็กเกจ</label>
                <input className="modal-input" value={editPkg.name} onChange={(e) => setEditPkg({...editPkg, name: e.target.value})} />
              </div>
              <div className="modal-group">
                <label>ราคา</label>
                <input type="number" className="modal-input" value={editPkg.price} onChange={(e) => setEditPkg({...editPkg, price: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setEditPkg(null)}>ยกเลิก</button>
                <button className="btn-save" onClick={handleUpdatePkg}>บันทึก</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}