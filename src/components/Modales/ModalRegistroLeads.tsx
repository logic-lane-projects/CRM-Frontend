import {
  Frame,
  Modal,
  TextContainer,
  TextField,
  Select,
} from "@shopify/polaris";
import { useState, useEffect } from "react";
import { Toast } from "../Toast/toast";
import { createLead } from "../../services/leads";

interface ModalRegistroVendedoresProps {
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

  const handleFieldChange = (field: keyof FormValues, value: string | number) => {
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
    const newErrors: { [key: string]: string } = {};
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key as keyof FormValues]) {
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
      const leadData = {
        names: formValues.nombre,
        paternal_surname: formValues.apellidop,
        maternal_surname: formValues.apellidom,
        email: formValues.correo,
        phone_number: formValues.telefono,
        city: formValues.ciudad,
        state: formValues.state,        
        type_lead: formValues.type_lead,       
        gender: formValues.gender,              
        is_client: false,                       
        age: formValues.age,                   
        birthday_date: formValues.birthday_date,
      };

      const leadResponse = await createLead(leadData);
      console.log("Lead creado con éxito:", leadResponse);

      Toast.fire({ icon: "success", title: "Lead registrado con éxito" });
      setIsOpen(false);
    } catch (error) {
      console.error("Error al registrar el lead:", error);
      setErrors((prev) => ({
        ...prev,
        correo: "Hubo un problema al registrar el lead",
      }));

      const errorMessage = typeof error === "string" ? error : String(error);

      Toast.fire({
        icon: "error",
        title: errorMessage,
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
          title="Registro de Leads"
          primaryAction={{
            content: isLoading ? "Cargando..." : "Registrar",
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
