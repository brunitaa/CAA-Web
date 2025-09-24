// src/pages/AdminDashboard.jsx
import React from "react";
import Sidebar from "../components/ui/SideBar";
import Card from "../components/ui/Card";
import ChartLine from "../components/ui/ChartLine";
import ChartBars from "../components/ui/ChartBars";
import { usePictogram } from "../context/Pictogram.context";

export default function AdminDashboard({ userName = "Administrador" }) {
  const { pictograms, loading } = usePictogram();

  // Calcular métricas dinámicas
  const totalPictograms = pictograms.length;
  const totalUsers = 5; // Ejemplo, se puede traer de un context de usuarios
  const recentUploads = pictograms.slice(-4).reverse(); // últimos 4 pictogramas
  const pictogramCategories = pictograms.reduce((acc, p) => {
    const category = p.category || "Sin categoría";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  const activityStats = []; // Se puede mapear uploads por día
  const uploadsLast7Days = activityStats.reduce(
    (s, d) => s + (d.uploads || 0),
    0
  );
  const avgPerDay =
    Math.round((uploadsLast7Days / (activityStats.length || 7)) * 10) / 10;

  if (loading) return <div>Cargando pictogramas...</div>;

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <Sidebar userName={userName} />

      <main className="flex-1 p-6 flex flex-col gap-6 overflow-auto">
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Panel de Administración
            </h1>
            <p className="text-gray-500 mt-1">Resumen general del sistema</p>
          </div>
          <button
            onClick={() => (window.location.href = "/pictogram")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            + Subir pictograma
          </button>
        </header>

        {/* Quick Stats */}
        <section className="grid grid-cols-3 gap-6">
          <Card title="Total pictogramas" value={totalPictograms} />
          <Card title="Usuarios activos" value={totalUsers} />
          <Card title="Subidas últimas 7 días" value={uploadsLast7Days}>
            <p className="text-xs text-gray-500">
              Promedio diario: {avgPerDay}
            </p>
          </Card>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Actividad — última semana
            </h3>
            <ChartLine data={activityStats} width={420} height={140} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Distribución por categoría
            </h3>
            <ChartBars data={Object.entries(pictogramCategories)} />
          </div>
        </section>

        {/* Recent uploads */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Pictogramas recientes
          </h2>
          {recentUploads.length > 0 ? (
            <div className="grid grid-cols-4 gap-6">
              {recentUploads.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center p-3 bg-gray-50 border border-gray-200 rounded-2xl hover:shadow-md"
                >
                  {/* Mostrar imagen con fullUrl */}
                  <img
                    src={p.image?.fullUrl}
                    alt={p.name}
                    className="w-16 h-16 object-contain mb-2"
                  />
                  <div className="text-sm font-medium text-gray-700 text-center">
                    {p.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              No hay pictogramas recientes.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
