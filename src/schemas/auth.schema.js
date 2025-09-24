import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Ingrese un Email Valido",
  }),
  password: z.string().min(6, {
    message: "Contraseña debe ser 6 digitos",
  }),
});
