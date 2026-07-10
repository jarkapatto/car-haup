import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CarSchema } from "@/schemas/car.schema";

const prisma = new PrismaClient();

// แก้ไขข้อมูลรถยนต์ (Update)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // ต้อง await params ก่อนถึงจะดึง id ออกมาได้
    const resolvedParams = await params;
    
    const body = await req.json();
    const validation = CarSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const updatedCar = await prisma.car.update({
      where: { id: resolvedParams.id },
      data: validation.data
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("🔴 PUT API ERROR:", error);
    return NextResponse.json({ error: "แก้ไขข้อมูลล้มเหลว" }, { status: 500 });
  }
}

// ลบข้อมูลรถยนต์ (Delete)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // ต้อง await params ก่อนถึงจะดึง id ออกมาได้
    const resolvedParams = await params;

    await prisma.car.delete({
      where: { id: resolvedParams.id }
    });
    return NextResponse.json({ message: "ลบข้อมูลสำเร็จ" });
  } catch (error) {
    console.error("🔴 DELETE API ERROR:", error);
    return NextResponse.json({ error: "ลบข้อมูลล้มเหลว" }, { status: 500 });
  }
}