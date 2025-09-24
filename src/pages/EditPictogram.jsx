import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editPictogramSchema } from "../schemas/pictogram.schema";
import { Input } from "@heroui/react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/ui/SideBar";
import { usePictogram } from "../context/Pictogram.context";
import { usePOS } from "../context/pos.context";

export default function EditPictogram() {
  const navigate = useNavigate();
  const { id } = useParams(); // id viene de la URL
  const { getPictogramById, updatePictogram } = usePictogram();
  const { posList, fetchAllPos, loading: posLoading } = usePOS();

  const [pictogram, setPictogram] = useState(null);
  const [preview, setPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editPictogramSchema),
    defaultValues: {
      name: "",
      description: "",
      posId: "",
      image: null,
    },
  });

  // Cargar POS y pictograma
  useEffect(() => {
    fetchAllPos();
    const loadPictogram = async () => {
      try {
        const data = await getPictogramById(id);
        setPictogram(data);

        reset({
          name: data.name || "",
          description: data.description || "",
          posId: data.posId?.toString() || "",
          image: null,
        });
      } catch (err) {
        console.error("Error cargando pictograma:", err);
        setErrorMessage("No se pudo cargar el pictograma.");
      }
    };
    loadPictogram();
  }, [id, fetchAllPos, getPictogramById, reset]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("posId", data.posId);
      if (data.image) {
        formData.append("imageFile", data.image);
      }

      const result = await updatePictogram(id, formData);
      console.log("updatePictogram result:", result);

      setErrorMessage(null);
      setSuccessMessage("¡Pictograma actualizado! Redirigiendo...");

      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }

      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (err) {
      console.error("Error al actualizar pictograma:", err);
      setSuccessMessage(null);
      setErrorMessage(
        err?.response?.data?.message || "Error al actualizar el pictograma"
      );
    }
  };

  if (!pictogram) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <p className="text-gray-500">Cargando pictograma...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Editar Pictograma
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

            {/* Imagen actual */}
            <div>
              <p className="font-medium text-gray-700 mb-1">Imagen actual</p>
              {pictogram.image?.fullUrl ? (
                <img
                  src={pictogram.image.fullUrl}
                  alt={pictogram.name}
                  className="w-32 h-32 object-contain border rounded-lg mb-2"
                />
              ) : (
                <p className="text-gray-500 text-sm">Sin imagen</p>
              )}
            </div>

            {/* Nueva imagen */}
            <div>
              <label className="font-medium text-gray-700">Nueva Imagen</label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      field.onChange(file);
                      if (preview) URL.revokeObjectURL(preview);
                      setPreview(file ? URL.createObjectURL(file) : null);
                      console.log("Nueva imagen seleccionada:", file);
                    }}
                    className="mt-1 block w-full"
                  />
                )}
              />
              {errors.image && (
                <p className="text-red-600 text-sm">{errors.image.message}</p>
              )}
            </div>

            {/* Preview nueva */}
            {preview && (
              <div>
                <p className="text-sm text-gray-600">Preview nueva imagen:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-contain border rounded-lg mt-2"
                />
              </div>
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
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 p-2"
            >
              Actualizar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
