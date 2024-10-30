import { Modal, TextContainer, Select } from "@shopify/polaris";
import { useState } from "react";
import { selectTypePerson } from "../../services/regimen";
import { Toast } from "../Toast/toast";
import { useAuthToken } from "../../hooks/useAuthToken";

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
  const { userInfo } = useAuthToken();
  const [isLoading, setIsLoading] = useState(false);
  const [typePerson, setTypePerson] = useState("FISICA");

  // Función para manejar el cambio de régimen
  const changeRegimen = async () => {
    setIsLoading(true);
    try {
      if (userInfo && userInfo.id) {
        await selectTypePerson(id, typePerson, userInfo.id);
      } else {
        console.log("no hay user id");
      }
      Toast.fire({ icon: "success", title: "Regimen cambiado" });
      setTimeout(() => {
        window.location.reload();
      }, 500);
      setIsOpen(false);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error || "Error al cambiar el Regimen fiscal",
        timer: 2000,
      });
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
          disabled: isLoading,
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
              onChange={(value) => setTypePerson(value)}
              value={typePerson}
            />
          </TextContainer>
        </Modal.Section>
      </Modal>
    </>
  );
}
