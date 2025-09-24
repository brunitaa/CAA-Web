import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LogOutIcon,
  LayoutGridIcon,
  ImageIcon,
  UsersIcon,
  LibraryIcon,
} from "lucide-react";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-indigo-700 text-white flex flex-col p-6 rounded-r-3xl shadow-lg">
      <h2 className="text-xl font-bold mb-8">CAA Admin</h2>

      <nav className="flex flex-col gap-4">
        {/* Grids */}
        <button
          type="button"
          onClick={() => navigate("/admin/grids")}
          className="flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          <LayoutGridIcon className="w-5 h-5" />
          Grids
        </button>

        {/* Pictogramas */}
        <button
          type="button"
          onClick={() => navigate("/admin/pictograms")}
          className="flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          <ImageIcon className="w-5 h-5" />
          Pictogramas
        </button>

        {/* Usuarios */}
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          <UsersIcon className="w-5 h-5" />
          Usuarios
        </button>

        {/* Biblioteca */}
        <button
          type="button"
          onClick={() => navigate("/admin/library")}
          className="flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          <LibraryIcon className="w-5 h-5" />
          Biblioteca
        </button>
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-md hover:shadow-lg rounded-lg font-semibold transition-all duration-200"
      >
        <LogOutIcon className="w-5 h-5" />
        Cerrar Sesión
      </button>
    </aside>
  );
}
