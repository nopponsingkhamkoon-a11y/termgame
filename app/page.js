"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./style.css"; 

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);

  const banners = [
    "https://www.thestreetratchada.com/upload/contents/1735312033TSR%20-%20Nov%203%20(%E0%B9%80%E0%B8%81%E0%B8%A1%20%E0%B8%AD%E0%B8%AD%E0%B8%99%E0%B9%84%E0%B8%A5%E0%B8%99%E0%B9%8C%20%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%99%20%E0%B8%81%E0%B8%B1%E0%B8%9A%20%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99)-%20(2).jpg", 
    "https://easycard.co.th/home-images/sectionMenu/topupGame.png",
    "https://static.thairath.co.th/media/dFQROr7oWzulq5Fa6rBstWAQ0C15bPVWu18DTTzU9VR9LxtGtO02E56kX1GR77jHxDl.jpg",
    "https://cdn.oneesports.co.th/cdn-data/sites/3/2022/07/f5fbe713fe9d83d1de915566011guf05.webp"
  ];

  useEffect(() => {
    // ดึงข้อมูล User
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser({ username: savedUser });
      }
    }

    // ดึงข้อมูลเกม
    const fetchGames = async () => {
      try {
        const res = await fetch("/api/admin/games");
        const data = await res.json();
        setGames(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch games error:", err);
      }
    };
    fetchGames();

    // Auto Slide
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // ฟังก์ชัน Logout
  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="main-container">
      {/* --- 1. NAVBAR --- */}
      <nav className="navbar-custom">
        <div className="logo">GAMING III <span style={{color: "#00ffcc"}}>SHOP</span></div>
        
        <div className="nav-right">
          {user ? (
            <div className="user-profile-box">
              <div className="user-name-btn">👤 {user.username}</div>
              
              <div className="my-dropdown">
                <Link href="/history" className="menu-item">📜 ประวัติการเติม</Link>
                
                {user.role === "admin" && (
                  <Link href="/admin" className="menu-item" style={{color: "#f1c40f"}}>🛡️ จัดการระบบ</Link>
                )}
                
                <button onClick={logout} className="menu-item logout-item">🚪 ออกจากระบบ</button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="login-btn">เข้าสู่ระบบ</Link>
          )}
        </div>
      </nav>

      {/* --- 2. HERO SLIDER --- */}
      <section className="slider-section">
        <div className="slider-wrapper">
          <div 
            className="slider-track" 
            style={{ transform: `translateX(-${currentSlide * 65}%)` }} 
          >
            {banners.map((img, index) => (
              <div 
                key={index}
                className={`slide-card ${index === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              >
                <img src={img} alt={`banner-${index}`} />
                <div className="slide-overlay">
                  <h2>โปรโมชั่นสุดพิเศษ</h2>
                  <p>เติมวันนี้ รับโบนัสเพิ่ม 10%</p>
                </div>
              </div>
            ))}
          </div>
          <div className="dots-container">
            {banners.map((_, index) => (
              <div 
                key={index} 
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. GAME GRID --- */}
      <section className="game-section">
        <h2 className="section-title">🎮 เลือกเกมที่คุณต้องการเติม</h2>
        <div className="game-grid">
          {games.length > 0 ? (
            games.map((game) => (
              <Link href={`/buy/${encodeURIComponent(game.name)}`} key={game.id} className="game-card">
                <div className="game-img-wrapper">

                {game.priority > 0 && <div className="sponsor-badge">ยอดฮิต</div>}

                  <img src={game.image_url} alt={game.name} />
                </div>
                <div className="game-info">
                  <h3>{game.name}</h3>
                </div>
              </Link>
            ))
          ) : (
            <p className="loading-text">กำลังโหลดรายการเกม...</p>
          )}
        </div>
      </section>
    </div>
  );
}