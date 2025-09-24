import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
} from "@heroui/react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signinAdmin, isAdmin } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("submit fired", data);
    try {
      const user = await signinAdmin(data);
      console.log("user:", user);
      setErrorMessage(null);
      setSuccessMessage("¡Login exitoso! Redirigiendo...");
      reset();

      setTimeout(() => {
        if (user.role == "admin") {
          navigate("/admin");
        } else {
          navigate("/g");
        }
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      setSuccessMessage(null);
      setErrorMessage(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl p-6 bg-white">
        <CardHeader className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
          <p className="text-gray-500 mt-1">
            Ingresa tus credenciales para continuar
          </p>
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-2 rounded-md text-sm text-center">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 text-green-700 p-2 rounded-md text-sm text-center">
              {successMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="email@dominio.tld"
                {...register("email", { required: "Email es obligatorio" })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "Debe tener al menos 6 caracteres",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200"
            >
              Iniciar Sesión
            </Button>
          </form>
        </CardBody>

        <CardFooter className="text-center text-sm text-gray-500 mt-4">
          ¿Te olvidaste tu contraseña?{" "}
          <a
            href="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Recuperala
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
