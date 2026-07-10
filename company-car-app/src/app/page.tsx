"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddCarModal from "@/components/AddCarModal";
import EditCarModal from "@/components/EditCarModal"; // นำเข้าปุ่มแก้ไขข้อมูลคันที่เลือก
import { toast } from "sonner"; // นำเข้าเครื่องมือแจ้งเตือน

type Car = {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  notes: string | null;
};

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const res = await fetch("/api/cars");
      if (res.ok) {
        const data = await res.json();
        setCars(data);
      }
    } catch (error) {
      console.error("Failed to fetch cars", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันลบข้อมูล
  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลรถยนต์คันนี้?")) return;

    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("ลบข้อมูลรถยนต์ออกจากระบบเรียบร้อย"); // แจ้งเตือนเมื่อลบสำเร็จ
        fetchCars();
      } else {
        toast.error("ไม่สามารถลบข้อมูลรถยนต์ได้");
      }
    } catch (error) {
      console.error("Failed to delete car", error);
      toast.error("เกิดข้อผิดพลาดของระบบหลังบ้าน");
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ระบบจัดการข้อมูลรถยนต์บริษัท</h1>
        <AddCarModal onSuccess={fetchCars} />
      </div>

      <div className="border rounded-md shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ทะเบียนรถ</TableHead>
              <TableHead>ยี่ห้อ</TableHead>
              <TableHead>รุ่น</TableHead>
              <TableHead>หมายเหตุ</TableHead>
              <TableHead className="text-right">จัดการข้อมูล</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  กำลังดึงข้อมูลระบบฐานข้อมูล...
                </TableCell>
              </TableRow>
            ) : cars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  ยังไม่มีข้อมูลรถยนต์ในระบบในขณะนี้
                </TableCell>
              </TableRow>
            ) : (
              cars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell className="font-semibold text-slate-800">{car.licensePlate}</TableCell>
                  <TableCell>{car.brand}</TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell className="text-slate-500">{car.notes || "-"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {/* ส่งข้อมูลรถยนต์คันนั้นเข้า Modal แก้ไข */}
                    <EditCarModal car={car} onSuccess={fetchCars} />
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(car.id)}
                    >
                      ลบ
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}