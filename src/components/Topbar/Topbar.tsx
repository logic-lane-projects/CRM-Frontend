import { TopBar, ActionList, Frame } from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./../../../firebase";
import { useAuthToken } from "../../hooks/useAuthToken";

interface TopBarProps {
  toggleSidebar: () => void;
}

export function TopBar1({ toggleSidebar }: TopBarProps) {
  const { userInfo } = useAuthToken();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const toggleIsUserMenuOpen = useCallback(
    () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
    []
  );

  const handleNavigationToggle = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("email");
      localStorage.removeItem("accesTokenCRM");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [navigate]);

  const logo = {
    topBarSource:
      "https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png",
    width: 86,
    url: "/",
    accessibilityLabel: "Shopify",
  };

  function cortarEmailAntesDeArroba(email: string) {
    if (!email.includes("@")) {
      return "Correo no válido";
    }

    const parteAntesDeArroba = email.split("@")[0];
    return parteAntesDeArroba?.toUpperCase();
  }

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [
            {
              content: "Cerrar sesión",
              icon: ArrowLeftIcon,
              onAction: handleLogout,
            },
          ],
        },
      ]}
      name={cortarEmailAntesDeArroba(email || "")}
      detail={email || ""}
      initials={email?.slice(0, 2)}
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
  );

  const searchResultsMarkup = (
    <ActionList
      items={[{ content: "Cerrar sesión", onAction: handleLogout }]}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      searchResults={searchResultsMarkup}
      onNavigationToggle={handleNavigationToggle}
    />
  );

  return (
    <div style={{ height: "50px" }}>
      <Frame topBar={topBarMarkup} logo={logo} />
    </div>
  );
}
