import { useState } from "react";
import { Button, IndexTable, Card, useIndexResourceState } from "@shopify/polaris";
import ModalRegistroVendedores from "../../components/Modales/ModalRegistroVendedores";

export default function Vendedores() {
  const [isOpen, setIsOpen] = useState(false);

  // Hardcode de vendedores
  const vendedores = [
    { id: "1", nombre: "Juan Pérez", correo: "juan.perez@email.com", ciudad: "Ciudad de México" },
    { id: "2", nombre: "Ana López", correo: "ana.lopez@email.com", ciudad: "Guadalajara" },
    { id: "3", nombre: "Carlos Hernández", correo: "carlos.hernandez@email.com", ciudad: "Monterrey" },
  ];

  // Uso del estado de recursos para el IndexTable
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(vendedores);

  const rowMarkup = vendedores.map(({ id, nombre, correo, ciudad }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      position={index}
      selected={selectedResources.includes(id)}
    >
      <IndexTable.Cell>
        <span>{nombre}</span>
      </IndexTable.Cell>
      <IndexTable.Cell>{correo}</IndexTable.Cell>
      <IndexTable.Cell>{ciudad}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex w-full justify-between items-center">
        <span className="font-semibold text-[20px]">Vendedores</span>
        <div className="ml-[100px]">
          <Button
            onClick={() => {
              setIsOpen(true);
            }}
            variant="primary"
          >
            Registro
          </Button>
        </div>
      </div>

      <Card>
        <IndexTable
          resourceName={{ singular: "vendedor", plural: "vendedores" }}
          itemCount={vendedores.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Nombre" },
            { title: "Correo Electrónico" },
            { title: "Ciudad" },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </Card>

      {isOpen && (
        <ModalRegistroVendedores isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
}
