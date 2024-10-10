// components/Sidebar.tsx
import { Frame, Navigation } from "@shopify/polaris";
import { HomeIcon, PersonFilledIcon } from "@shopify/polaris-icons";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <div className={`${isOpen ? "block" : "hidden"} md:block h-full`}>
      <Frame>
        <Navigation location="/">
          <Navigation.Section
            items={[
              {
                url: "/inicio",
                label: "Inicio",
                icon: HomeIcon,
              },
              {
                url: "/leads",
                label: "Leads",
                icon: HomeIcon,
              },
              {
                url: "/clientes",
                label: "Clientes",
                icon: HomeIcon,
              },
              {
                url: "/usuarios",
                label: "Usuarios",
                icon: PersonFilledIcon,
              },
              {
                url: "/usuarios",
                label: "Vendedores",
                icon: PersonFilledIcon,
              },
            ]}
          />
        </Navigation>
      </Frame>
    </div>
  );
}
