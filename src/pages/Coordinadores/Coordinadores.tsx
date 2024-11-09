import { useState, useEffect } from "react";
import {
  IndexTable,
  TextField,
  Pagination,
  Button,
  Card,
  Select,
  Badge
} from "@shopify/polaris";
import { getAllCoordinators } from "../../services/coordinadores";
import { Toast } from "../../components/Toast/toast";
import ModalRegistroCoordinadores from "../../components/Modales/ModalRegistroCoordinadores";
import { useNavigate } from "react-router-dom";

interface RawCoordinatorData {
  _id: string;
  cellphone: string;
  city: string;
  created_at: string;
  email: string;
  maternal_surname: string;
  name: string;
  oficina: string | null;
  paternal_surname: string;
  role: string;
  state: string;
  status: boolean;
  updated_at: string;
}

export default function Coordinadores() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [coordinators, setCoordinators] = useState<RawCoordinatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoordinator, setSelectedCoordinator] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const coordinatorsData = await getAllCoordinators();

        if (Array.isArray(coordinatorsData.data)) {
          const formattedData: RawCoordinatorData[] = coordinatorsData.data.map(
            (item: RawCoordinatorData) => ({
              _id: item._id,
              name: item.name,
              paternal_surname: item.paternal_surname,
              maternal_surname: item.maternal_surname,
              email: item.email,
              cellphone: item.cellphone,
              city: item.city,
              state: item.state,
              office: item.oficina,
              role: item.role,
              status: item.status,
              created_at: item.created_at,
              updated_at: item.updated_at,
            })
          );

          setCoordinators(formattedData);
        } else {
          setError("Error: los datos recibidos no son válidos.");
        }
      } catch (error) {
        setError("Error al cargar los coordinadores");
        const errorMessage = typeof error === "string" ? error : String(error);
        Toast.fire({
          icon: "error",
          title: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinators();
  }, []);

  const filteredCoordinators = coordinators?.filter(
    (coordinator: RawCoordinatorData) =>
      coordinator.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      coordinator.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      coordinator.city.toLowerCase().includes(searchValue.toLowerCase())
  );

  const numItemsPerPage =
    itemsPerPage === "todos"
      ? filteredCoordinators.length
      : parseInt(itemsPerPage, 10);

  const paginatedCoordinators = filteredCoordinators?.slice(
    (currentPage - 1) * numItemsPerPage,
    currentPage * numItemsPerPage
  );

  const totalPages = Math.ceil(filteredCoordinators.length / numItemsPerPage);

  const handleSelectionChangeSingle = (selection: string | undefined) => {    
    const selectedId = selection ?? null;
    if (selection === selectedCoordinator) {
      setSelectedCoordinator(null);
    } else {
      setSelectedCoordinator(selectedId);
    }
  };

  const promotedBulkActions = [
    {
      content: "Ver Coordinador",
      onAction: () => navigate(`/coordinador/${selectedCoordinator}`),
    },
    {
      content: "Eliminar",
      onAction: () => alert("Eliminar Coordinador"),
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
  console.log(paginatedCoordinators);
  const rowMarkup = paginatedCoordinators.map(
    ({ _id, name, email, city, status }: RawCoordinatorData, index: number) => (
      <IndexTable.Row
        id={_id ?? "unknown-id"}
        key={_id ?? index}
        position={index}
        selected={selectedCoordinator === _id}
        onClick={() => handleSelectionChangeSingle(_id)}
      >
        <IndexTable.Cell>{name ?? "Nombre desconocido"}</IndexTable.Cell>
        <IndexTable.Cell>{email ?? "Correo desconocido"}</IndexTable.Cell>
        <IndexTable.Cell>{city ?? "Ciudad desconocida"}</IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={status ? "success" : "critical"}>
            {status ? "Activo" : "Inactivo"}
          </Badge>
        </IndexTable.Cell>
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
        <span className="font-semibold text-[20px]">Coordinadores</span>
        <Button onClick={() => setIsOpen(true)} variant="primary">
          Registrar Coordinador
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
            resourceName={{ singular: "coordinador", plural: "coordinadores" }}
            itemCount={filteredCoordinators.length}
            selectedItemsCount={
              selectedCoordinator?.length
            }
            onSelectionChange={handleSelectionChangeSingle}
            headings={[
              { title: "Nombre" },
              { title: "Correo" },
              { title: "Ciudad" },
              { title: "Status" },
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
        <ModalRegistroCoordinadores isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
}
