// components/Sidebar.tsx
import { Frame, Navigation } from "@shopify/polaris";
import { HomeIcon, PersonIcon, WorkIcon } from "@shopify/polaris-icons";
import { useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      url: "/leads",
      label: "Inicio",
      icon: HomeIcon,
      selected: currentPath === "/leads",
    },
    {
      url: "/usuarios",
      label: "Usuarios",
      icon: PersonIcon,
      selected: currentPath === "/usuarios",
    },
    // {
    //   url: "/coordinadores",
    //   label: "Coordinadores",
    //   icon: WorkIcon,
    //   selected: currentPath === "/coordinadores",
    // },
    {
      url: "/asignaciones",
      label: "Asignaciones",
      icon: WorkIcon,
      selected: currentPath === "/asignaciones",
    },
    {
      url: "/oficinas",
      label: "Oficinas",
      icon: WorkIcon,
      selected: currentPath === "/oficinas",
    },
    {
      url: "/sin-asignacion",
      label: "Sin Asignación",
      icon: WorkIcon,
      selected: currentPath === "/sin-asignacion",
    },
    {
      url: "/archivos",
      label: "Archivos",
      icon: WorkIcon,
      selected: currentPath === "/archivos",
    },
  ];

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
