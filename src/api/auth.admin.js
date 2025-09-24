import api from "./axios";
export const registerAdminRequest = async (user) =>
  api.post(`/admin/register`, user);
export const loginAdminRequest = async (user) => api.post(`/admin/login`, user);
export const getProfileRequest = async (user) => api.get(`/auth/profile`, user);
export const logoutRequest = async (user) => api.post(`/auth/logout`, user);
export const verifyTokenRequest = async (user) =>
  api.post(`auth/validate`, user);
