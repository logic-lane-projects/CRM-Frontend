import {
  Frame,
  Modal,
  TextContainer,
  TextField,
  Select,
} from "@shopify/polaris";
import { useState, useEffect } from "react";
import { Toast } from "../Toast/toast";
import { createLead, updateLead } from "../../services/leads";
import { Lead } from "../../services/leads";

interface ModalRegistroVendedoresProps {
  leadInfo: Lead | null;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}
interface FormValues {
  nombre: string;
  apellidop: string;
  apellidom: string;
  correo: string;
  telefono: string;
  ciudad: string;
  state: string | null;
  birthday_date: string;
  age: number;
  type_lead: string;
  gender: "MALE" | "FEMALE" | null;
}

const initialFormValues: FormValues = {
  nombre: "",
  apellidop: "",
  apellidom: "",
  correo: "",
  telefono: "",
  ciudad: "",
  state: "",
  birthday_date: "",
  age: 0,
  type_lead: "TIBIO",
  gender: "MALE",
};

export default function ModalRegistroLeads({
  leadInfo,
  isOpen,
  setIsOpen,
}: ModalRegistroVendedoresProps) {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const genderOptions = [
    { label: "Selecciona una opción", value: "" },
    { label: "Masculino", value: "MALE" },
    { label: "Femenino", value: "FEMALE" },
  ];

  const typeLeadOptions = [
    { label: "Tibio", value: "TIBIO" },
    { label: "Frío", value: "FRIO" },
    { label: "Caliente", value: "CALIENTE" },
  ];

  useEffect(() => {
    if (leadInfo) {
      setFormValues({
        nombre: leadInfo.names || "",
        apellidop: leadInfo.paternal_surname || "",
        apellidom: leadInfo.maternal_surname || "",
        correo: leadInfo.email || "",
        telefono: leadInfo.phone_number || "",
        ciudad: leadInfo.city || "",
        state: leadInfo.state || "",
        birthday_date: leadInfo.birthday_date || "",
        age: leadInfo.age || 0,
        type_lead: leadInfo.type_lead || "TIBIO",
        gender: leadInfo.gender || "MALE",
      });
    } else {
      setFormValues(initialFormValues);
    }
  }, [leadInfo]);

  const handleFieldChange = (
    field: keyof FormValues,
    value: string | number
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(formValues).every(
      (value) => value !== "" && value !== null
    );
    setIsSubmitDisabled(!allFieldsFilled);
  }, [formValues]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const leadData: Lead = {
        names: formValues.nombre,
        paternal_surname: formValues.apellidop,
        maternal_surname: formValues.apellidom,
        email: formValues.correo,
        phone_number: formValues.telefono,
        city: formValues.ciudad,
        state: formValues.state,
        type_lead: formValues.type_lead,
        gender: formValues.gender,
        age: formValues.age,
        birthday_date: formValues.birthday_date,
        is_client: false,
      };

      if (leadInfo && leadInfo._id) {
        await updateLead(leadInfo._id, leadData);
        Toast.fire({ icon: "success", title: "Lead actualizado con éxito" });
      } else {
        await createLead(leadData);
        Toast.fire({ icon: "success", title: "Lead registrado con éxito" });
      }

      setIsOpen(false);
    } catch (error: unknown) {
      console.error("Error al registrar o actualizar el lead:", error);

      // Manejo del error si es un JSON stringified y tiene la estructura esperada
      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message);
          if (parsedError.data) {
            const apiErrors = parsedError.data;
            const newErrors: { [key: string]: string } = {};

            if (apiErrors.names) {
              newErrors.nombre = apiErrors.names.join(", ");
            }

            // Manejar otros campos si la API devuelve errores adicionales
            if (apiErrors.paternal_surname) {
              newErrors.apellidop = apiErrors.paternal_surname.join(", ");
            }
            if (apiErrors.maternal_surname) {
              newErrors.apellidom = apiErrors.maternal_surname.join(", ");
            }
            if (apiErrors.email) {
              newErrors.correo = apiErrors.email.join(", ");
            }
            if (apiErrors.phone_number) {
              newErrors.telefono = apiErrors.phone_number.join(", ");
            }

            setErrors(newErrors);
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (parseError) {
          // Si no se puede parsear el error, mostrar un mensaje genérico
          Toast.fire({
            icon: "error",
            title: "Error al procesar el formulario",
          });
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "Ocurrió un error inesperado",
        });
      }
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
          title={leadInfo ? "Editar Lead" : "Registro de Leads"}
          primaryAction={{
            content: isLoading
              ? "Cargando..."
              : leadInfo
              ? "Actualizar"
              : "Registrar",
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
              <TextField
                label="Apellido Paterno"
                value={formValues.apellidop}
                onChange={(value) => handleFieldChange("apellidop", value)}
                autoComplete="off"
                error={errors.apellidop}
              />
              <TextField
                label="Apellido Materno"
                value={formValues.apellidom}
                onChange={(value) => handleFieldChange("apellidom", value)}
                autoComplete="off"
                error={errors.apellidom}
              />
              <TextField
                label="Correo electrónico"
                value={formValues.correo}
                onChange={(value) => handleFieldChange("correo", value)}
                autoComplete="off"
                error={errors.correo}
              />
              <TextField
                label="Teléfono"
                value={formValues.telefono}
                onChange={(value) => handleFieldChange("telefono", value)}
                autoComplete="off"
                error={errors.telefono}
              />
              <TextField
                label="Ciudad"
                value={formValues.ciudad}
                onChange={(value) => handleFieldChange("ciudad", value)}
                autoComplete="off"
                error={errors.ciudad}
              />
              <TextField
                label="Estado"
                value={formValues.state || ""}
                onChange={(value) => handleFieldChange("state", value)}
                autoComplete="off"
                error={errors.state}
              />
              <TextField
                label="Fecha de Nacimiento"
                type="date"
                value={formValues.birthday_date || ""}
                onChange={(value) => handleFieldChange("birthday_date", value)}
                autoComplete="off"
                error={errors.birthday_date}
              />
              <TextField
                label="Edad"
                type="number"
                value={formValues.age.toString()}
                onChange={(value) => handleFieldChange("age", Number(value))}
                autoComplete="off"
                error={errors.age}
              />
              <Select
                label="Género"
                options={genderOptions}
                onChange={(value) =>
                  handleFieldChange("gender", value as "MALE" | "FEMALE")
                }
                value={formValues.gender || ""}
                error={errors.gender}
              />
              <Select
                label="Tipo de Lead"
                options={typeLeadOptions}
                onChange={(value) => handleFieldChange("type_lead", value)}
                value={formValues.type_lead || ""}
                error={errors.type_lead}
              />
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
