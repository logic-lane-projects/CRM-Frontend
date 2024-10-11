import { useState } from "react";
import ModalRegistroLeads from "../../components/Modales/ModalRegistroLeads";
import {
  IndexTable,
  useIndexResourceState,
  TextField,
  Pagination,
  Button,
  Card,
  Select,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

export default function Leads() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  // Hardcode de leads
  const leads = [
    {
      id: "1",
      nombre: "Juan Pérez",
      organizacion: "Tech Solutions",
      status: "Nuevo",
      source: "Facebook",
      correo: "juan.perez@email.com",
      telefono: "555-123-4567",
      asignadoA: "Carlos García",
    },
    {
      id: "2",
      nombre: "Ana López",
      organizacion: "Marketing Pro",
      status: "Contactado",
      source: "LinkedIn",
      correo: "ana.lopez@email.com",
      telefono: "555-987-6543",
      asignadoA: "Luis Martínez",
    },
    {
      id: "3",
      nombre: "Carlos Hernández",
      organizacion: "Innova Corp",
      status: "En negociación",
      source: "Evento",
      correo: "carlos.hernandez@email.com",
      telefono: "555-456-7890",
      asignadoA: "Andrea Ruiz",
    },
    {
      id: "4",
      nombre: "María Rodríguez",
      organizacion: "Global Tech",
      status: "Nuevo",
      source: "Google Ads",
      correo: "maria.rodriguez@email.com",
      telefono: "555-321-6543",
      asignadoA: "Roberto Gómez",
    },
    {
      id: "5",
      nombre: "Luis García",
      organizacion: "Creative Agency",
      status: "Contactado",
      source: "Referencia",
      correo: "luis.garcia@email.com",
      telefono: "555-654-9876",
      asignadoA: "Daniela Vargas",
    },
    {
      id: "6",
      nombre: "Sofía Martínez",
      organizacion: "StartUp Hub",
      status: "En negociación",
      source: "LinkedIn",
      correo: "sofia.martinez@email.com",
      telefono: "555-789-1234",
      asignadoA: "Fernando Díaz",
    },
    {
      id: "7",
      nombre: "Pedro Sánchez",
      organizacion: "Tech Innovators",
      status: "Nuevo",
      source: "Facebook",
      correo: "pedro.sanchez@email.com",
      telefono: "555-456-3210",
      asignadoA: "Gabriela Flores",
    },
    {
      id: "8",
      nombre: "Laura Ramírez",
      organizacion: "Media House",
      status: "Contactado",
      source: "Google Ads",
      correo: "laura.ramirez@email.com",
      telefono: "555-123-7894",
      asignadoA: "Alejandro Reyes",
    },
    {
      id: "9",
      nombre: "Miguel Torres",
      organizacion: "E-Commerce Pro",
      status: "En negociación",
      source: "Evento",
      correo: "miguel.torres@email.com",
      telefono: "555-321-4567",
      asignadoA: "Natalia Gómez",
    },
    {
      id: "10",
      nombre: "Lucía Castillo",
      organizacion: "Techno World",
      status: "Nuevo",
      source: "Referencia",
      correo: "lucia.castillo@email.com",
      telefono: "555-789-6543",
      asignadoA: "David Mendoza",
    },
    {
      id: "11",
      nombre: "Antonio Morales",
      organizacion: "Smart Solutions",
      status: "Contactado",
      source: "Google Ads",
      correo: "antonio.morales@email.com",
      telefono: "555-987-3210",
      asignadoA: "Paula Romero",
    },
    {
      id: "12",
      nombre: "Andrea Ruiz",
      organizacion: "Cloud Services",
      status: "En negociación",
      source: "LinkedIn",
      correo: "andrea.ruiz@email.com",
      telefono: "555-123-4568",
      asignadoA: "Enrique Herrera",
    },
    {
      id: "13",
      nombre: "Roberto Gómez",
      organizacion: "IT Solutions",
      status: "Nuevo",
      source: "Evento",
      correo: "roberto.gomez@email.com",
      telefono: "555-321-7894",
      asignadoA: "Valeria Ortiz",
    },
    {
      id: "14",
      nombre: "Daniela Vargas",
      organizacion: "Innovate Group",
      status: "Contactado",
      source: "Facebook",
      correo: "daniela.vargas@email.com",
      telefono: "555-654-3210",
      asignadoA: "Ricardo Jiménez",
    },
    {
      id: "15",
      nombre: "Fernando Díaz",
      organizacion: "Biz Corp",
      status: "En negociación",
      source: "Referencia",
      correo: "fernando.diaz@email.com",
      telefono: "555-789-9876",
      asignadoA: "Elena Vega",
    },
  ];

  // Filtro de búsqueda
  const filteredLeads = leads.filter(
    (lead) =>
      lead.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
      lead.correo.toLowerCase().includes(searchValue.toLowerCase())
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
    useIndexResourceState(leads);

  const promotedBulkActions = [
    {
      content: "Ver Lead",
      onAction: () => {
        navigate(`/leads/${selectedResources}`);
      },
    },
    {
      content: "Eliminar",
      onAction: () => console.log("Eliminar Lead"),
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
    (
      { id, nombre, organizacion, status, source, correo, telefono, asignadoA },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        position={index}
        selected={selectedResources.includes(id)}
      >
        <IndexTable.Cell>{nombre}</IndexTable.Cell>
        <IndexTable.Cell>{organizacion}</IndexTable.Cell>
        <IndexTable.Cell>{status}</IndexTable.Cell>
        <IndexTable.Cell>{source}</IndexTable.Cell>
        <IndexTable.Cell>{correo}</IndexTable.Cell>
        <IndexTable.Cell>{telefono}</IndexTable.Cell>
        <IndexTable.Cell>{asignadoA}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex w-full justify-between items-center">
        <span className="font-semibold text-[20px]">Leads - esperando endpoint</span>
        <Button disabled onClick={() => setIsOpen(true)} variant="primary">
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

          <IndexTable
            resourceName={{ singular: "lead", plural: "leads" }}
            itemCount={filteredLeads.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Nombre" },
              { title: "Organización" },
              { title: "Estatus" },
              { title: "Fuente" },
              { title: "Correo Electrónico" },
              { title: "Teléfono" },
              { title: "Asignado A" },
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

            {/* Select para número de leads por página */}
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
      {/* Modal para registrar leads */}
      {isOpen && <ModalRegistroLeads isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
}
