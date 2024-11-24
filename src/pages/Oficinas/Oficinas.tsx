import { useState, useEffect } from "react";
import {
  IndexTable,
  useIndexResourceState,
  TextField,
  Pagination,
  Button,
  Card,
  Select,
  Modal,
} from "@shopify/polaris";
import { getAllOffices, deleteOffice } from "../../services/oficinas";
import { Toast } from "../../components/Toast/toast";
import ModalRegistroOficinas from "../../components/Modales/ModalOficinas";
import { useAuthToken } from "../../hooks/useAuthToken";
import { OfficeData } from "../../services/oficinas";

export default function Oficinas() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [oficinas, setOficinas] = useState<OfficeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrar, setRegistrar] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [officeToDelete, setOfficeToDelete] = useState<string | null>(null);
  const { userInfo } = useAuthToken();

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await getAllOffices();
        setOficinas(response.data ?? []);
      } catch (error) {
        setError("Error al cargar las oficinas");
        const errorMessage = typeof error === "string" ? error : String(error);
        Toast.fire({
          icon: "error",
          title: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, []);

  const filteredOficinas = oficinas.filter((oficina) => {
    const nombreOficina = oficina.nombre?.toLowerCase() || "";
    const ciudadOficina = oficina.ciudad?.toLowerCase() || "";
    const estadoOficina = oficina.estado?.toLowerCase() || "";

    return (
      nombreOficina.includes(searchValue.toLowerCase()) ||
      ciudadOficina.includes(searchValue.toLowerCase()) ||
      estadoOficina.includes(searchValue.toLowerCase())
    );
  });

  const numItemsPerPage =
    itemsPerPage === "todos"
      ? filteredOficinas.length
      : parseInt(itemsPerPage, 10);

  const paginatedOficinas = filteredOficinas.slice(
    (currentPage - 1) * numItemsPerPage,
    currentPage * numItemsPerPage
  );

  const totalPages = Math.ceil(filteredOficinas.length / numItemsPerPage);

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

  const resourceOficinas = oficinas.map((oficina) => ({
    ...oficina,
    id: oficina._id ?? "unknown-id",
  }));

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(resourceOficinas);

  const handleDeleteOffice = async () => {
    if (!officeToDelete || !userInfo?.id) return;
    try {
      const response = await deleteOffice(officeToDelete, userInfo.id);
      if (response.result) {
        Toast.fire({ icon: "success", title: "Oficina eliminada correctamente" });
        setOficinas((prev) => prev.filter((oficina) => oficina._id !== officeToDelete));
      } else {
        Toast.fire({ icon: "error", title: response.error });
      }
    } catch (error) {
      Toast.fire({ icon: "error", title: error || "Error al eliminar la oficina" });
    } finally {
      setIsModalConfirmOpen(false);
      setOfficeToDelete(null);
    }
  };

  const promotedBulkActions = [
    {
      content: "Eliminar",
      onAction: () => {
        if (selectedResources.length === 1) {
          setOfficeToDelete(selectedResources[0]);
          setIsModalConfirmOpen(true);
        } else {
          Toast.fire({ icon: "error", title: "Seleccione una sola oficina para eliminar" });
        }
      },
    },
  ];

  const rowMarkup = paginatedOficinas.map(
    ({ _id, nombre, ciudad, estado, status }, index) => (
      <IndexTable.Row
        id={_id}
        key={_id}
        position={index}
        selected={selectedResources.includes(_id)}
      >
        <IndexTable.Cell>{nombre}</IndexTable.Cell>
        <IndexTable.Cell>{ciudad}</IndexTable.Cell>
        <IndexTable.Cell>{estado}</IndexTable.Cell>
        <IndexTable.Cell>{status ? "Activo" : "Inactivo"}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  if (loading) {
    return <p>Cargando Oficinas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex w-full justify-between items-center">
        <span className="font-semibold text-[20px]">Oficinas</span>
        <Button
          onClick={() => {
            setIsOpen(true);
            setRegistrar(true);
          }}
          variant="primary"
        >
          Registrar Oficina
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
            placeholder="Buscar por nombre, ciudad o estado"
            clearButton
            onClearButtonClick={() => setSearchValue("")}
            autoComplete="off"
          />

          <IndexTable
            resourceName={{ singular: "oficina", plural: "oficinas" }}
            itemCount={filteredOficinas.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Oficina" },
              { title: "Ciudad" },
              { title: "Estado" },
              { title: "Estatus" },
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
          <div className="flex justify-center mt-2">
            <span>
              Página {currentPage} de {totalPages}
            </span>
          </div>
        </div>
      </Card>
      {isOpen && (
        <ModalRegistroOficinas
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          idOficina={selectedResources[0] ?? null}
          registrar={registrar}
        />
      )}
      {isModalConfirmOpen && (
        <Modal
          open={isModalConfirmOpen}
          onClose={() => {
            setIsModalConfirmOpen(false);
            setOfficeToDelete(null);
          }}
          title="Confirmar eliminación"
          primaryAction={{
            content: "Eliminar",
            destructive: true,
            onAction: handleDeleteOffice,
          }}
          secondaryActions={[
            {
              content: "Cancelar",
              onAction: () => {
                setIsModalConfirmOpen(false);
                setOfficeToDelete(null);
              },
            },
          ]}
        >
          <Modal.Section>
            <p>¿Estás seguro de que deseas eliminar esta oficina? Esta acción no se puede deshacer.</p>
          </Modal.Section>
        </Modal>
      )}
    </div>
  );
}
