// components/Sidebar.tsx
import { Frame, Navigation, Select, Spinner } from "@shopify/polaris";
import { HomeIcon, PersonIcon, WorkIcon } from "@shopify/polaris-icons";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthToken } from "../../hooks/useAuthToken";
import { getAllOffices } from "../../services/oficinas";

interface SidebarProps {
  isOpen: boolean;
}

interface NavigationItem {
  url: string;
  label: string;
  icon: typeof HomeIcon,
  selected: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const { userInfo } = useAuthToken();
  const [officeOptions, setOfficeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedOffice, setSelectedOffice] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  // Define navigation items
  const navigationItems: NavigationItem[] = [
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

  // Define permissions for navigation
  const navigationPermissions: Record<string, string[]> = {
    "/leads": [], // No permisos necesarios
    "/usuarios": ["Usuarios"],
    "/oficinas": ["Oficinas"],
    "/sin-asignacion": ["SinAsignacion"],
    "/archivos": ["Archivos"],
  };

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        setLoading(true);
        const allOfficesResponse = await getAllOffices();
        if (
          allOfficesResponse.result &&
          userInfo?.oficinas_permitidas?.length
        ) {
          const permittedOffices = allOfficesResponse.data.filter((office) =>
            userInfo.oficinas_permitidas!.includes(office._id)
          );

          const options = permittedOffices.map((office) => ({
            label: `${office.nombre} (${office.ciudad})`,
            value: office._id,
          }));

          setOfficeOptions(options);

          const storedOffice = localStorage.getItem("oficinaActual");
          if (
            storedOffice &&
            permittedOffices.some((o) => o._id === storedOffice)
          ) {
            setSelectedOffice(storedOffice);
          } else if (permittedOffices.length === 1) {
            setSelectedOffice(permittedOffices[0]._id);
            localStorage.setItem("oficinaActual", permittedOffices[0]._id);
          }
        } else {
          setOfficeOptions([]);
        }
      } catch (error) {
        console.log(error);
        setOfficeOptions([]);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.oficinas_permitidas) {
      fetchOffices();
    } else {
      setLoading(false);
    }
  }, [userInfo]);

  const handleOfficeChange = (value: string) => {
    setSelectedOffice(value);
    localStorage.setItem("oficinaActual", value);
    window.location.reload();
  };

  // Filter navigation items based on user permissions
  const filteredNavigationItems = navigationItems.filter((item) => {
    const requiredPermissions = navigationPermissions[item.url] || [];
    return (
      requiredPermissions.length === 0 ||
      requiredPermissions.some((permiso: string) =>
        userInfo?.permisos?.includes(permiso)
      )
    );
  });

  return (
    <div className={`${isOpen ? "block" : "hidden"} md:block h-full`}>
      <Frame>
        <Navigation location={currentPath}>
          <Navigation.Section items={filteredNavigationItems} />
          <div className="mt-4 px-4">
            {loading ? (
              <Spinner size="small" />
            ) : (
              officeOptions.length > 1 && (
                <Select
                  label="Oficinas Permitidas"
                  options={officeOptions}
                  onChange={handleOfficeChange}
                  value={selectedOffice}
                  placeholder="Selecciona una oficina"
                />
              )
            )}
          </div>
        </Navigation>
      </Frame>
    </div>
  );
}
