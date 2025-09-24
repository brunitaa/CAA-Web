import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createPictogramRequest,
  getAllPictogramsRequest,
  updatePictogramRequest,
  getPictogramRequest,
  deletePictogramRequest, // soft delete
} from "../api/pictogram";
import {
  attachFullImageUrl,
  attachFullImageUrlArray,
} from "../utils/serialize";

const PictogramContext = createContext();

export const usePictogram = () => {
  const context = useContext(PictogramContext);
  if (!context)
    throw new Error("usePictogram must be used within a PictogramProvider");
  return context;
};

export const PictogramProvider = ({ children }) => {
  const [pictograms, setPictograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  // Obtener todos los pictogramas
  const fetchAllPictograms = async () => {
    setLoading(true);
    try {
      const res = await getAllPictogramsRequest();
      const pictosWithUrl = attachFullImageUrlArray(
        res.data,
        "http://localhost:4000"
      );
      setPictograms(pictosWithUrl);
    } catch (err) {
      console.error("Error fetching pictograms:", err);
      setErrors([err.response?.data?.message || "Error al cargar pictogramas"]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPictograms();
  }, []);

  // Crear pictograma
  const createPictogram = async (formData) => {
    try {
      const res = await createPictogramRequest(formData);
      const pictogramWithUrl = attachFullImageUrl(
        res.data,
        "http://localhost:4000"
      );
      setPictograms((prev) => [...prev, pictogramWithUrl]);
      return pictogramWithUrl;
    } catch (err) {
      console.error("Error creating pictogram:", err);
      setErrors([err.response?.data?.message || "Error al crear pictograma"]);
      throw err;
    }
  };

  // Actualizar pictograma
  const updatePictogram = async (id, formData) => {
    try {
      const res = await updatePictogramRequest(id, formData);
      const updatedWithUrl = attachFullImageUrl(
        res.data,
        "http://localhost:4000"
      );
      setPictograms((prev) =>
        prev.map((p) => (p.id === id ? updatedWithUrl : p))
      );
      return updatedWithUrl;
    } catch (err) {
      console.error("Error updating pictogram:", err);
      setErrors([
        err.response?.data?.message || "Error al actualizar pictograma",
      ]);
      throw err;
    }
  };

  // Obtener un pictograma por ID
  const getPictogramById = async (id) => {
    try {
      const res = await getPictogramRequest(id);
      return attachFullImageUrl(res.data, "http://localhost:4000");
    } catch (err) {
      console.error("Error fetching pictogram by ID:", err);
      setErrors([err.response?.data?.message || "Error al obtener pictograma"]);
      throw err;
    }
  };

  // Archivar pictograma (soft delete)
  const archivePictogram = async (id) => {
    try {
      await deletePictogramRequest(id); // backend marca isActive = false
      setPictograms((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: false } : p))
      );
    } catch (err) {
      console.error("Error archiving pictogram:", err);
      throw err;
    }
  };

  return (
    <PictogramContext.Provider
      value={{
        pictograms,
        loading,
        errors,
        fetchAllPictograms,
        createPictogram,
        updatePictogram,
        getPictogramById,
        archivePictogram,
      }}
    >
      {children}
    </PictogramContext.Provider>
  );
};

export default PictogramContext;
