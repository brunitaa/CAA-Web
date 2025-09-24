import api from "./axios";

// Crear un pictograma
export const createGridRequest = async (formData) => {
  return api.post("/grids/create", formData);
};
export const updateGridRequest = async (id, formData) =>
  api.put(`/grids/edit/${id}`, formData);

export const deleteGridRequest = async (id) =>
  api.delete(`/grids/delete/${id}`);

export const getGridRequest = async (id) => api.get(`/grids/${id}`);
