import { useState, useEffect, SetStateAction } from "react";
import ModalRegistroUsuarios from "../../components/Modales/ModalRegistroUsuarios";
import {
  IndexTable,
  TextField,
  Pagination,
  Button,
  Card,
  Badge,
  Select,
} from "@shopify/polaris";
import { getAllUsers, User } from "../../services/user";
import { Toast } from "../../components/Toast/toast";
import { useNavigate } from "react-router-dom";
import ModalAsignacionCoordinador from "../../components/Modales/ModalAsignacionCoordinador";
import { useAuthToken } from "../../hooks/useAuthToken";
import { getAllOffices } from "../../services/oficinas";

export default function Usuarios() {
  const { userInfo } = useAuthToken();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [offices, setOffices] = useState<{ _id: string; nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [isOpenCoordinador, setIsOpenCoordinador] = useState(false);
  const [showWithoutOffices, setShowWithoutOffices] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.success && response.data) {
          setUsuarios(response.data);
        } else {
          throw new Error(response.message || "Error al cargar usuarios");
        }
      } catch (error) {
        setError("Error al cargar los usuarios");
        const errorMessage = typeof error === "string" ? error : String(error);
        Toast.fire({
          icon: "error",
          title: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchOffices = async () => {
      try {
        const allOfficesResponse = await getAllOffices();
        if (allOfficesResponse.result) {
          setOffices(allOfficesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching offices:", error);
      }
    };

    fetchUsers();
    fetchOffices();
  }, []);

  const filteredUsuarios = Array.isArray(usuarios)
    ? usuarios.filter((usuario: User) => {
        const officeNames = usuario.oficinas_permitidas
          ?.map((officeId) => {
            const office = offices.find((office) => office._id === officeId);
            return office?.nombre || "";
          })
          .join(", ");

        if (showWithoutOffices) {
          return (
            !usuario.oficinas_permitidas ||
            usuario.oficinas_permitidas.length === 0
          );
        }

        return (
          usuario.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          usuario.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          usuario.city.toLowerCase().includes(searchValue.toLowerCase()) ||
          officeNames?.toLowerCase().includes(searchValue.toLowerCase())
        );
      })
    : [];

  const numItemsPerPage =
    itemsPerPage === "todos"
      ? filteredUsuarios.length
      : parseInt(itemsPerPage, 10);

  const paginatedUsuarios = filteredUsuarios.slice(
    (currentPage - 1) * numItemsPerPage,
    currentPage * numItemsPerPage
  );

  const totalPages = Math.ceil(filteredUsuarios.length / numItemsPerPage);

  const promotedBulkActions = [
    {
      content: "Ver Usuario",
      onAction: () => {
        navigate(`/usuario/${selectedResource}`);
      },
    },
  ];

  const handlePagination = (direction: "previous" | "next") => {
    setCurrentPage((prevPage) => {
      if (direction === "next" && prevPage < totalPages) {
        return prevPage + 1;
      } else if (direction === "previous" && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  const rowMarkup = paginatedUsuarios.map(
    (
      { _id, name, email, city, role, oficinas_permitidas }: User,
      index: number
    ) => {
      const officeNames = oficinas_permitidas
        ?.map((officeId) => {
          const office = offices.find((office) => office._id === officeId);
          return office?.nombre || "Oficina desconocida";
        })
        .join(", ");

      return (
        <IndexTable.Row
          id={_id ?? "unknown-id"}
          key={_id ?? index}
          position={index}
          selected={selectedResource === _id}
          onClick={() => {
            setSelectedResource(
              selectedResource === _id ? "" : _id ?? "unknown-id"
            );
          }}
        >
          <IndexTable.Cell>{name ?? "Nombre desconocido"}</IndexTable.Cell>
          <IndexTable.Cell>{email ?? "Correo desconocido"}</IndexTable.Cell>
          <IndexTable.Cell>{city ?? "Ciudad desconocida"}</IndexTable.Cell>
          <IndexTable.Cell>
            {officeNames || (
              <Button
                onClick={() => navigate(`/usuario/${_id}`)}
                variant="primary"
              >
                Agregar oficinas
              </Button>
            )}
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Badge>{role ?? "Sin rol"}</Badge>
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    }
  );

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex w-full justify-between items-center">
        <span className="font-semibold text-[20px]">Usuarios</span>
        <div className="flex gap-2">
          <Button onClick={() => setIsOpen(true)} variant="primary">
            Registro
          </Button>
          <Button
            onClick={() => {
              setShowWithoutOffices((prev) => !prev);
              setCurrentPage(1);
            }}
            variant="secondary"
          >
            {showWithoutOffices
              ? "Mostrar todos los usuarios"
              : "Usuarios sin oficinas"}
          </Button>
        </div>
      </div>
      <Card>
        <div className="flex flex-col gap-4">
          <TextField
            label="Buscar Usuarios"
            value={searchValue}
            onChange={(value) => {
              setSearchValue(value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por nombre, correo, ciudad u oficina"
            clearButton
            onClearButtonClick={() => setSearchValue("")}
            autoComplete="off"
          />

          <IndexTable
            resourceName={{ singular: "usuario", plural: "usuarios" }}
            itemCount={filteredUsuarios.length}
            selectedItemsCount={selectedResource ? 1 : 0}
            onSelectionChange={() => {}}
            headings={[
              { title: "Nombre" },
              { title: "Correo Electrónico" },
              { title: "Ciudad" },
              { title: "Oficinas" },
              { title: "Rol" },
            ]}
            promotedBulkActions={promotedBulkActions}
            emptyState="No se encontraron resultados"
          >
            {rowMarkup}
          </IndexTable>
          <div className="flex flex-row-reverse items-center w-full justify-between">
            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={() => handlePagination("previous")}
              hasNext={currentPage < totalPages}
              onNext={() => handlePagination("next")}
            />
            <Select
              label=""
              options={[
                { label: "10", value: "10" },
                { label: "20", value: "20" },
                { label: "Todos", value: "todos" },
              ]}
              value={itemsPerPage}
              onChange={(value: SetStateAction<string>) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </Card>
      {isOpen && (
        <ModalRegistroUsuarios isOpen={isOpen} setIsOpen={setIsOpen} />
      )}

      {isOpenCoordinador && (
        <ModalAsignacionCoordinador
          isOpen={isOpenCoordinador}
          setIsOpen={setIsOpenCoordinador}
          assignedTo={""}
          userId={userInfo?.id}
          vendedorId={selectedResource}
        />
      )}
    </div>
  );
}
