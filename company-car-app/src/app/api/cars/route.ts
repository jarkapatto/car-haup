import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CarSchema } from "@/schemas/car.schema";

// สำหรับ Prisma v5 ประกาศเรียกใช้งานตรงๆ แบบนี้ได้เลยครับ ไม่ต้องใช้ Adapter v7 แล้ว
const prisma = new PrismaClient();

// ดึงข้อมูลรถยนต์ทั้งหมด (Read)
export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(cars);
  } catch (error) {
    // พ่นสาเหตุที่แท้จริงออกมาดูที่ Terminal ของ VS Code
    console.error("🔴 GET API ERROR:", error);
    return NextResponse.json({ error: "ดึงข้อมูลล้มเหลว" }, { status: 500 });
  }
}

// เพิ่มข้อมูลรถยนต์คันใหม่ (Create)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = CarSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const newCar = await prisma.car.create({
      data: validation.data
    });

    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    console.error("🔴 POST API ERROR:", error);
    return NextResponse.json({ error: "เพิ่มข้อมูลล้มเหลว หรือทะเบียนซ้ำ" }, { status: 500 });
  }
}