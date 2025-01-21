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
  icon: typeof HomeIcon;
  selected: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userInfo } = useAuthToken();
  const [officeOptions, setOfficeOptions] = useState<
    { label: string; value: string; telefono: string, city:string, state:string }[]
  >([]);
  const [selectedOffice, setSelectedOffice] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  const navigationItems: NavigationItem[] = [
    {
      url: "/leads",
      label: "Clientes",
      icon: HomeIcon,
      selected: currentPath === "/leads",
    },
    {
      url: "/clientes-por-oficina",
      label: "Clientes por oficina",
      icon: HomeIcon,
      selected: currentPath === "/clientes-por-oficina",
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
      label: "Sin Oficinas",
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

  const navigationPermissions: Record<string, string[]> = {
    "/leads": [],
    "/usuarios": ["Usuarios"],
    "/oficinas": ["Oficinas"],
    "/sin-asignacion": ["Sin Asignación"],
    "/archivos": ["Archivos"],
    "/clientes-por-oficina": ["Clientes por Oficina"],
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
            telefono: office.numero_telefonico,
            state: office?.estado,
            city: office?.ciudad
          }));

          setOfficeOptions(options);

          const storedOffice = localStorage.getItem("oficinaActual");
          if (
            storedOffice &&
            permittedOffices.some((o) => o._id === storedOffice)
          ) {
            setSelectedOffice(storedOffice);
            const officePhone = permittedOffices.find(
              (o) => o._id === storedOffice
            )?.numero_telefonico;
            if (officePhone) {
              localStorage.setItem("telefonoOficinaActual", officePhone);

            }
          } else if (permittedOffices.length === 1) {
            setSelectedOffice(permittedOffices[0]._id);
            localStorage.setItem("oficinaActual", permittedOffices[0]._id);
            localStorage.setItem(
              "telefonoOficinaActual",
              permittedOffices[0].numero_telefonico || ""
            );
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
    const selectedOfficeDetails = officeOptions.find(
      (office) => office.value === value
    );
    if (selectedOfficeDetails) {
      localStorage.setItem(
        "telefonoOficinaActual",
        selectedOfficeDetails.telefono
      );
      const officeName = selectedOfficeDetails?.label.split(" (")[0];
      localStorage.setItem("oficinaActualNombre", officeName);
      localStorage.setItem("ciudadOficinaActual", selectedOfficeDetails?.city);
      localStorage.setItem("estadoOficinaActual", selectedOfficeDetails?.state);
    }
    window.location.reload();
  };

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
          <Navigation.Section
            items={filteredNavigationItems.map((item) => ({
              ...item,
              disabled: !selectedOffice,
            }))}
          />
          <div className="mt-4 px-4">
            {loading ? (
              <Spinner size="small" />
            ) : (
              officeOptions.length > 1 && (
                <Select
                  label="Oficinas Permitidas"
                  options={officeOptions.map(({ label, value }) => ({
                    label,
                    value,
                  }))}
                  onChange={handleOfficeChange}
                  value={selectedOffice}
                  placeholder="Selecciona una oficina"
                  error={selectedOffice === undefined && "Selecciona una oficina para continuar"}
                />
              )
            )}
          </div>
          <div className="px-5">
            {selectedOffice && (
              <div className="flex flex-col">
                <span>Teléfono oficina:</span>
                <span className="font-bold text-[15px]">
                  {officeOptions.find(
                    (office) => office.value === selectedOffice
                  )?.telefono || "No disponible"}
                </span>
              </div>
            )}
          </div>
        </Navigation>
      </Frame>
    </div>
  );
}
