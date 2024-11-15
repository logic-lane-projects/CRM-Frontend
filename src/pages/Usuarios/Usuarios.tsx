import { useState, useEffect } from "react";
import ModalRegistroUsuarios from "../../components/Modales/ModalRegistroUsuarios";
import {
  IndexTable,
  TextField,
  Pagination,
  Button,
  Card,
  Select,
  Badge,
} from "@shopify/polaris";
import { getUsers, User } from "../../services/users";
import { Toast } from "../../components/Toast/toast";
import { useNavigate } from "react-router-dom";
import ModalAsignacionCoordinador from "../../components/Modales/ModalAsignacionCoordinador";
import { useAuthToken } from "../../hooks/useAuthToken";

export default function Usuarios() {
  const { userInfo } = useAuthToken();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [isOpenCoordinador, setIsOpenCoordinador] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Traemos todos los usuarios
        const usersData: User[] = await getUsers();
        setUsuarios(usersData);
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

    fetchUsers();
  }, []);

  const filteredUsuarios = usuarios.filter(
    (usuario: User) =>
      usuario.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      usuario.city.toLowerCase().includes(searchValue.toLowerCase())
  );

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
      { id, name, email, city, role }: User,
      index: number
    ) => (
      <IndexTable.Row
        id={id ?? "unknown-id"}
        key={id ?? index}
        position={index}
        selected={selectedResource === id}
        onClick={() => {
          setSelectedResource(
            selectedResource === id ? "" : id ?? "unknown-id"
          );
        }}
      >
        <IndexTable.Cell>{name ?? "Nombre desconocido"}</IndexTable.Cell>
        <IndexTable.Cell>{email ?? "Correo desconocido"}</IndexTable.Cell>
        <IndexTable.Cell>{city ?? "Ciudad desconocida"}</IndexTable.Cell>
        <IndexTable.Cell>
          <Badge>{role ?? "Sin rol"}</Badge>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
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
        <Button onClick={() => setIsOpen(true)} variant="primary">
          Registro
        </Button>
      </div>
      <Card>
        <div className="flex flex-col gap-4">
          <TextField
            label=""
            value={searchValue}
            onChange={(value) => {
              setSearchValue(value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por nombre, correo o ciudad"
            clearButton
            onClearButtonClick={() => setSearchValue("")}
            autoComplete="off"
          />

          <IndexTable
            resourceName={{ singular: "usuasrio", plural: "usuarios" }}
            itemCount={filteredUsuarios.length}
            selectedItemsCount={selectedResource ? 1 : 0}
            onSelectionChange={() => {}}
            headings={[
              { title: "Nombre" },
              { title: "Correo Electrónico" },
              { title: "Ciudad" },
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
              onChange={(value) => {
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
