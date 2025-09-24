import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pictogramSchema } from "../schemas/pictogram.schema";
import { Input } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/ui/SideBar";
import { usePictogram } from "../context/Pictogram.context";
import { usePOS } from "../context/pos.context";

export default function CreatePictogram() {
  const navigate = useNavigate();
  const { createPictogram } = usePictogram();
  const { posList, fetchAllPos, loading: posLoading } = usePOS();

  const [preview, setPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pictogramSchema),
    defaultValues: {
      name: "",
      description: "",
      posId: "",
      image: null,
    },
  });

  useEffect(() => {
    fetchAllPos();
  }, [fetchAllPos]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = async (data) => {
    console.log("🔹 onSubmit START", data);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("posId", data.posId);
      formData.append("imageFile", data.image);

      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const result = await createPictogram(formData);
      console.log("createPictogram result:", result);

      setErrorMessage(null);
      setSuccessMessage("¡Pictograma creado! Redirigiendo...");
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
      reset();

      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (err) {
      console.error("Error al crear pictograma:", err);
      setSuccessMessage(null);
      setErrorMessage(
        err?.response?.data?.message || "Error al guardar el pictograma"
      );
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Crear Pictograma
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Nombre */}
            <div>
              <label className="font-medium text-gray-700">Nombre</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input type="text" placeholder="Ej: Casa" {...field} />
                )}
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="font-medium text-gray-700">Descripción</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Ej: Lugar donde vivo"
                    {...field}
                  />
                )}
              />
            </div>

            {/* POS */}
            <div>
              <label className="font-medium text-gray-700">POS</label>
              <Controller
                name="posId"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="mt-1 block w-full border-gray-300 rounded-lg p-2"
                  >
                    <option value="" disabled>
                      {posLoading ? "Cargando POS..." : "Selecciona un POS"}
                    </option>
                    {posList.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.posId && (
                <p className="text-red-600 text-sm">{errors.posId.message}</p>
              )}
            </div>

            {/* Imagen */}
            <div>
              <label className="font-medium text-gray-700">Imagen</label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      field.onChange(file); // pasa solo un File
                      if (preview) URL.revokeObjectURL(preview);
                      setPreview(file ? URL.createObjectURL(file) : null);
                      console.log("Imagen seleccionada:", file);
                    }}
                    className="mt-1 block w-full"
                  />
                )}
              />
              {errors.image && (
                <p className="text-red-600 text-sm">{errors.image.message}</p>
              )}
            </div>

            {/* Preview */}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-contain border rounded-lg mt-2"
              />
            )}

            {/* Mensajes */}
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

            {/* Botón submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 p-2"
            >
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
