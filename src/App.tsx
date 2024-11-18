import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuthToken } from "./hooks/useAuthToken";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import Sidebar from "./components/Sidebar/Sidebar";
import { TopBar1 } from "./components/Topbar/Topbar";
import Leads from "./pages/Leads/All";
import LeadInfo from "./pages/Leads/Leads[id]";
import ClientInfo from "./pages/Clientes/Clients[id]";
import ProspectInfo from "./pages/Prospect/Prospect[id]";
import CompradorInfo from "./pages/Buyer/Buyer[id]";
import Oficinas from "./pages/Oficinas/Oficinas";
import Coordinadores from "./pages/Coordinadores/Coordinadores";
import InfoCoordinador from "./pages/Coordinadores/Coordinadores[id]";
import Footer from "./components/Footer/Footer";
import SinAsignacion from "./pages/SinAsignacion/SinAsignacion";
import SellerLeads from "./pages/Leads/SellerLeads";
import Usuarios from "./pages/Usuarios/Usuarios";
import InfoUsuarios from "./pages/Usuarios/Usuarios[id]";
import Archivos from "./pages/Archivos/Archivos";

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const { userInfo } = useAuthToken();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <>
      <TopBar1 toggleSidebar={toggleSidebar} />
      <div style={{ display: "flex" }}>
        <Sidebar isOpen={isSidebarOpen} />
        <div className="w-full">
          <div className="w-full p-4">{children}</div>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/inicio"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />
        <Route
          path="/usuarios"
          element={
            <AppLayout>
              <Usuarios />
            </AppLayout>
          }
        />
        <Route
          path="/usuario/:id"
          element={
            <AppLayout>
              <InfoUsuarios />
            </AppLayout>
          }
        />
        <Route
          path="/leads"
          element={
            <AppLayout>
              {userInfo && userInfo.role === "vendedor" ? <SellerLeads /> : <Leads />}
            </AppLayout>
          }
        />
        <Route
          path="/leads/:id"
          element={
            <AppLayout>
              <LeadInfo />
            </AppLayout>
          }
        />
        <Route
          path="/cliente/:id"
          element={
            <AppLayout>
              <ClientInfo />
            </AppLayout>
          }
        />
        <Route
          path="/prospecto/:id"
          element={
            <AppLayout>
              <ProspectInfo />
            </AppLayout>
          }
        />
        <Route
          path="/comprador/:id"
          element={
            <AppLayout>
              <CompradorInfo />
            </AppLayout>
          }
        />
        <Route
          path="/oficinas"
          element={
            <AppLayout>
              <Oficinas />
            </AppLayout>
          }
        />
        <Route
          path="/coordinadores"
          element={
            <AppLayout>
              <Coordinadores />
            </AppLayout>
          }
        />
        <Route
          path="/coordinador/:id"
          element={
            <AppLayout>
              <InfoCoordinador />
            </AppLayout>
          }
        />
        <Route
          path="/sin-asignacion"
          element={
            <AppLayout>
              <SinAsignacion />
            </AppLayout>
          }
        />
        <Route
          path="/archivos"
          element={
            <AppLayout>
              <Archivos />
            </AppLayout>
          }
        />
        <Route
          path="*"
          element={
            <AppLayout>
              <NotFound />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
