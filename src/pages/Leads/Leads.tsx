import { useState, useEffect } from "react";
import ModalRegistroLeads from "../../components/Modales/ModalRegistroLeads";
import {
  IndexTable,
  useIndexResourceState,
  TextField,
  Pagination,
  Button,
  Card,
  Select,
  Modal,
  Frame,
  Badge,
} from "@shopify/polaris";
import { Toast } from "../../components/Toast/toast";
import { useNavigate } from "react-router-dom";
import { getAllLeads, deleteLead } from "../../services/leads";
import { Lead } from "../../services/leads";

export default function Leads() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [leadDataToEdit, setLeadDataToEdit] = useState<Lead | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getAllLeads();
        if (!Array.isArray(response)) {
          console.error("Error: La respuesta no es un array.");
          return;
        }
        setLeads(response);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los leads:", error);
        setLoading(false);
      }
    };
    fetchLeads();
  }, [isOpen]);

  const leadsForIndexTable = leads.map((lead) => ({
    id: lead._id,
    names: lead.names,
    email: lead.email,
    phone_number: lead.phone_number,
    city: lead.city,
    type_lead: lead.type_lead,
    status: lead.status,
  }));

  // Filtro de búsqueda
  const filteredLeads = leadsForIndexTable.filter(
    (lead) =>
      lead.names?.toLowerCase().includes(searchValue.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const numItemsPerPage =
    itemsPerPage === "todos"
      ? filteredLeads.length
      : parseInt(itemsPerPage, 10);

  // Calcular el rango de elementos que se mostrarán en la página actual
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * numItemsPerPage,
    currentPage * numItemsPerPage
  );

  const totalPages = Math.ceil(filteredLeads.length / numItemsPerPage);

  // Uso del estado de recursos para el IndexTable
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(leadsForIndexTable);

  const handleDeleteAction = async () => {
    if (!selectedLead) return;

    try {
      await deleteLead(selectedLead);
      Toast.fire({ icon: "success", title: "Lead eliminado correctamente" });

      // Refetch de los leads después de eliminar
      const response = await getAllLeads();
      setLeads(response);
    } catch (error) {
      console.error("Error al eliminar el lead:", error);
      Toast.fire({
        icon: "error",
        title: error || "Error al eliminar al lead",
      });
    }
    setIsDeleteModalOpen(false);
    setSelectedLead(null);
  };

  const handleEditAction = () => {
    if (selectedResources.length === 1) {
      const leadToEdit = leads.find(
        (lead) => lead._id === selectedResources[0]
      ); // Buscar el lead a editar
      setLeadDataToEdit(leadToEdit || null); // Guardar la información del lead en el estado
      setIsOpen(true); // Abrir el modal
    } else {
      console.warn("Por favor selecciona solo un lead para editar");
    }
  };

  const promotedBulkActions = [
    {
      content: "Ver Lead",
      onAction: () => {
        if (selectedResources.length === 1) {
          navigate(`/leads/${selectedResources[0]}`);
        } else {
          console.warn("Por favor selecciona solo un lead");
        }
      },
    },
    {
      content: "Eliminar",
      onAction: () => {
        if (selectedResources.length === 1) {
          setSelectedLead(selectedResources[0]);
          setIsDeleteModalOpen(true);
        } else {
          console.warn("Por favor selecciona solo un lead para eliminar");
        }
      },
    },
    {
      content: "Editar",
      onAction: handleEditAction,
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

  const rowMarkup = paginatedLeads.map(
    ({ id, names, email, phone_number, city, type_lead, status }, index) => (
      <IndexTable.Row
        id={id ?? ""}
        key={id ?? index}
        position={index}
        selected={selectedResources.includes(id ?? "")}
      >
        <IndexTable.Cell>{names ?? "Desconocido"}</IndexTable.Cell>
        <IndexTable.Cell>{email ?? "No disponible"}</IndexTable.Cell>
        <IndexTable.Cell>{phone_number ?? "No disponible"}</IndexTable.Cell>
        <IndexTable.Cell>{city ?? "No disponible"}</IndexTable.Cell>
        <IndexTable.Cell>
          {type_lead ? type_lead : "No definido"}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={status ? "success" : "critical"}>
            {status ? "Activo" : "Inactivo"}
          </Badge>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Frame>
      <div className="w-full flex flex-col gap-4">
        <div className="flex w-full justify-between items-center">
          <span className="font-semibold text-[20px]">Leads</span>
          <Button onClick={() => setIsOpen(true)} variant="primary">
            Crear
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
              placeholder="Buscar por nombre o correo"
              clearButton
              onClearButtonClick={() => setSearchValue("")}
              autoComplete="off"
            />

            {loading ? (
              <p>Cargando leads...</p>
            ) : (
              <>
                <IndexTable
                  resourceName={{ singular: "lead", plural: "leads" }}
                  itemCount={filteredLeads.length}
                  selectedItemsCount={
                    allResourcesSelected ? "All" : selectedResources.length
                  }
                  onSelectionChange={handleSelectionChange}
                  headings={[
                    { title: "Nombre" },
                    { title: "Correo Electrónico" },
                    { title: "Teléfono" },
                    { title: "Ciudad" },
                    { title: "Estado" },
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
              </>
            )}
          </div>
        </Card>
        {isOpen && (
          <ModalRegistroLeads
            // leadInfo={leadDataToEdit}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}{" "}
      </div>
      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && (
        <Modal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirmar eliminación"
          primaryAction={{
            content: "Eliminar",
            onAction: handleDeleteAction,
          }}
          secondaryActions={[
            {
              content: "Cancelar",
              onAction: () => setIsDeleteModalOpen(false),
            },
          ]}
        >
          <Modal.Section>
            <p>¿Estás seguro de que deseas eliminar este lead?</p>
          </Modal.Section>
        </Modal>
      )}
    </Frame>
  );
}
