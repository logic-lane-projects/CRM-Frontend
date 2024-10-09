import { Button, Frame, Modal, TextContainer } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { TextField } from "@shopify/polaris";

// Declaración de la interfaz para las props del modal
interface ModalRegistroUsuariosProps {
  isOpen: boolean; // Prop para controlar si el modal está abierto
  setIsOpen: (value: boolean) => void;
}

export default function ModalRegistroUsuarios({
  isOpen,
  setIsOpen,
}: ModalRegistroUsuariosProps) {
  const [nombre, setNombre] = useState("");
  return (
    <div>
      <Frame>
        <Modal
          open={isOpen}
          onClose={() => {
            setIsOpen(!isOpen);
          }}
          title="Registro de usuarios"
          primaryAction={{
            content: "Registrar",
            onAction: () => {
              console.log("Registrar");
            },
          }}
          secondaryActions={[
            {
              content: "Cancelar",
              onAction: () => {
                setIsOpen(!isOpen);
              },
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <div>
                Aqui comienza utilizando TextFields de shoopify polaris, seran
                los siguientes campos:
                <div>
                  nombre apellido materno apellido paterno correo electrónico
                  teléfono ciudad rol
                </div>
                <div>
                  <TextField
                    label="Store name"
                    value={nombre}
                    onChange={(value) => {
                      setNombre(value);
                    }}
                    autoComplete="off"
                  />
                </div>
              </div>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
