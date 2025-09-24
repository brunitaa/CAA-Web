import { usePictogram } from "../context/Pictogram.context";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Sidebar from "../components/ui/SideBar";
import { Pencil, Archive } from "lucide-react";

export default function PictogramListPage() {
  const { pictograms, loading, archivePictogram } = usePictogram();
  const [archivingId, setArchivingId] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 animate-pulse">Cargando pictogramas...</p>
      </div>
    );
  }

  // Separar activos y archivados
  const activePictograms = pictograms.filter((p) => p.isActive);
  const archivedPictograms = pictograms.filter((p) => !p.isActive);

  const handleArchive = async (id) => {
    if (confirm("¿Deseas archivar este pictograma?")) {
      try {
        setArchivingId(id);
        await archivePictogram(id);
      } catch (err) {
        alert("Error al archivar pictograma.");
      } finally {
        setArchivingId(null);
      }
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Pictogramas</h1>
          <Link
            to="/pictogram"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
          >
            + Nuevo Pictograma
          </Link>
        </div>

        {/* Activos */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Activos</h2>
        {activePictograms.length === 0 ? (
          <p className="text-gray-500 mb-6">No hay pictogramas activos.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {activePictograms.map((p) => (
              <li
                key={p.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 p-6 flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                  {p.image?.fullUrl ? (
                    <img
                      src={p.image.fullUrl}
                      alt={p.name}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Sin imagen</span>
                  )}
                </div>

                <p className="mt-4 text-lg font-semibold text-gray-800">
                  {p.name}
                </p>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/pictogram/edit/${p.id}`}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg shadow transition"
                  >
                    <Pencil size={16} /> Editar
                  </Link>

                  <button
                    onClick={() => handleArchive(p.id)}
                    disabled={archivingId === p.id}
                    className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg shadow transition disabled:opacity-50"
                  >
                    <Archive size={16} /> Archivar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Archivados */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Archivados</h2>
        {archivedPictograms.length === 0 ? (
          <p className="text-gray-500">No hay pictogramas archivados.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivedPictograms.map((p) => (
              <li
                key={p.id}
                className="bg-gray-100 rounded-xl shadow-inner p-6 flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
                  {p.image?.fullUrl ? (
                    <img
                      src={p.image.fullUrl}
                      alt={p.name}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Sin imagen</span>
                  )}
                </div>

                <p className="mt-4 text-lg font-semibold text-gray-500">
                  {p.name}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
