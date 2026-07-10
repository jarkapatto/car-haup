# 🚗 Company Car Management App

ระบบจัดการข้อมูลรถยนต์ของบริษัท (CRUD Application) พัฒนาด้วย Next.js และฐานข้อมูล PostgreSQL สำหรับจัดการ เพิ่ม ลบ และแก้ไข ข้อมูลยานพาหนะส่วนกลาง

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

* **Frontend:** Next.js 15, React 19, Tailwind CSS
* **Backend:** Next.js API Routes (App Router)
* **Database & ORM:** PostgreSQL, Prisma v5
* **Validation & UI:** Zod, React Hook Form, Sonner (Toast Notifications)

## 📋 ข้อกำหนดเบื้องต้น (Prerequisites)

* Node.js (เวอร์ชัน 18 ขึ้นไป)
* Docker และ Docker Compose (สำหรับรันฐานข้อมูล)

## 🚀 การติดตั้งและใช้งาน (Getting Started)

**1. คลอนโปรเจกต์และติดตั้งแพ็กเกจ**
```bash
git clone <your-repo-url>
cd company-car-app
npm install

**2. เริ่มต้นฐานข้อมูลด้วย Docker**

Bash
docker-compose up -d
3. ตั้งค่า Environment Variables
สร้างไฟล์ .env ที่โฟลเดอร์หลักของโปรเจกต์ และกำหนดค่าการเชื่อมต่อฐานข้อมูล:

ข้อมูลโค้ด
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/company_car_db?schema=public"
4. สร้างตารางในฐานข้อมูล (Prisma Migration)

Bash
npx prisma db push
5. รันเซิร์ฟเวอร์สำหรับโหมดพัฒนา (Development)

Bash
npm run dev
ระบบจะเปิดใช้งานที่ http://localhost:3000

📂 โครงสร้างโปรเจกต์ (Project Structure)
src/app/page.tsx: หน้า Dashboard หลักแสดงตารางข้อมูล

src/app/api/cars: จัดการฝั่ง Backend (API Routes) สำหรับข้อมูลรถยนต์

src/components: เก็บ UI Components ที่สามารถนำมาใช้ซ้ำได้ (Modal เพิ่ม/แก้ไข ข้อมูล)

prisma/schema.prisma: ไฟล์ออกแบบและกำหนดโครงสร้างฐานข้อมูล
