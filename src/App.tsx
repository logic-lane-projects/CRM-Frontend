import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
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

  const PrivateRoute: React.FC<{
    children: React.ReactNode;
    roles?: string[];
  }> = ({ children, roles }) => {
    const navigate = useNavigate();

    useEffect(() => {
      const email = localStorage.getItem("email");

      if (!email) {
        navigate("/");
      } else if (roles && userInfo && !roles.includes(userInfo.role)) {
        navigate("/");
      }
    }, [navigate, roles]);

    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/inicio"
          element={
            <PrivateRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute roles={["administrador"]}>
              <AppLayout>
                <Usuarios />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/usuario/:id"
          element={
            <PrivateRoute roles={["administrador"]}>
              <AppLayout>
                <InfoUsuarios />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <PrivateRoute>
              <AppLayout>
                {userInfo && userInfo.role === "vendedor" ? (
                  <SellerLeads />
                ) : (
                  <Leads />
                )}{" "}
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/leads/:id"
          element={
            <PrivateRoute>
              <AppLayout>
                <LeadInfo />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cliente/:id"
          element={
            <PrivateRoute>
              <AppLayout>
                <ClientInfo />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/prospecto/:id"
          element={
            <PrivateRoute>
              <AppLayout>
                <ProspectInfo />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/comprador/:id"
          element={
            <PrivateRoute>
              <AppLayout>
                <CompradorInfo />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/oficinas"
          element={
            <PrivateRoute>
              <AppLayout>
                <Oficinas />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/coordinadores"
          element={
            <PrivateRoute roles={["administrador", "coordinador"]}>
              <AppLayout>
                <Coordinadores />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/coordinador/:id"
          element={
            <PrivateRoute roles={["administrador", "coordinador"]}>
              <AppLayout>
                <InfoCoordinador />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/sin-asignacion"
          element={
            <PrivateRoute roles={["administrador", "coordinador"]}>
              <AppLayout>
                <SinAsignacion />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <AppLayout>
                <NotFound />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
