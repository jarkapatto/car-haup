import { z } from "zod";

export const CarSchema = z.object({
  licensePlate: z.string().min(1, "กรุณากรอกทะเบียนรถยนต์"),
  brand: z.string().min(1, "กรุณากรอกยี่ห้อรถ"),
  model: z.string().min(1, "กรุณากรอกรุ่นรถ"),
  notes: z.string().optional().nullable(),
});