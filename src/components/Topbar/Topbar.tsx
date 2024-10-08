// components/Topbar/Topbar.tsx
import { TopBar, ActionList, Frame } from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  toggleSidebar: () => void;
}

export function TopBar1({ toggleSidebar }: TopBarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate()

  const toggleIsUserMenuOpen = useCallback(
    () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
    []
  );

  const handleNavigationToggle = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  const handleLogout = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const logo = {
    topBarSource:
      "https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png",
    width: 86,
    url: "#",
    accessibilityLabel: "Shopify",
  };

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [{ content: "Cerrar sesión", icon: ArrowLeftIcon, onAction: handleLogout }],
        },
      ]}
      name="Rodrigo Gutierrez"
      detail="rodrigogutierrezpacheco@gmail.com"
      initials="Ro"
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
  );

  const searchResultsMarkup = (
    <ActionList items={[{ content: "Cerrar sesión", onAction: handleLogout }]} />
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
