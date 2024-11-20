import { Frame, Modal, TextContainer, TextField, Select } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { Toast } from "../Toast/toast";
import { createLead, updateLead } from "../../services/leads";
import { Lead } from "../../services/leads";
import { useAuthToken } from "../../hooks/useAuthToken";
import { Ciudades } from "../../utils/estados";

interface ModalRegistroLeadsProps {
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
}: ModalRegistroLeadsProps) {
  const { userInfo } = useAuthToken();
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Estado para las opciones de estados y ciudades
  const [states, setStates] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const formattedStates = Ciudades.map((item) => ({
      label: item.Estado,
      value: item.Estado,
    }));
    setStates(formattedStates);

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
      const selectedState = leadInfo.state || "";
      updateCities(selectedState);
    } else {
      setFormValues(initialFormValues);
    }
  }, [leadInfo]);

  const updateCities = (state: string) => {
    const selectedStateData = Ciudades.find((item) => item.Estado === state);
    if (selectedStateData) {
      const formattedCities = selectedStateData.Ciudad.map((ciudad) => ({
        label: ciudad,
        value: ciudad,
      }));
      setCities(formattedCities);
    } else {
      setCities([]);
    }
  };

  const handleFieldChange = (
    field: keyof FormValues,
    value: string | number
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "state") {
      updateCities(value as string);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(formValues).every(
      (value) => value !== "" && value !== null
    );
    setIsSubmitDisabled(!allFieldsFilled);
  }, [formValues]);

  useEffect(() => {
    if (formValues.birthday_date) {
      const age = calculateAge(formValues.birthday_date);
      setFormValues((prev) => ({ ...prev, age }));
    }
  }, [formValues.birthday_date]);

  const handleSubmit = async () => {
    if (!userInfo) {
      Toast.fire({
        icon: "error",
        title: "No se ha podido obtener la información del usuario",
        timer: 5000
      });
      return;
    }

    setIsLoading(true);
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
        Toast.fire({
          icon: "success", title: "Lead actualizado con éxito", timer: 5000
        });
      } else {
        await createLead(leadData, userInfo.id);
        Toast.fire({
          icon: "success", title: "Lead registrado con éxito", timer: 5000
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }

      setIsOpen(false);
    } catch (error) {
      const errorMessage = typeof error === "string" ? error : String(error);
      Toast.fire({
        icon: "error",
        title: errorMessage,
        timer: 5000,
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
              <Select
                label="Estado"
                options={[
                  { label: "Selecciona una opción", value: "" },
                  ...states,
                ]}
                value={formValues.state || ""}
                onChange={(value) => handleFieldChange("state", value)}
              />
              <Select
                label="Ciudad"
                options={[
                  { label: "Selecciona una opción", value: "" },
                  ...cities,
                ]}
                value={formValues.ciudad || ""}
                onChange={(value) => handleFieldChange("ciudad", value)}
              />

              <TextField
                label="Fecha de Nacimiento"
                type="date"
                value={formValues.birthday_date || ""}
                onChange={(value) => handleFieldChange("birthday_date", value)}
                autoComplete="off"
              />
              <TextField
                label="Edad"
                type="number"
                value={formValues.age.toString()}
                onChange={(value) => handleFieldChange("age", Number(value))}
                autoComplete="off"
                error={errors.age}
                disabled
              />
              <Select
                label="Género"
                options={[
                  { label: "Masculino", value: "MALE" },
                  { label: "Femenino", value: "FEMALE" },
                ]}
                onChange={(value) => handleFieldChange("gender", value as "MALE" | "FEMALE")}
                value={formValues.gender || ""}
              />
              <Select
                label="Tipo de Lead"
                options={[
                  { label: "Tibio", value: "TIBIO" },
                  { label: "Frío", value: "FRIO" },
                  { label: "Caliente", value: "CALIENTE" },
                ]}
                onChange={(value) => handleFieldChange("type_lead", value)}
                value={formValues.type_lead || ""}
              />
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
