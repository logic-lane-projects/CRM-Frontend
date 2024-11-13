// components/Sidebar.tsx
import { Frame, Navigation } from "@shopify/polaris";
import { HomeIcon, PersonIcon, WorkIcon } from "@shopify/polaris-icons";
import { useLocation } from "react-router-dom";
import { useAuthToken } from "../../hooks/useAuthToken";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { userInfo } = useAuthToken();
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      url: "/leads",
      label: "Inicio",
      icon: HomeIcon,
      selected: currentPath === "/leads",
    },
  ];

  if (userInfo && userInfo.role === "administrador") {
    navigationItems.push({
      url: "/vendedores",
      label: "Vendedores",
      icon: PersonIcon,
      selected: currentPath === "/vendedores",
    });
  }

  if (
    (userInfo && userInfo.role === "administrador") ||
    (userInfo && userInfo.role === "coordinador")
  ) {
    navigationItems.push({
      url: "/coordinadores",
      label: "Coordinadores",
      icon: WorkIcon,
      selected: currentPath === "/coordinadores",
    });
  }



  if (userInfo && userInfo.role === "asignador") {
    navigationItems.push({
      url: "/asignaciones",
      label: "Asignaciones",
      icon: WorkIcon,
      selected: currentPath === "/asignaciones",
    });

  }

  if (
    (userInfo && userInfo.role === "administrador") ||
    (userInfo && userInfo.role === "coordinador")
  ) {
    navigationItems.push({
      url: "/oficinas",
      label: "Oficinas",
      icon: WorkIcon,
      selected: currentPath === "/oficinas",
    });

  }

  if (
    (userInfo && userInfo.role === "administrador") ||
    (userInfo && userInfo.role === "coordinador")
  ) {
    navigationItems.push({
      url: "/sin-asignacion",
      label: "Sin Asignacion",
      icon: WorkIcon,
      selected: currentPath === "/sin-asignacion",
    });

  }


  return (
    <div className={`${isOpen ? "block" : "hidden"} md:block h-full`}>
      <Frame>
        <Navigation location={currentPath}>
          <Navigation.Section items={navigationItems} />
        </Navigation>
      </Frame>
    </div>
  );
}
