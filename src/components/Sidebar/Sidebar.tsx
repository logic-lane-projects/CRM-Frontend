// components/Sidebar.tsx
import { Frame, Navigation } from "@shopify/polaris";
import { HomeIcon } from "@shopify/polaris-icons";

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
                label: "Home",
                icon: HomeIcon,
              },
              {
                url: "/orders",
                label: "Orders",
                icon: HomeIcon,
                badge: "15",
              },
              {
                url: "/products",
                label: "Products",
                icon: HomeIcon,
              },
            ]}
          />
        </Navigation>
      </Frame>
    </div>
  );
}
