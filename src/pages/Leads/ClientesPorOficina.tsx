import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ModalRegistroLeads from "../../components/Modales/ModalRegistroLeads";
import {
  IndexTable,
  Filters,
  Pagination,
  Button,
  Card,
  Select,
  Modal,
  Frame,
  Badge,
} from "@shopify/polaris";
import { Toast } from "../../components/Toast/toast";
import { getAllLeads, deleteLead } from "../../services/leads";
import { All as Lead } from "../../services/buyer";
import ModalAsignacionVendedor from "../../components/Modales/ModalAsignacionVenderor";
import { useAuthToken } from "../../hooks/useAuthToken";
import { getAllClientesByOfficeId } from "../../services/leads";
import formatFecha from "../../utils/formatDate";

export default function ClientesPorOficina() {
  const navigate = useNavigate();
  const storedOffice = localStorage.getItem("oficinaActual");
  const location = useLocation();
  const { userInfo, permisos } = useAuthToken();
  const crearLeads = permisos?.includes("Crear Leads") ?? false;
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
  const [selected, setSelected] = useState("");
  const [isOpenAsignacion, setIsOpenAsignacion] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [folioLead, setFolioLead] = useState<string | null>(null);
  const [isMultipleSelecion, setIsMultipleSelection] = useState(false);

  //   const handleTableSelection = (table: SetStateAction<string>) => {
  //     setSelected(table);
  //     navigate(`?selected=${table}`);
  //   };

  const fetchLeads = async () => {
    setSelected("lead");
    setIsLoading(true);
    setSelectedData([]);
    try {
      const leads = await getAllClientesByOfficeId(storedOffice ?? "");
      setSelectedData(leads?.data);
    } catch (error) {
      setSelectedData([]);
      console.error("Error al obtener leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    setSelected("client");
    setIsLoading(true);
    setSelectedData([]);
    try {
      const clients = await getAllClientesByOfficeId(storedOffice ?? "");
      setSelectedData(clients?.data);
    } catch (error) {
      setSelectedData([]);
      console.error("Error al obtener clientes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPreClient = async () => {
    setSelected("prospecto");
    setIsLoading(true);
    setSelectedData([]);
    try {
      const preClients = await getAllClientesByOfficeId(storedOffice ?? "");
      setSelectedData(preClients);
    } catch (error) {
      setSelectedData([]);
      console.error("Error al obtener prospectos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComprador = async () => {
    setSelected("comprador");
    setIsLoading(true);
    setSelectedData([]);
    try {
      const compradores = await getAllClientesByOfficeId(storedOffice ?? "");
      setSelectedData(compradores);
    } catch (error) {
      setSelectedData([]);
      console.error("Error al obtener compradores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedTable = params.get("selected");

    if (selectedTable) {
      setSelected(selectedTable);
      switch (selectedTable) {
        case "lead":
          fetchLeads();
          break;
        case "client":
          fetchClients();
          break;
        case "prospecto":
          fetchPreClient();
          break;
        case "comprador":
          fetchComprador();
          break;
        default:
          break;
      }
    } else {
      setSelected("lead");
      fetchLeads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, selected]);

  const leadsForIndexTable = Array.isArray(selectedData)
    ? selectedData.map(
      ({
        _id,
        names,
        email,
        phone_number,
        city,
        type_lead,
        status,
        assigned_to,
        type_client,
        folio,
        created_at,
        nombre_campania_externa
      }: Lead) => ({
        id: _id,
        names,
        email,
        phone_number,
        city,
        type_lead,
        status,
        assigned_to,
        type_client,
        folio,
        created_at,
        nombre_campania_externa
      })
    )
    : [];

  // Filtro de búsqueda
  const filteredLeads = leadsForIndexTable.filter(
    (lead) =>
      lead.names?.toLowerCase().includes(searchValue.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      lead?.folio?.toLowerCase().includes(searchValue.toLowerCase())
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

  //Funcion para la seleccion de un solo item
  const handleSelectionChangeMultiple = (selection: string | undefined) => {
    if (selection !== undefined) {
      setSelectedResources((prevSelected) =>
        prevSelected.includes(selection)
          ? prevSelected.filter((id) => id !== selection) // Si ya está seleccionado, lo quitamos
          : [...prevSelected, selection] // Si no está seleccionado, lo agregamos
      );
    }
  };

  const handleSelectionChangeSingle = (selection: string | undefined) => {
    if (selection !== undefined) {
      if (selectedResources.includes(selection)) {
        setSelectedResources(
          selectedResources.filter((id) => id !== selection)
        );
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
      await deleteLead(selectedLead, userInfo?.id || "");
      Toast.fire({ icon: "success", title: "Lead eliminado correctamente" });
      setTimeout(() => {
        window.location.reload();
      }, 1000)
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

  const promotedBulkActions = [
    {
      content: isMultipleSelecion ? "Eliminar Seleccion" : "Seleccionar Varios",
      onAction: () => {
        if (isMultipleSelecion) {
          setIsMultipleSelection(false)
          setSelectedResources([])
        } else {
          setIsMultipleSelection(true)
        }
      },
    },
    {
      content: "Asignacion Masiva",
      onAction: () => {
        if (isMultipleSelecion) {
          setIsMultipleSelection(false)
          setSelectedResources([])
        } else {
          setIsMultipleSelection(true)
        }
      },
      disabled: !isMultipleSelecion
    },
    {
      content:
        selected === "lead"
          ? "Ver Lead"
          : selected === "client"
            ? "Ver Cliente"
            : selected === "prospecto"
              ? "Ver Prospecto"
              : selected === "comprador"
                ? "Ver Comprador"
                : "",
      onAction: () => {
        if (selectedResources.length === 1) {
          const path =
            selected === "lead"
              ? "leads"
              : selected === "client"
                ? "cliente"
                : selected === "prospecto"
                  ? "prospecto"
                  : selected === "comprador"
                    ? "comprador"
                    : "";

          if (path) {
            navigate(`/${path}/${selectedResources[0]}`);
          }
        } else {
          Toast.fire({ icon: "error", title: "Solo debe haber un cliente seleccionado", timer: 6000 });
        }
      },
      disabled: isMultipleSelecion,
    },
    {
      content: "Eliminar",
      onAction: () => {
        if (isMultipleSelecion && selectedResources.length > 1) {
          Toast.fire({ icon: "error", title: "Solo debe haber un cliente seleccionado", timer: 6000 })
        } else {

          if (selectedResources.length === 1) {
            setSelectedLead(selectedResources[0]);
            setIsDeleteModalOpen(true);
          } else {
            console.warn("Por favor selecciona solo un lead para eliminar");
          }
        }
      },
      disabled: isMultipleSelecion,
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

  const rowMarkup = paginatedLeads.map(
    (
      {
        id,
        names,
        email,
        phone_number,
        city,
        type_lead,
        status,
        assigned_to,
        type_client,
        folio,
        created_at,
        nombre_campania_externa
      },
      index
    ) => (
      <IndexTable.Row
        id={id ?? ""}
        key={id ?? index}
        position={index}
        selected={selectedResources.includes(id ?? "")}
        onClick={() => isMultipleSelecion ? handleSelectionChangeMultiple(id) : handleSelectionChangeSingle(id)}
      >
        <IndexTable.Cell>{names ?? "Desconocido"}</IndexTable.Cell>
        <IndexTable.Cell>{email ?? "No disponible"}</IndexTable.Cell>
        <IndexTable.Cell>{folio ?? "No disponible"}</IndexTable.Cell>
        {nombre_campania_externa ?
          <IndexTable.Cell>{nombre_campania_externa}</IndexTable.Cell>
          : <div className="flex items-center mt-3"><Badge tone="success">CRM</Badge></div>}
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
        <IndexTable.Cell>
          {type_client === "CLIENTE"
            ? "Cliente"
            : type_client === "PROSPECTO_CLIENTE"
              ? "Prospecto"
              : type_client === "COMPRADOR"
                ? "Comprador"
                : type_client === "LEAD"
                  ? "Lead"
                  : "No especificado"}
        </IndexTable.Cell>

        {userInfo && userInfo.role !== "vendedor" && (
          <IndexTable.Cell>
            {assigned_to ? (
              <Button
                disabled={isMultipleSelecion}
                onClick={() => {
                  setIsOpenAsignacion(true);
                  setAssignedTo(assigned_to);
                }}
              >
                Ver
              </Button>
            ) : (
              <Button
                disabled={isMultipleSelecion}
                variant="primary"
                onClick={() => {
                  setAssignedTo("");
                  setIsOpenAsignacion(true);
                  setFolioLead(folio ?? "");
                }}
              >
                Asignar
              </Button>
            )}
          </IndexTable.Cell>
        )}
        <IndexTable.Cell>{userInfo && userInfo.role !== "vendedor" && (
          <IndexTable.Cell>
            {assigned_to ? (
              <Badge tone="success">Asignado</Badge>
            ) : (
              <Badge tone="critical">No Asignado</Badge>
            )}
          </IndexTable.Cell>
        )}</IndexTable.Cell>
        <IndexTable.Cell>{formatFecha(created_at)}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Frame>
      <div className="w-full flex flex-col gap-4">
        <div className="flex w-full justify-between items-center">
          <span className="font-semibold text-[20px]">
            {selected === "lead"
              ? "Clientes por Oficina"
              : selected === "client"
                ? "Clientes por Oficina"
                : selected === "prospecto"
                  ? "Prospecto por Oficina"
                  : selected === "comprador"
                    ? "Comprador por Oficina"
                    : ""}
          </span>
          {selected === "lead" && crearLeads && (
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
        <Card padding={"0"}>
          <div className="flex flex-col gap-0">
            {/* <div className="flex gap-2">
              <Button
                onClick={() => handleTableSelection("lead")}
                variant={selected === "lead" ? "primary" : "secondary"}
              >
                Leads
              </Button>
              <Button
                onClick={() => handleTableSelection("prospecto")}
                variant={selected === "prospecto" ? "primary" : "secondary"}
              >
                Prospectos
              </Button>
              <Button
                onClick={() => handleTableSelection("comprador")}
                variant={selected === "comprador" ? "primary" : "secondary"}
              >
                Compradores
              </Button>
              <Button
                onClick={() => handleTableSelection("client")}
                variant={selected === "client" ? "primary" : "secondary"}
              >
                Clientes
              </Button>
            </div> */}
            <Filters
              queryValue={searchValue}
              onQueryChange={(value) => {
                setSearchValue(value);
                setCurrentPage(1);
              }}
              queryPlaceholder="Buscar por nombre, correo o folio"
              onClearAll={() => setSearchValue("")}
              onQueryClear={() => setSearchValue("")}
              filters={[]}
            />

            {isLoading ? (
              <p>Cargando leads...</p>
            ) : (
              <>
                <IndexTable
                  resourceName={{
                    singular:
                      selected === "lead"
                        ? "lead"
                        : selected === "prospecto"
                          ? "Prospecto"
                          : selected === "comprador"
                            ? "Comprador"
                            : selected === "cliente"
                              ? "Cliente"
                              : "",
                    plural:
                      selected === "lead"
                        ? "lead"
                        : selected === "prospecto"
                          ? "Prospecto"
                          : selected === "comprador"
                            ? "Comprador"
                            : selected === "cliente"
                              ? "Cliente"
                              : "",
                  }}
                  itemCount={filteredLeads.length}
                  selectedItemsCount={selectedResources.length}
                  onSelectionChange={isMultipleSelecion ? handleSelectionChangeMultiple : handleSelectionChangeSingle}
                  headings={[
                    { title: "Nombre" },
                    { title: "Correo Electrónico" },
                    { title: "Folio" },
                    { title: "Campaña" },
                    { title: "Teléfono" },
                    { title: "Ciudad" },
                    { title: "Estado" },
                    { title: "Status" },
                    { title: "Tipo" },
                    { title: "Asignado" },
                    { title: "Asignacion" },
                    { title: "Creacion" },
                  ]}
                  promotedBulkActions={promotedBulkActions}
                  emptyState="No se encontraron resultados"
                >
                  {rowMarkup}
                </IndexTable>
                <div className="flex flex-row-reverse items-center w-full justify-between px-3 py-2 bg-[#f3f3f3] border-t">
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
        )}{" "}
      </div>
      {isOpenAsignacion && (
        <ModalAsignacionVendedor
          leadIds={selectedResources}
          setIsOpen={setIsOpenAsignacion}
          isOpen={isOpenAsignacion}
          assignedTo={assignedTo}
          folioLead={folioLead}
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
