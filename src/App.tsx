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
import { Page } from "@shopify/polaris";
import Usuarios from "./pages/Usuarios/Usuarios";

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
        <div>
          <Page>{children}</Page>
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
          path="/usuarios"
          element={
            <AppLayout>
              <Usuarios />
            </AppLayout>
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
