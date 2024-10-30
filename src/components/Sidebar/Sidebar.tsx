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

  return (
    <div className={`${isOpen ? "block" : "hidden"} md:block h-full`}>
      <Frame>
        <Navigation location={currentPath}>
          <Navigation.Section
            items={[
              {
                url: "/leads",
                label: "Inicio",
                icon: HomeIcon,
                selected: currentPath === "/leads",
              },
              // {
              //   url: "/leads",
              //   label: "Leads",
              //   icon: PersonIcon,
              //   selected: currentPath === "/leads",
              // },
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
              {
                url: "/oficinas",
                label: "Oficinas",
                icon: WorkIcon,
                selected: currentPath === "/oficinas",
              },
              {
                url: "/coordinadores",
                label: "Coordinadores",
                icon: WorkIcon,
                selected: currentPath === "/coordinadores",
              },
            ]}
          />
        </Navigation>
      </Frame>
    </div>
  );
}
