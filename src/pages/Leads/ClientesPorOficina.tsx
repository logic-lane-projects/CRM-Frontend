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
import { getAllLeads, deleteLead } from "../../services/leads";
import { All as Lead } from "../../services/buyer";
import ModalAsignacionVendedor from "../../components/Modales/ModalAsignacionVenderor";
import { useAuthToken } from "../../hooks/useAuthToken";
import { getAllClientesByOfficeId } from "../../services/leads";

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
        })
      )
    : [];

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

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * numItemsPerPage,
    currentPage * numItemsPerPage
  );

  const totalPages = Math.ceil(filteredLeads.length / numItemsPerPage);

  //Funcion para la seleccion de un solo item
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
      },
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
        <Card>
          <div className="flex flex-col gap-4">
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
                  onSelectionChange={handleSelectionChangeSingle}
                  headings={[
                    { title: "Nombre" },
                    { title: "Correo Electrónico" },
                    { title: "Teléfono" },
                    { title: "Ciudad" },
                    { title: "Estado" },
                    { title: "Status" },
                    { title: "Asignacion" },
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
        )}{" "}
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
