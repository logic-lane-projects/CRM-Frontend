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

export default function Leads() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  // Hardcode de leads
  const leads = [
    {
      id: "1",
      nombre: "Juan Pérez",
      correo: "juan.perez@email.com",
      ciudad: "Ciudad de México",
    },
    {
      id: "2",
      nombre: "Ana López",
      correo: "ana.lopez@email.com",
      ciudad: "Guadalajara",
    },
    {
      id: "3",
      nombre: "Carlos Hernández",
      correo: "carlos.hernandez@email.com",
      ciudad: "Monterrey",
    },
    {
      id: "4",
      nombre: "María Rodríguez",
      correo: "maria.rodriguez@email.com",
      ciudad: "Puebla",
    },
    {
      id: "5",
      nombre: "Luis García",
      correo: "luis.garcia@email.com",
      ciudad: "Tijuana",
    },
    {
      id: "6",
      nombre: "Sofía Martínez",
      correo: "sofia.martinez@email.com",
      ciudad: "Chihuahua",
    },
    {
      id: "7",
      nombre: "Pedro Sánchez",
      correo: "pedro.sanchez@email.com",
      ciudad: "Mérida",
    },
    {
      id: "8",
      nombre: "Laura Ramírez",
      correo: "laura.ramirez@email.com",
      ciudad: "Cancún",
    },
    {
      id: "9",
      nombre: "Miguel Torres",
      correo: "miguel.torres@email.com",
      ciudad: "León",
    },
    {
      id: "10",
      nombre: "Lucía Castillo",
      correo: "lucia.castillo@email.com",
      ciudad: "Aguascalientes",
    },
    {
      id: "11",
      nombre: "Antonio Morales",
      correo: "antonio.morales@email.com",
      ciudad: "Querétaro",
    },
    {
      id: "12",
      nombre: "Andrea Ruiz",
      correo: "andrea.ruiz@email.com",
      ciudad: "Morelia",
    },
    {
      id: "13",
      nombre: "Roberto Gómez",
      correo: "roberto.gomez@email.com",
      ciudad: "Hermosillo",
    },
    {
      id: "14",
      nombre: "Daniela Vargas",
      correo: "daniela.vargas@email.com",
      ciudad: "Culiacán",
    },
    {
      id: "15",
      nombre: "Fernando Díaz",
      correo: "fernando.diaz@email.com",
      ciudad: "Zacatecas",
    },
    {
      id: "16",
      nombre: "Gabriela Flores",
      correo: "gabriela.flores@email.com",
      ciudad: "Toluca",
    },
    {
      id: "17",
      nombre: "Alejandro Reyes",
      correo: "alejandro.reyes@email.com",
      ciudad: "Saltillo",
    },
    {
      id: "18",
      nombre: "Natalia Gómez",
      correo: "natalia.gomez@email.com",
      ciudad: "Tepic",
    },
    {
      id: "19",
      nombre: "David Mendoza",
      correo: "david.mendoza@email.com",
      ciudad: "Durango",
    },
    {
      id: "20",
      nombre: "Paula Romero",
      correo: "paula.romero@email.com",
      ciudad: "Cuernavaca",
    },
    {
      id: "21",
      nombre: "Enrique Herrera",
      correo: "enrique.herrera@email.com",
      ciudad: "Oaxaca",
    },
    {
      id: "22",
      nombre: "Valeria Ortiz",
      correo: "valeria.ortiz@email.com",
      ciudad: "San Luis Potosí",
    },
    {
      id: "23",
      nombre: "Ricardo Jiménez",
      correo: "ricardo.jimenez@email.com",
      ciudad: "Colima",
    },
    {
      id: "24",
      nombre: "Elena Vega",
      correo: "elena.vega@email.com",
      ciudad: "Villahermosa",
    },
    {
      id: "25",
      nombre: "Emilio Peña",
      correo: "emilio.pena@email.com",
      ciudad: "Veracruz",
    },
    {
      id: "26",
      nombre: "Isabel Cortés",
      correo: "isabel.cortes@email.com",
      ciudad: "Acapulco",
    },
    {
      id: "27",
      nombre: "Diego Silva",
      correo: "diego.silva@email.com",
      ciudad: "Tuxtla Gutiérrez",
    },
    {
      id: "28",
      nombre: "Mariana Luna",
      correo: "mariana.luna@email.com",
      ciudad: "Campeche",
    },
    {
      id: "29",
      nombre: "Sebastián Aguirre",
      correo: "sebastian.aguirre@email.com",
      ciudad: "Mexicali",
    },
    {
      id: "30",
      nombre: "Adriana Ponce",
      correo: "adriana.ponce@email.com",
      ciudad: "La Paz",
    },
  ];

  // Filtro de búsqueda
  const filteredLeads = leads.filter(
    (lead) =>
      lead.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
      lead.correo.toLowerCase().includes(searchValue.toLowerCase()) ||
      lead.ciudad.toLowerCase().includes(searchValue.toLowerCase())
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
      onAction: () => console.log("Ver Lead"),
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
    ({ id, nombre, correo, ciudad }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        position={index}
        selected={selectedResources.includes(id)}
      >
        <IndexTable.Cell>{nombre}</IndexTable.Cell>
        <IndexTable.Cell>{correo}</IndexTable.Cell>
        <IndexTable.Cell>{ciudad}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex w-full justify-between items-center">
        <span className="font-semibold text-[20px]">Leads</span>
        <Button onClick={() => setIsOpen(true)} variant="primary">
          Registro
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
            resourceName={{ singular: "lead", plural: "leads" }}
            itemCount={filteredLeads.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Nombre" },
              { title: "Correo Electrónico" },
              { title: "Ciudad" },
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
      {isOpen && (
        <ModalRegistroLeads isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
}
