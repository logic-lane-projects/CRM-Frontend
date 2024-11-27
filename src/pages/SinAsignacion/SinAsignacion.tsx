import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IndexTable,
  useIndexResourceState,
  TextField,
  Pagination,
  Button,
  Card,
  Select,
} from "@shopify/polaris";
import { Toast } from "../../components/Toast/toast";
import { useAuthToken } from "../../hooks/useAuthToken";
// import { getLeadsByOfficeId } from "../../services/leads";
import { getAllClientsNoOffice } from "../../services/leads";
import ModalAsignarOficinas from "../../components/Modales/ModalAsignarOficinas";

// src/types/types.ts
export interface LeadResponse {
  _id: string;
  files_legal_extra: string[];
  files_legal_fisica: string[];
  files_legal_moral: string[];
  names: string;
  paternal_surname: string;
  maternal_surname: string;
  email: string;
  phone_number: string;
  city: string;
  state: string;
  type_lead: string;
  gender: "MALE" | "FEMALE";
  age: number;
  birthday_date: string;
  is_client: boolean;
  status: boolean;
  type_client: string;
  externo: boolean;
  updated_at: string;
  created_at: string;
  oficina: string;
  assigned_to: string;
  type_person?: string;
  profesion?: string;
  especialidad?: string;
}

export default function SinAsignacion() {
  const { userInfo, permisos } = useAuthToken();
  const nagivate = useNavigate();
  // const oficinaActual = localStorage.getItem("oficinaActual");
  const isSinAsignacion = permisos?.includes("Sin Asignación");
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [leads, setLeads] = useState<LeadResponse[]>([]);
  console.log(leads);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo && userInfo?.city) {
      fetchLeads();
    }
  }, [userInfo]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await getAllClientsNoOffice();
      console.log(response)
      const leadsData = response || [];
      setLeads(leadsData);
    } catch (error) {
      setError("Error al cargar los leads");
      const errorMessage = typeof error === "string" ? error : String(error);
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = Array.isArray(leads)
    ? leads.filter(
        (lead: LeadResponse) =>
          lead.names.toLowerCase().includes(searchValue.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];

  const numItemsPerPage =
    itemsPerPage === "todos"
      ? filteredLeads.length
      : parseInt(itemsPerPage, 10);

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * numItemsPerPage,
    currentPage * numItemsPerPage
  );

  const totalPages = Math.ceil(filteredLeads.length / numItemsPerPage);

  const resourceLeads = filteredLeads.map((lead) => ({
    ...lead,
    id: lead._id ?? "unknown-id",
  }));

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(resourceLeads);

  const promotedBulkActions = [
    {
      content: "Ver Lead",
      onAction: () => nagivate(`/leads/${selectedResources[0]}`),
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
      { _id, names, email, phone_number, city }: LeadResponse,
      index: number
    ) => (
      <IndexTable.Row
        id={_id ?? "unknown-id"}
        key={_id ?? index}
        position={index}
        selected={selectedResources.includes(_id ?? "")}
      >
        <IndexTable.Cell>{names ?? "Nombre desconocido"}</IndexTable.Cell>
        <IndexTable.Cell>{email ?? "Correo desconocido"}</IndexTable.Cell>
        <IndexTable.Cell>
          {phone_number ?? "Teléfono desconocido"}
        </IndexTable.Cell>
        <IndexTable.Cell>{city ?? "Ciudad desconocida"}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button onClick={() => setIsOpen(true)}>Asignar Oficina</Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  if (loading) {
    return <p>Cargando Leads...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {isSinAsignacion ? (
        <div className="w-full flex flex-col gap-4">
          <span className="font-semibold text-[20px]">
            Clientes sin oficinas
          </span>
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
                  { title: "Acciones" },
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
            <ModalAsignarOficinas
              leadIds={selectedResources}
              setIsOpen={setIsOpen}
              isOpen={isOpen}
            />
          )}
        </div>
      ) : (
        <div>
          <span>No tienes permiso para esta vista</span>
        </div>
      )}
    </>
  );
}
