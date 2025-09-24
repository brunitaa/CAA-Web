// src/components/layouts/AuthLayout.tsx
interface AuthLayoutProps {
  children: React.ReactNode;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
}

export default function AuthLayout({
  children,
  heroTitle = "Bienvenido a CAA Admin",
  heroSubtitle = "Gestiona pictogramas, usuarios y métricas",
  heroImage,
}: AuthLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen">
      <div className="hidden lg:flex flex-1 bg-gradient-to-tr from-indigo-600 to-blue-500 relative overflow-hidden">
        {heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${heroImage})` }}
          ></div>
        )}
        <div className="m-auto text-white text-center px-12">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            {heroTitle}
          </h1>
          <p className="text-lg opacity-90">{heroSubtitle}</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-white">
        {children}
      </div>
    </div>
  );
}
