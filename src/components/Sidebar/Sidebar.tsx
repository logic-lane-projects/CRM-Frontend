// components/Sidebar.tsx
import { Frame, Navigation } from "@shopify/polaris";
import { HomeIcon, PersonIcon } from "@shopify/polaris-icons";
import { useLocation } from "react-router-dom"; // Importa el hook useLocation para obtener la URL actual

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation(); // Obtiene la ubicación actual en react-router
  const currentPath = location.pathname; // Obtiene la ruta actual

  return (
    <div className={`${isOpen ? "block" : "hidden"} md:block h-full`}>
      <Frame>
        <Navigation location={currentPath}>
          <Navigation.Section
            items={[
              {
                url: "/inicio",
                label: "Inicio",
                icon: HomeIcon,
                selected: currentPath === "/inicio",
              },
              {
                url: "/leads",
                label: "Leads",
                icon: PersonIcon,
                selected: currentPath === "/leads",
              },
              // {
              //   url: "/clientes",
              //   label: "Clientes",
              //   icon: PersonIcon,
              //   selected: currentPath === "/clientes",
              // },
              {
                url: "/vendedores",
                label: "Vendedores",
                icon: PersonIcon,
                selected: currentPath === "/vendedores",
              },
            ]}
          />
        </Navigation>
      </Frame>
    </div>
  );
}
