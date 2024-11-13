import { Frame, Modal, TextContainer, TextField } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { Toast } from "../Toast/toast";
import { getOfficeById, updateOffice } from "../../services/oficinas";
import { useAuthToken } from "../../hooks/useAuthToken";

interface ModalRegistroOficinasProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  idOficina: string | null;
}

const initialFormValues = {
  ciudad: "",
  estado: "",
  oficina: "",
};

export default function ModalRegistroOficinas({
  isOpen,
  setIsOpen,
  idOficina,
}: ModalRegistroOficinasProps) {
  const { userInfo } = useAuthToken();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (idOficina) {
      const fetchOfficeData = async () => {
        try {
          const response = await getOfficeById(idOficina);
          if (response.result && response.data) {
            const { ciudad, estado, oficina } = response.data;
            setFormValues({ ciudad, estado, oficina });
          } else {
            Toast.fire({
              icon: "error",
              title: "No se pudo cargar la información de la oficina",
            });
          }
        } catch (error) {
          console.error("Error al cargar la oficina:", error);
          Toast.fire({
            icon: "error",
            title: "Error al cargar la oficina",
          });
        }
      };
      fetchOfficeData();
    }
  }, [idOficina]);

  useEffect(() => {
    const allFieldsFilled = Object.values(formValues).every(
      (value) => value.trim() !== ""
    );
    setIsSubmitDisabled(!allFieldsFilled);
  }, [formValues]);

  const handleFieldChange = (
    field: keyof typeof initialFormValues,
    value: string
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    if (!userInfo) {
      Toast.fire({
        icon: "error",
        title: "Usuario no autenticado",
      });
      return;
    }
    setIsLoading(true);
    const newErrors: { [key: string]: string } = {};

    Object.keys(formValues).forEach((key) => {
      if (!formValues[key as keyof typeof initialFormValues]) {
        newErrors[key] = "Campo obligatorio";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    setErrors({});

    try {
      const response = await updateOffice(idOficina!, userInfo.id, formValues);
      if (response.result) {
        Toast.fire({ icon: "success", title: "Oficina actualizada" });
        setIsOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        throw new Error("No se pudo actualizar la oficina");
      }
    } catch (error) {
      console.error("Error al actualizar la oficina:", error);
      Toast.fire({
        icon: "error",
        title: "Error al actualizar la oficina",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Frame>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Editar Oficina"
          primaryAction={{
            content: isLoading ? "Cargando..." : "Guardar",
            onAction: handleSubmit,
            disabled: isSubmitDisabled || isLoading,
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
              <TextField
                label="Ciudad"
                value={formValues.ciudad}
                onChange={(value) => handleFieldChange("ciudad", value)}
                autoComplete="off"
                error={errors.ciudad}
              />
              <TextField
                label="Estado"
                value={formValues.estado}
                onChange={(value) => handleFieldChange("estado", value)}
                autoComplete="off"
                error={errors.estado}
              />
              <TextField
                label="Oficina"
                value={formValues.oficina}
                onChange={(value) => handleFieldChange("oficina", value)}
                autoComplete="off"
                error={errors.oficina}
              />
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
