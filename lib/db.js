import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com', // วาง Host ที่ก๊อปมา
  port: 4000,
  user: '2c5jiVQT4b3LTmG.root', // วาง User ที่ก๊อปมา
  password: 'C1DlSiSuFLYhXld2', // วางรหัสผ่านของคุณ
  database: 'test', // ชื่อฐานข้อมูลที่เราใช้ในรูปคือ test
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});