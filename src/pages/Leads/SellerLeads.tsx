import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ModalRegistroLeads from "../../components/Modales/ModalRegistroLeads";
import {
  IndexTable,
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
import {
  getAllLeadsBySellerIdAndType,
  deleteLead,
} from "../../services/leads";
import { All as Lead } from "../../services/buyer";
import ModalAsignacionVendedor from "../../components/Modales/ModalAsignacionVenderor";
import { useAuthToken } from "../../hooks/useAuthToken";

export default function SellerLeads() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuthToken();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [, setLeads] = useState<Lead[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [leadDataToEdit, setLeadDataToEdit] = useState<Lead | null>(null);
  const [selectedData, setSelectedData] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const [isOpenAsignacion, setIsOpenAsignacion] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const fetchData = async (clientType: string) => {
    if (userInfo && userInfo.id) {
      setIsLoading(true);
      setSelectedData([]);
      setSelected(clientType);
      try {
        const response = await getAllLeadsBySellerIdAndType(
          userInfo.id,
          clientType
        );
        if (Array.isArray(response)) {
          setLeads(response);
          setSelectedData(response);
        } else {
          setSelectedData([]);
        }
      } catch (error) {
        console.error(`Error al obtener ${clientType}:`, error);
        setSelectedData([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedTable = params.get("selected");

    if (selectedTable) {
      setSelected(selectedTable);
      fetchData(selectedTable);
    } else {
      setSelected("");
      fetchData("");
    }
  }, [location.search]);

  const handleTableSelection = (table: string) => {
    setSelected(table);
    navigate(`?selected=${table}`);
    fetchData(table);
  };



  const leadsForIndexTable = selectedData.map((lead) => ({
    id: lead._id,
    names: lead.names,
    email: lead.email,
    phone_number: lead.phone_number,
    city: lead.city,
    type_lead: lead.type_lead,
    status: lead.status,
    assigned_to: lead.assigned_to,
  }));

  const filteredLeads = leadsForIndexTable.filter(
    (lead) =>
      lead.names?.toLowerCase().includes(searchValue.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const numItemsPerPage =
    itemsPerPage === "todos"
      ? filteredLeads.length
      : parseInt(itemsPerPage, 10);

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * numItemsPerPage,
    currentPage * numItemsPerPage
  );

  const totalPages = Math.ceil(filteredLeads.length / numItemsPerPage);

  const handleSelectionChangeSingle = (selection: string | undefined) => {
    if (selection !== undefined) {
      if (selectedResources.includes(selection)) {
        setSelectedResources(selectedResources.filter((id) => id !== selection));
      } else {
        setSelectedResources([selection]);
      }
    } else {
      setSelectedResources([]);
    }
  };

  const handleDeleteAction = async () => {
    if (!selectedLead) return;

    try {
      await deleteLead(selectedLead);
      Toast.fire({ icon: "success", title: "Lead eliminado correctamente" });

      await fetchData(selected);
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

  const promotedBulkActions = [
    {
      content:
        selected === "LEAD"
          ? "Ver Lead"
          : selected === "CLIENTE"
            ? "Ver Cliente"
            : selected === "PROSPECTO_CLIENTE"
              ? "Ver Prospecto"
              : selected === "COMPRADOR"
                ? "Ver Comprador"
                : "",
      onAction: () => {
        if (selectedResources.length === 1) {
          const path =
            selected === "LEAD"
              ? "leads"
              : selected === "CLIENTE"
                ? "cliente"
                : selected === "PROSPECTO_CLIENTE"
                  ? "prospecto"
                  : selected === "COMPRADOR"
                    ? "comprador"
                    : "";

          if (path) {
            navigate(`/${path}/${selectedResources[0]}`);
          }
        } else {
          console.warn("Por favor selecciona solo un elemento");
        }
      },
    },
    ...(userInfo && userInfo.role !== "vendedor"
      ? [
        {
          content: "Eliminar",
          onAction: () => {
            if (selectedResources.length === 1) {
              setSelectedLead(selectedResources[0]);
              setIsDeleteModalOpen(true);
            } else {
              console.warn(
                "Por favor selecciona solo un elemento para eliminar"
              );
            }
          },
        },
      ]
      : []),
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

  const rowMarkup = paginatedLeads.map(
    (
      { id, names, email, phone_number, city, type_lead, status, assigned_to },
      index
    ) => (
      <IndexTable.Row
        id={id ?? ""}
        key={id ?? index}
        position={index}
        selected={selectedResources.includes(id ?? "")}
        onClick={() => handleSelectionChangeSingle(id)}
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
        {userInfo && userInfo.role !== "vendedor" && (
          <IndexTable.Cell>
            {assigned_to ? (
              <Button
                onClick={() => {
                  setIsOpenAsignacion(true);
                  setAssignedTo(assigned_to);
                }}
              >
                Ver
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  setIsOpenAsignacion(true);
                }}
              >
                Asignar
              </Button>
            )}
          </IndexTable.Cell>
        )}
      </IndexTable.Row>
    )
  );

  return (
    <Frame>
      <div className="w-full flex flex-col gap-4">
        <div className="flex w-full justify-between items-center">
          <span className="font-semibold text-[20px]">
            {selected === "LEAD"
              ? "Leads"
              : selected === "CLIENTE"
                ? "Clientes"
                : selected === "PROSPECTO_CLIENTE"
                  ? "Prospectos"
                  : selected === "COMPRADOR"
                    ? "Compradores"
                    : ""}
          </span>
          {selected === "LEAD" && (
            <Button
              onClick={() => {
                setIsOpen(true);
                setLeadDataToEdit(null);
              }}
              variant="primary"
            >
              Crear
            </Button>
          )}
        </div>
        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Button
                onClick={() => handleTableSelection("LEAD")}
                variant={selected === "LEAD" ? "primary" : "secondary"}
              >
                Leads
              </Button>
              <Button
                onClick={() => handleTableSelection("PROSPECTO_CLIENTE")}
                variant={selected === "PROSPECTO_CLIENTE" ? "primary" : "secondary"}
              >
                Prospectos
              </Button>
              <Button
                onClick={() => handleTableSelection("COMPRADOR")}
                variant={selected === "COMPRADOR" ? "primary" : "secondary"}
              >
                Compradores
              </Button>
              <Button
                onClick={() => handleTableSelection("CLIENTE")}
                variant={selected === "CLIENTE" ? "primary" : "secondary"}
              >
                Clientes
              </Button>
            </div>


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

            {isLoading ? (
              <p>Cargando datos...</p>
            ) : (
              <>
                <IndexTable
                  resourceName={{
                    singular:
                      selected === "LEAD"
                        ? "Lead"
                        : selected === "PROSPECTO_CLIENTE"
                          ? "Prospecto"
                          : selected === "COMPRADOR"
                            ? "Comprador"
                            : selected === "CLIENTE"
                              ? "Cliente"
                              : "",
                    plural:
                      selected === "LEAD"
                        ? "Leads"
                        : selected === "PROSPECTO_CLIENTE"
                          ? "Prospectos"
                          : selected === "COMPRADOR"
                            ? "Compradores"
                            : selected === "CLIENTE"
                              ? "Clientes"
                              : "",
                  }}
                  itemCount={filteredLeads.length}
                  selectedItemsCount={selectedResources.length}
                  onSelectionChange={handleSelectionChangeSingle}
                  headings={[
                    { title: "Nombre" },
                    { title: "Correo Electrónico" },
                    { title: "Teléfono" },
                    { title: "Ciudad" },
                    { title: "Estado" },
                    { title: "Status" },
                    ...(userInfo && userInfo.role !== "vendedor"
                      ? [{ title: "Asignación" }]
                      : []),
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
            leadInfo={leadDataToEdit}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
      {isOpenAsignacion && (
        <ModalAsignacionVendedor
          leadIds={selectedResources}
          setIsOpen={setIsOpenAsignacion}
          isOpen={isOpenAsignacion}
          assignedTo={assignedTo}
        />
      )}
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