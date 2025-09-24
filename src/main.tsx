import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "../src/context/AuthContext";
import { PictogramProvider } from "./context/Pictogram.context";
import { PosProvider } from "./context/pos.context";
import { HeroUIProvider } from "@heroui/react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <AuthProvider>
        <PictogramProvider>
          <PosProvider>
            <AppRoutes />
          </PosProvider>
        </PictogramProvider>
      </AuthProvider>
    </HeroUIProvider>
  </React.StrictMode>
);
