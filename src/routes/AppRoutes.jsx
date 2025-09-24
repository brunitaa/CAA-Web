import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import CreatePictogram from "../pages/CreatePictogram";
import { useAuth } from "../context/AuthContext";
import EditPictogram from "../pages/EditPictogram";
import PictogramListPage from "../pages/PictogramList";

// Componente para rutas protegidas
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>; // Spinner opcional
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pictogram"
          element={
            <ProtectedRoute>
              <CreatePictogram />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pictogram/edit/:id"
          element={
            <ProtectedRoute>
              <EditPictogram />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/pictograms" element={<PictogramListPage />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
