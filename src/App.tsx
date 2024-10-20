// App.tsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import Sidebar from "./components/Sidebar/Sidebar";
import { TopBar1 } from "./components/Topbar/Topbar";
import Vendedores from "./pages/Vendedores/Vendedores";
import Leads from "./pages/Leads/All";
// import Clientes from "./pages/Clientes/Clientes";
import LeadInfo from "./pages/Leads/Leads[id]";
import InfoVendedores from "./pages/Vendedores/Vendedores[id]";
import ClientInfo from "./pages/Clientes/Clients[id]";
import ProspectInfo from "./pages/Prospect/Prospect[id]";
import CompradorInfo from "./pages/Buyer/Buyer[id]";

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

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
    </>
  );

  const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const navigate = useNavigate();

    useEffect(() => {
      const email = localStorage.getItem("email");

      if (!email) {
        navigate("/");
      }
    }, [navigate]);

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
          path="/vendedores"
          element={
            <PrivateRoute>
              <AppLayout>
                <Vendedores />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/vendedor/:id"
          element={
            <PrivateRoute>
              <AppLayout>
                <InfoVendedores />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <PrivateRoute>
              <AppLayout>
                <Leads />
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
          path="/pre-cliente/:id"
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
        {/* <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <AppLayout>
                <Clientes />
              </AppLayout>
            </PrivateRoute>
          }
        /> */}
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
