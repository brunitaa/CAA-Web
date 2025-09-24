// pos.context.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  getAllPosRequest,
  getPosByIdRequest,
  updatePosRequest,
} from "../api/pos";

const PosContext = createContext();

export const usePOS = () => {
  const context = useContext(PosContext);
  if (!context) throw new Error("usePOS must be used within a PosProvider");
  return context;
};

export const PosProvider = ({ children }) => {
  const [posList, setPosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  // Memoizar fetchAllPos para evitar que su identidad cambie cada render
  const fetchAllPos = useCallback(async () => {
    setLoading(true);
    setErrors([]); // resetear errores previos
    try {
      const res = await getAllPosRequest();
      if (res && Array.isArray(res.data)) {
        setPosList(res.data);
      } else {
        console.warn("La respuesta de POS no es un array:", res?.data);
        setPosList([]);
      }
    } catch (error) {
      console.error("Error al cargar POS:", error);
      setErrors([error?.response?.data?.message || String(error)]);
      setPosList([]);
    } finally {
      setLoading(false);
    }
  }, []); // si getAllPosRequest cambiara, agrégalo aquí (normalmente es estable)

  // Llamar a fetchAllPos cuando el provider monte. fetchAllPos está memoizado.
  useEffect(() => {
    fetchAllPos();
  }, [fetchAllPos]);

  const getPosById = useCallback(
    async (id) => {
      try {
        const res = await getPosByIdRequest(id);
        return res?.data || null;
      } catch (error) {
        console.error("Error al obtener POS por ID:", error);
        setErrors([error?.response?.data?.message || String(error)]);
        return null;
      }
    },
    [] // si getPosByIdRequest cambia, agrégalo aquí
  );

  const updatePos = useCallback(
    async (id, posData) => {
      try {
        const res = await updatePosRequest(id, posData);
        // actualizar la lista de forma inmutable
        setPosList((prev) => prev.map((p) => (p.id === id ? res.data : p)));
        return res.data;
      } catch (error) {
        console.error("Error al actualizar POS:", error);
        setErrors([error?.response?.data?.message || String(error)]);
        return null;
      }
    },
    [] // agregar dependencias si es necesario
  );

  // Memoizar el objeto value para evitar re-renders innecesarios de consumidores
  const value = useMemo(
    () => ({
      posList,
      loading,
      errors,
      fetchAllPos,
      getPosById,
      updatePos,
    }),
    [posList, loading, errors, fetchAllPos, getPosById, updatePos]
  );

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
};

export default PosContext;
