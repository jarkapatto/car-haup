"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CarSchema } from "@/schemas/car.schema";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner"; // นำเข้าตัวแจ้งเตือน

type Car = {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  notes: string | null;
};

export default function EditCarModal({ car, onSuccess }: { car: Car; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof CarSchema>>({
    resolver: zodResolver(CarSchema),
  });

  // คอยอัปเดตค่าในฟอร์มให้ตรงกับรถยนต์คันที่กดเลือกแก้ไข
  useEffect(() => {
    if (open) {
      reset({
        licensePlate: car.licensePlate,
        brand: car.brand,
        model: car.model,
        notes: car.notes || "",
      });
    }
  }, [open, car, reset]);

  const onSubmit = async (values: z.infer<typeof CarSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cars/${car.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setOpen(false);
        toast.success("แก้ไขข้อมูลรถยนต์สำเร็จ"); // แจ้งเตือนแบบสวยงาม
        onSuccess();
      } else {
        toast.error("แก้ไขไม่สำเร็จ ทะเบียนรถอาจจะซ้ำกับคันอื่น");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดของระบบ");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: "outline", size: "sm" })}>
        แก้ไข
        </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>แก้ไขข้อมูลรถยนต์</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">ทะเบียนรถยนต์</label>
            <input {...register("licensePlate")} className={inputClass} />
            {errors.licensePlate && <p className="text-sm text-red-500">{errors.licensePlate.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ยี่ห้อ</label>
            <input {...register("brand")} className={inputClass} />
            {errors.brand && <p className="text-sm text-red-500">{errors.brand.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">รุ่น</label>
            <input {...register("model")} className={inputClass} />
            {errors.model && <p className="text-sm text-red-500">{errors.model.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">หมายเหตุ</label>
            <input {...register("notes")} className={inputClass} />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}