import { useState, useEffect } from "react";
import {
  IndexTable,
  useIndexResourceState,
  TextField,
  Pagination,
  Button,
  Card,
  Select,
} from "@shopify/polaris";
import { getUsers, User } from "../../services/users";
import { Toast } from "../../components/Toast/toast";
import ModalRegistroOficinas from "../../components/Modales/ModalOficinas";

export default function Coordinadores() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [vendedores, setVendedores] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Filtro de búsqueda
  const filteredVendedores = vendedores.filter(
    (vendedor: User) =>
      vendedor.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendedor.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendedor.city.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Convertimos el valor de itemsPerPage en un número o tomamos el total de oficinas si es "todos"
  const numItemsPerPage =
    itemsPerPage === "todos"
      ? filteredVendedores.length
      : parseInt(itemsPerPage, 10);

  // Calcular el rango de elementos que se mostrarán en la página actual
  const paginatedVendedores = filteredVendedores.slice(
    (currentPage - 1) * numItemsPerPage,
    currentPage * numItemsPerPage
  );

  const totalPages = Math.ceil(filteredVendedores.length / numItemsPerPage);

  // Convierte los usuarios a un formato aceptado por useIndexResourceState
  const resourceVendedores = vendedores.map((vendedor) => ({
    ...vendedor,
    id: vendedor.id ?? "unknown-id",
  }));

  // Uso del estado de recursos para el IndexTable
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(resourceVendedores);

  const promotedBulkActions = [
    {
      content: "Ver Oficina",
      onAction: () => console.log("Ver Oficina"),
    },
    {
      content: "Eliminar",
      onAction: () => console.log("Eliminar Vendedor"),
    },
  ];

  // Función para manejar el cambio de página
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

  const rowMarkup = paginatedVendedores.map(
    ({ id, name, email, city }: User, index: number) => (
      <IndexTable.Row
        id={id ?? "unknown-id"} // Si id es undefined, usa "unknown-id"
        key={id ?? index} // Usa index como respaldo si id es undefined
        position={index}
        selected={selectedResources.includes(id ?? "")} // Si id es undefined, usa una cadena vacía
      >
        <IndexTable.Cell>{name ?? "Nombre desconocido"}</IndexTable.Cell>{" "}
        {/* Proporciona un valor predeterminado si name es undefined */}
        <IndexTable.Cell>{email ?? "Correo desconocido"}</IndexTable.Cell>{" "}
        {/* Proporciona un valor predeterminado si email es undefined */}
        <IndexTable.Cell>{city ?? "Ciudad desconocida"}</IndexTable.Cell>{" "}
        {/* Proporciona un valor predeterminado si city es undefined */}
      </IndexTable.Row>
    )
  );

  if (loading) {
    return <p>Cargando Coordinadores...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex w-full justify-between items-center">
        <span className="font-semibold text-[20px]">
          Coordinadores - esperando endpoint
        </span>
        <Button onClick={() => setIsOpen(true)} variant="primary">
          Registrar Coordinador
        </Button>
      </div>
      <Card>
        <div className="flex flex-col gap-4">
          {/* Campo de búsqueda */}
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
            resourceName={{ singular: "oficina", plural: "oficinas" }}
            itemCount={filteredVendedores.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Ciudas" },
              { title: "Estado" },
              { title: "Oficina" },
              { title: "Jefe" },
              { title: "Número  de empleados" },
            ]}
            promotedBulkActions={promotedBulkActions}
            emptyState="No se encontraron resultados"
          >
            {rowMarkup}
          </IndexTable>
          <div className="flex flex-row-reverse items-center w-full justify-between">
            {/* Paginación */}
            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={() => handlePagination("previous")}
              hasNext={currentPage < totalPages}
              onNext={() => handlePagination("next")}
            />

            {/* Select para número de vendedores por página */}
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
      {/* Modal para registrar oficinas */}
      {isOpen && (
        <ModalRegistroOficinas isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
}
