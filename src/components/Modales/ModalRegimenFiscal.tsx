import { Modal, TextContainer, Select } from "@shopify/polaris";
import { useState } from "react";
import { selectTypePerson } from "../../services/regimen";
import { Toast } from "../Toast/toast";

export interface ModalRegimenProps {
  isOpen: boolean;
  setIsOpen: (loading: boolean) => void;
  id: string;
}

export default function ModalRegimenFiscal({
  isOpen,
  setIsOpen,
  id,
}: ModalRegimenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [typePerson, setTypePerson] = useState("FISICA");

  // Función para manejar el cambio de régimen
  const changeRegimen = async () => {
    setIsLoading(true);
    try {
      const response = await selectTypePerson(id, typePerson);
      console.log("Cambio de régimen exitoso:", response);
      setIsOpen(false); // Cerrar el modal después del cambio
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error || "Error al cambiar el Regimen fiscal",
        timer: 2000,
      });
      console.error("Error al cambiar el régimen fiscal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Opciones para el select
  const options = [
    { label: "FISICA", value: "FISICA" },
    { label: "MORAL", value: "MORAL" },
  ];

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title="Cambiar el Régimen Fiscal"
        primaryAction={{
          content: isLoading ? "Cambiando..." : "Cambiar",
          onAction: changeRegimen,
          disabled: isLoading, // Deshabilitar botón durante la carga
        }}
        secondaryActions={[
          {
            content: "Cancelar",
            onAction: () => setIsOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              Selecciona el tipo de régimen fiscal que deseas asignar al
              cliente.
            </p>

            {/* Select para elegir el tipo de persona */}
            <Select
              label="Tipo de Régimen"
              options={options}
              onChange={(value) => setTypePerson(value)} // Actualizar el valor seleccionado
              value={typePerson} // Valor seleccionado actualmente
            />
          </TextContainer>
        </Modal.Section>
      </Modal>
    </>
  );
}
