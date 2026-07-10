"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CarSchema } from "@/schemas/car.schema";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddCarModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ตั้งค่า Form และ Zod Validation (แบบไม่ต้องใช้ shadcn form wrapper)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof CarSchema>>({
    resolver: zodResolver(CarSchema),
  });

  const onSubmit = async (values: z.infer<typeof CarSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        reset(); 
        setOpen(false); 
        toast.success("เพิ่มข้อมูลรถยนต์สำเร็จ");
        onSuccess(); 
      } else {
        toast.error("บันทึกไม่สำเร็จ ทะเบียนรถยนต์นี้มีอยู่ในระบบแล้ว");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // คลาสของ Tailwind ที่ทำให้หน้าตา Input เหมือนของ shadcn เป๊ะๆ
  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants()}>
        + เพิ่มข้อมูลรถยนต์
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เพิ่มรถยนต์คันใหม่</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">ทะเบียนรถยนต์</label>
            <input {...register("licensePlate")} className={inputClass} placeholder="เช่น กข 1234 กทม" />
            {errors.licensePlate && <p className="text-sm text-red-500">{errors.licensePlate.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">ยี่ห้อ</label>
            <input {...register("brand")} className={inputClass} placeholder="เช่น Toyota, Honda" />
            {errors.brand && <p className="text-sm text-red-500">{errors.brand.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">รุ่น</label>
            <input {...register("model")} className={inputClass} placeholder="เช่น Camry, Civic" />
            {errors.model && <p className="text-sm text-red-500">{errors.model.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">หมายเหตุ (ถ้ามี)</label>
            <input {...register("notes")} className={inputClass} placeholder="เช่น รถผู้บริหาร, รถแผนกเซลส์" />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}