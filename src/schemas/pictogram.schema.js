import { z } from "zod";

export const pictogramSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  posId: z.string().min(1, "Debes seleccionar un POS"),
  image: z.instanceof(File, "Debes seleccionar una imagen"),
});

export const editPictogramSchema = z.object({
  name: z.string().optional(), // opcional
  description: z.string().optional(),
  posId: z.string().optional(),
  image: z
    .instanceof(File, { message: "Debe ser un archivo de imagen" })
    .nullable() // permite null
    .optional(), // permite que no esté presente
});
