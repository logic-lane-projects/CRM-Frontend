import { Frame, Modal, TextContainer, TextField, Select } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { Toast } from "../Toast/toast";
import {
  getOfficeById,
  updateOffice,
  createOffice,
} from "../../services/oficinas";
import { useAuthToken } from "../../hooks/useAuthToken";
import { Ciudades } from "../../utils/estados";

interface ModalRegistroOficinasProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  idOficina: string | null;
  registrar: boolean;
}

const initialFormValues = {
  ciudad: "",
  estado: "",
  nombre: "",
  numero_telefonico: "",
};

export default function ModalRegistroOficinas({
  isOpen,
  setIsOpen,
  idOficina,
  registrar,
}: ModalRegistroOficinasProps) {
  const { userInfo } = useAuthToken();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [states, setStates] = useState<{ Estado: string; Ciudad: string[] }[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Cargar los estados y ciudades desde el JSON
  useEffect(() => {
    setStates(Ciudades); // Asumimos que Ciudades es el nombre del archivo JSON importado
  }, []);

  // Cuando cambia el estado, actualizar las ciudades disponibles
  useEffect(() => {
    const selectedState = states.find((state) => state.Estado === formValues.estado);
    if (selectedState) {
      setCities(selectedState.Ciudad);
    } else {
      setCities([]);
    }
  }, [formValues.estado, states]);

  // Cargar datos de la oficina si es un caso de edición
  useEffect(() => {
    if (!registrar && idOficina) {
      const fetchOfficeData = async () => {
        try {
          const response = await getOfficeById(idOficina);
          if (response.result && response.data) {
            const { ciudad, estado, nombre, numero_telefonico } = response.data;
            setFormValues({ ciudad, estado, nombre, numero_telefonico });
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
    } else {
      setFormValues(initialFormValues);
    }
  }, [idOficina, registrar]);

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
      if (registrar) {
        const response = await createOffice(userInfo.id, {
          nombre: formValues.nombre,
          ciudad: formValues.ciudad,
          estado: formValues.estado,
          numero_telefonico: formValues.numero_telefonico,
        });
        if (response.result) {
          Toast.fire({ icon: "success", title: "Oficina registrada" });
        } else {
          throw new Error("No se pudo registrar la oficina");
        }
      } else {
        const response = await updateOffice(idOficina!, userInfo.id, formValues);
        if (response.result) {
          Toast.fire({ icon: "success", title: "Oficina actualizada" });
        } else {
          throw new Error("No se pudo actualizar la oficina");
        }
      }
      setIsOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error(
        `Error al ${registrar ? "registrar" : "actualizar"} la oficina:`,
        error
      );
      Toast.fire({
        icon: "error",
        title: `Error al ${registrar ? "registrar" : "actualizar"} la oficina`,
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
          title={registrar ? "Registrar Oficina" : "Editar Oficina"}
          primaryAction={{
            content: isLoading
              ? "Cargando..."
              : registrar
              ? "Registrar"
              : "Guardar",
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
                label="Nombre"
                value={formValues.nombre}
                onChange={(value) => handleFieldChange("nombre", value)}
                autoComplete="off"
                error={errors.nombre}
              />
              <Select
                label="Estado"
                value={formValues.estado}
                onChange={(value) => handleFieldChange("estado", value)}
                options={[
                  { label: "Selecciona una opción", value: "" }, // Opción predeterminada
                  ...states.map((state) => ({
                    label: state.Estado,
                    value: state.Estado,
                  })),
                ]}
                error={errors.estado}
              />
              <Select
                label="Ciudad"
                value={formValues.ciudad}
                onChange={(value) => handleFieldChange("ciudad", value)}
                options={[
                  { label: "Selecciona una opción", value: "" }, // Opción predeterminada
                  ...cities.map((city) => ({
                    label: city,
                    value: city,
                  })),
                ]}
                error={errors.ciudad}
              />
              <TextField
                label="Número Telefónico"
                value={formValues.numero_telefonico}
                onChange={(value) => handleFieldChange("numero_telefonico", value)}
                autoComplete="off"
                error={errors.numero_telefonico}
              />
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
