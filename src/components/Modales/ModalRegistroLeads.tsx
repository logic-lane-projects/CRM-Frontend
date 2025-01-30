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
import { useAuthToken } from "../../hooks/useAuthToken";
import { Ciudades } from "../../utils/estados";
import { getAllOffices } from "../../services/oficinas";
import { OfficeData } from "../../services/oficinas";
import { validarCorreo } from "../../utils/validateEmail";
import { validarTelefono } from "../../utils/validateEmail";

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
  profesion: string;
  especialidad: string;
  oficina: string
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
  profesion: "",
  especialidad: "",
  oficina: ""
};

export default function ModalRegistroLeads({
  leadInfo,
  isOpen,
  setIsOpen,
}: ModalRegistroLeadsProps) {
  const { userInfo } = useAuthToken();
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Estado para las opciones de estados y ciudades
  const [states, setStates] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [oficinas, setOficinas] = useState<OfficeData[]>([]);
  const [oficina, setOficina] = useState<string | undefined>();

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
        profesion: leadInfo.profesion || "",
        especialidad: leadInfo.especialidad || "",
        oficina: oficina || "",
      });
      const selectedState = leadInfo.state || "";
      updateCities(selectedState);
    } else {
      setFormValues(initialFormValues);
    }
    // eslint-disable-next-line
  }, [leadInfo]);

  const fetchAllOfices = async () => {
    try {
      const response = await getAllOffices();
      if (response?.result) {
        setOficinas(response?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAllOfices()
  }, [])

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
    if (field === "state") {
      updateCities(value as string);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const requiredFields = ["nombre", "correo", "telefono", "type_lead"];
    const allRequiredFieldsFilled = requiredFields.every(
      (field) => formValues[field as keyof FormValues] !== ""
    );
    setIsSubmitDisabled(!allRequiredFieldsFilled);
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
        timer: 5000,
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
        profesion: formValues.profesion,
        especialidad: formValues.especialidad,
        oficina: oficina
      };

      if (leadInfo && leadInfo._id) {
        await updateLead(leadInfo._id, leadData);
        Toast.fire({
          icon: "success",
          title: "Lead actualizado con éxito",
          timer: 5000,
        });
      } else {
        await createLead(leadData, userInfo.id);
        Toast.fire({
          icon: "success",
          title: "Lead registrado con éxito",
          timer: 5000,
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
            disabled: isSubmitDisabled || isLoading || oficina === '' || leadInfo?.city === "" || leadInfo?.state === "",
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
                label="Nombre*"
                value={formValues.nombre}
                onChange={(value) =>
                  /^[a-zA-Z\s]*$/.test(value) &&
                  handleFieldChange("nombre", value)
                }
                autoComplete="off"
                error={!formValues.nombre && "Ingresa el nombre"}
              />

              <TextField
                label="Apellido Paterno"
                value={formValues.apellidop}
                onChange={(value) =>
                  /^[a-zA-Z\s]*$/.test(value) &&
                  handleFieldChange("apellidop", value)
                }
                autoComplete="off"
              />
              <TextField
                label="Apellido Materno"
                value={formValues.apellidom}
                onChange={(value) =>
                  /^[a-zA-Z\s]*$/.test(value) &&
                  handleFieldChange("apellidom", value)
                }
                autoComplete="off"
              />
              <TextField
                label="Correo electrónico*"
                value={formValues.correo}
                onChange={(value) => handleFieldChange("correo", value)}
                autoComplete="off"
                error={!validarCorreo(formValues?.correo) && "Coreo invalido"}
              />
              <TextField
                label="Teléfono*"
                value={formValues.telefono}
                onChange={(value) =>
                  /^[0-9]*$/.test(value) && handleFieldChange("telefono", value)
                }
                autoComplete="off"
                error={!validarTelefono(formValues.telefono) && "Telefono invalido"}
              />
              <Select
                label="Estado*"
                options={[
                  { label: "Selecciona una opción", value: "" },
                  ...states,
                ]}
                value={formValues.state || ""}
                onChange={(value) => handleFieldChange("state", value)}
                error={!formValues.state && "Selecciona un estado"}
              />
              <Select
                label="Ciudad*"
                options={[
                  { label: "Selecciona una opción", value: "" },
                  ...cities,
                ]}
                value={formValues.ciudad || ""}
                onChange={(value) => handleFieldChange("ciudad", value)}
                error={!formValues.ciudad && "Selecciona una ciudad"}
              />
              <Select
                label="Oficina"
                options={[
                  { label: "Selecciona una opción", value: "" },
                  ...oficinas.map((oficina) => ({
                    label: oficina?.nombre,
                    value: oficina?._id,
                  })),
                ]}
                value={oficina || ""}
                onChange={(value) => setOficina(value)}
                error={oficina ? "" : "La oficina es requerida"}
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
                disabled
              />
              <Select
                label="Género"
                options={[
                  { label: "Masculino", value: "MALE" },
                  { label: "Femenino", value: "FEMALE" },
                ]}
                onChange={(value) =>
                  handleFieldChange("gender", value as "MALE" | "FEMALE")
                }
                value={formValues.gender || ""}
              />
              <TextField
                label="Profesion"
                value={formValues.profesion}
                onChange={(value) => handleFieldChange("profesion", value)}
                autoComplete="off"
              />
              <TextField
                label="Especialidad"
                value={formValues.especialidad}
                onChange={(value) => handleFieldChange("especialidad", value)}
                autoComplete="off"
              />
              <Select
                label="Tipo de Lead*"
                options={[
                  { label: "Tibio", value: "TIBIO" },
                  { label: "Frío", value: "FRIO" },
                  { label: "Caliente", value: "CALIENTE" },
                ]}
                onChange={(value) => handleFieldChange("type_lead", value)}
                value={formValues.type_lead || ""}
                error={!formValues.type_lead && "Selecciona un tipo de lead"}
              />
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
