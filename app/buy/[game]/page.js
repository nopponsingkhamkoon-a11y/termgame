"use client";
import { useState, useEffect, use } from "react";
import "./buy.css"; 

export default function BuyGame({ params: paramsPromise }) {
  // 1. แกะค่า params ด้วย use (วิธีมาตรฐาน Next.js 15)
  const params = use(paramsPromise);
  const decodedGameName = params.game ? decodeURIComponent(params.game) : ""; 
  
  // 2. States ทั้งหมด
  const [user, setUser] = useState(null);
  const [playerId, setPlayerId] = useState("");
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bgImage, setBgImage] = useState("");
  const [slipFile, setSlipFile] = useState(null);

  // 3. useEffect หลักสำหรับโหลดข้อมูลครั้งแรก
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (decodedGameName) {
      fetchGameDetail();
      fetchPackages();
    }
  }, [decodedGameName]);

  const fetchGameDetail = async () => {
    try {
      const res = await fetch("/api/admin/games");
      const games = await res.json();
      const matchGame = games.find(g => g.name === decodedGameName);
      if (matchGame) setBgImage(matchGame.image_url);
    } catch (err) {
      console.error("Game detail error:", err);
    }
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/packages?game=${encodeURIComponent(decodedGameName)}`);
      const data = await res.json();
      if (res.ok) {
        setPackages(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Packages error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!user?.id) return alert("กรุณาเข้าสู่ระบบ");
    if (!playerId || !selectedPackage || !slipFile) return alert("กรอกข้อมูลให้ครบ");

    const formData = new FormData();
    formData.append("userId", user.id); 
    formData.append("playerId", playerId);
    formData.append("gameName", decodedGameName);
    formData.append("amount", selectedPackage.price);
    formData.append("slip", slipFile);

    try {
      const res = await fetch("/api/orders", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) {
        alert("สั่งซื้อสำเร็จ!");
        window.location.href = "/";
      } else {
        alert("ผิดพลาด: " + result.error);
      }
    } catch (error) {
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    }
  };

  return (
    <div 
      className="buy-container"
      style={{
        backgroundImage: bgImage 
          ? `linear-gradient(rgba(10, 5, 20, 0.7), rgba(0, 0, 0, 0.95)), url(${bgImage})` 
          : `radial-gradient(circle at 15% 50%, #1a0b2e, #050505 60%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="buy-card">
        <div className="game-header">
          <h1>{decodedGameName || "Loading..."}</h1>
          <p>กรอกข้อมูลให้ครบถ้วนเพื่อทำการเติมเกม</p>
        </div>

        <div className="input-group">
          <label>🎮 Player ID (UID)</label>
          <input 
            type="text" 
            placeholder="ระบุ UID ของคุณ" 
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)} 
          />
        </div>

        <div className="package-section">
          <label>💎 เลือกแพ็กเกจ</label>
          {loading ? (
            <p className="status-text">⏳ กำลังดึงข้อมูล...</p>
          ) : (
            <div className="package-grid">
              {packages.map((p) => (
                <div 
                  key={p.id} 
                  className={`package-card ${selectedPackage?.id === p.id ? "active" : ""}`}
                  onClick={() => setSelectedPackage(p)}
                >
                  <div className="package-content">
                        <div className="package-name">{p.name}</div>
                        <div className="package-price">{Number(p.price).toLocaleString()} ฿</div>
                    </div>
                    <div className={`package-check ${selectedPackage?.id === p.id ? "checked" : ""}`}> </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="payment-info">
          <div className="bank-card">
            <div className="bank-logo">
              <img src="https://www.kasikornbank.com/SiteCollectionDocuments/about/img/logo/logo.png" alt="KBank" />
            </div>
            <div className="account-details">
              <p className="account-number">198-3-28980-7</p>
              <p className="account-name">นายนพพล สิงห์คำคูณ</p>
            </div>
            <button className="copy-btn" onClick={() => {
                navigator.clipboard.writeText('1983289807');
                alert("คัดลอกแล้ว");
            }}>คัดลอกเลขบัญชี</button>
          </div>
        </div>

        <div className="upload-section">
          <input 
            type="file" 
            accept="image/*" 
            id="slip-upload" 
            onChange={(e) => setSlipFile(e.target.files[0])} 
            style={{ display: 'none' }} 
          />
          <label htmlFor="slip-upload" className="file-label">
            <div className="upload-box">
              <span>{slipFile ? `✅ ${slipFile.name}` : "📸 แนบสลิปการโอนเงิน"}</span>
            </div>
          </label>
        </div>

        <button className="confirm-btn" onClick={handleOrder}>
          ยืนยันการชำระเงิน
        </button>
      </div>
    </div>
  );
}