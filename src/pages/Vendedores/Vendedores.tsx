import { useState, useEffect } from "react";
import ModalRegistroVendedores from "../../components/Modales/ModalRegistroVendedores";
import {
  IndexTable,
  TextField,
  Pagination,
  Button,
  Card,
  Select,
} from "@shopify/polaris";
import { getUsers, User } from "../../services/users";
import { Toast } from "../../components/Toast/toast";
import { useNavigate } from "react-router-dom";
import ModalAsignacionCoordinador from "../../components/Modales/ModalAsignacionCoordinador";

export default function Vendedores() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [vendedores, setVendedores] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [isOpenCoordinador, setIsOpenCoordinador] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData: User[] = await getUsers();
        setVendedores(usersData);
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

  const handleOpenCoordinatorModal = (coordinator: string | null) => {
    setSelectedCoordinator(coordinator);
    setIsOpenCoordinador(true);
  };

  const filteredVendedores = vendedores.filter(
    (vendedor: User) =>
      vendedor.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendedor.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendedor.city.toLowerCase().includes(searchValue.toLowerCase())
  );

  const numItemsPerPage =
    itemsPerPage === "todos"
      ? filteredVendedores.length
      : parseInt(itemsPerPage, 10);

  const paginatedVendedores = filteredVendedores.slice(
    (currentPage - 1) * numItemsPerPage,
    currentPage * numItemsPerPage
  );

  const totalPages = Math.ceil(filteredVendedores.length / numItemsPerPage);

  const promotedBulkActions = [
    {
      content: "Ver Vendedor",
      onAction: () => {
        navigate(`/vendedor/${selectedResource}`);
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

  console.log("vendedores paginados", paginatedVendedores);
  const rowMarkup = paginatedVendedores.map(
    ({ id, name, email, city, coordinador_asignado }: User, index: number) => (
      <IndexTable.Row
        id={id ?? "unknown-id"}
        key={id ?? index}
        position={index}
        selected={selectedResource === id}
        onClick={() => {
          setSelectedResource(selectedResource === id ? null : id ?? null);
        }}
      >
        <IndexTable.Cell>{name ?? "Nombre desconocido"}</IndexTable.Cell>
        <IndexTable.Cell>{email ?? "Correo desconocido"}</IndexTable.Cell>
        <IndexTable.Cell>{city ?? "Ciudad desconocida"}</IndexTable.Cell>
        <IndexTable.Cell>
          {coordinador_asignado ? (
            <Button
              onClick={() => handleOpenCoordinatorModal(coordinador_asignado)}
            >
              Ver
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => handleOpenCoordinatorModal(null)}
            >
              Asignar
            </Button>
          )}
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  if (loading) {
    return <p>Cargando vendedores...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex w-full justify-between items-center">
        <span className="font-semibold text-[20px]">Vendedores</span>
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
            resourceName={{ singular: "vendedor", plural: "vendedores" }}
            itemCount={filteredVendedores.length}
            selectedItemsCount={selectedResource ? 1 : 0}
            onSelectionChange={() => {}}
            headings={[
              { title: "Nombre" },
              { title: "Correo Electrónico" },
              { title: "Ciudad" },
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
        <ModalRegistroVendedores isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      {isOpenCoordinador && (
        <ModalAsignacionCoordinador
          isOpen={isOpenCoordinador}
          setIsOpen={setIsOpenCoordinador}
          assignedTo={selectedCoordinator}
        />
      )}
    </div>
  );
}
