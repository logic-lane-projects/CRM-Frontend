import { useState, useEffect } from "react";
import {
  IndexTable,
  Pagination,
  Card,
  Select,
  useIndexResourceState,
  Badge,
  Filters,
  Page,
} from "@shopify/polaris";
import { getUnregisterClients } from "../../services/clientes";
import type { UnregisterClient } from "../../services/clientes";
import { useAuthToken } from "../../hooks/useAuthToken";
import { Toast } from "../../components/Toast/toast";
import Whatsapp from "../Leads/Whatsapp";

export default function SinRegistrar() {
  const { permisos } = useAuthToken();
  const sinRegistrar = permisos?.includes("Sin Registrar") ?? false;
  console.log(sinRegistrar);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UnregisterClient[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<string>("10");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await getUnregisterClients();
      console.log(response)
      const dataResponse = response.message || [];
      setData(dataResponse);
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

  useEffect(() => {
    fetchLeads();
  },[]);

  const dataFilter = Array.isArray(data)
    ? data.filter(
        (item: UnregisterClient) =>
          item.number.toString().includes(searchValue.toLowerCase())
      )
    : [];

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

  const numItemsPerPage =
    itemsPerPage === "todos"
      ? dataFilter.length
      : parseInt(itemsPerPage, 10);

  const paginatedNumbers = dataFilter.slice(
    (currentPage - 1) * numItemsPerPage,
    currentPage * numItemsPerPage
  );

  const totalPages = Math.ceil(dataFilter.length / numItemsPerPage);

  const resource = dataFilter.map((item) => ({
    ...item,
    id: item._id ?? "unknown-id",
  }));

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(resource);

  const rowMarkup = dataFilter.map((item: UnregisterClient, idx: number) => {
    return(
      <IndexTable.Row
        key={item._id}
        id={item._id}
        position={idx}
        selected={selectedResources.includes(item._id ?? "")}
      >
        <IndexTable.Cell as="th">
          {item.number}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {item.created_At}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={item.is_activate ? "success" : "attention"}>
            {item.is_activate ? "Activo" : "Inactivo"}
          </Badge>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  });

  const promotedBulkActions = [
    {
      content: "Ver Registro",
      onAction: () => setIsOpen((prev) => !prev),
    },
  ];

  if (loading) {
    return <p>Cargando Números...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const PHONE_NUMBER = data.find((item) => item._id == selectedResources[0])?.number.toString() ?? ""

  if(isOpen){
    return(
      <Page 
        title="Whatsapp"
        backAction={{content: 'Regresar', onAction: () => setIsOpen(false)}}
      >
        <Card padding={'0'}>
          {PHONE_NUMBER 
            ? (<Whatsapp phone={PHONE_NUMBER} />)
            : (<p>Sin número</p>)
          }
        </Card>
      </Page>
    )
  }

  return (
    <Page
      title="Números sin registrar"
    >
      <Card padding={'0'}>
      <div className="flex flex-col gap-4">
              <Filters
                queryValue={searchValue}
                onQueryChange={(value) => {
                  setSearchValue(value);
                  setCurrentPage(1);
                }}
                queryPlaceholder="Buscar por número"
                onQueryClear={() => setSearchValue("")}
                onClearAll={() => setSearchValue("")}
                filters={[]}
              />
              <IndexTable
                resourceName={{ singular: "registro", plural: "registros" }}
                itemCount={dataFilter.length}
                selectedItemsCount={
                  allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                  { title: "Número" },
                  { title: "Fecha" },
                  { title: "Estatus" },
                ]}
                promotedBulkActions={promotedBulkActions}
                emptyState="No se encontraron resultados"
              >
                {rowMarkup}
              </IndexTable>
              <div className="flex items-center w-full justify-between px-3 py-1 bg-[#f3f3f3] border-t">
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
                <Pagination
                  hasPrevious={currentPage > 1}
                  onPrevious={() => handlePagination("previous")}
                  hasNext={currentPage < totalPages}
                  onNext={() => handlePagination("next")}
                />
              </div>
            </div>
      </Card>
    </Page>
  );
}
