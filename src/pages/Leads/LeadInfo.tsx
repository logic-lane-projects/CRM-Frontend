import { Button, Icon, TextField, Select, Modal } from "@shopify/polaris";
import { PhoneIcon, EmailIcon } from "@shopify/polaris-icons";
import { useState, useEffect } from "react";
import ModalRegimenFiscal from "../../components/Modales/ModalRegimenFiscal";
import { useLocation } from "react-router-dom";
import { updateClient, deleteLead } from "../../services/leads";
import { useAuthToken } from "../../hooks/useAuthToken";
import { Toast } from "../../components/Toast/toast";
import { Ciudades } from "../../utils/estados";

export interface InfoLeads {
  _id?: string;
  names: string;
  paternal_surname: string;
  maternal_surname: string;
  email: string;
  phone_number: string;
  city: string | null;
  state: string | null;
  status: boolean | string | null;
  birthday_date: string;
  age: number;
  type_lead: string;
  gender: "MALE" | "FEMALE" | null;
  created_at?: string;
  updated_at?: string;
  type_person?: string;
  is_client?: boolean;
  assigned_to?: string | null;
}

interface InfoLeadProps {
  lead: InfoLeads;
}

export default function InfoLead({ lead }: InfoLeadProps) {
  const { userInfo, permisos } = useAuthToken();
  const modificarLeads = permisos?.includes("Modificar Leads") ?? false;
  const eliminarLeads = permisos?.includes("Eliminar Leads") ?? false;
  const [isRegimenOpen, setIsRegimenOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [names, setNames] = useState(lead.names);
  const [paternalSurname, setPaternalSurname] = useState(lead.paternal_surname);
  const [maternalSurname, setMaternalSurname] = useState(lead.maternal_surname);
  const [email, setEmail] = useState(lead.email);
  const [phoneNumber, setPhoneNumber] = useState(lead.phone_number);
  const [city, setCity] = useState(lead.city || "");
  const [state, setState] = useState(lead.state || "");
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [birthdayDate, setBirthdayDate] = useState("2024-01-01");
  const formattedDate = new Date(birthdayDate).toISOString().split("T")[0];
  const [age, setAge] = useState(lead.age ? lead.age.toString() : "");
  const [typeLead, setTypeLead] = useState(lead.type_lead);
  const [gender, setGender] = useState(lead.gender);

  useEffect(() => {
    if (state) {
      const selectedEstado = Ciudades.find((item) => item.Estado === state);
      setCiudades(selectedEstado ? selectedEstado.Ciudad : []);
    } else {
      setCiudades([]);
    }
  }, [state]);

  useEffect(() => {
    if(lead?.birthday_date){
      setBirthdayDate(lead?.birthday_date)
    }
  }, [lead])

  const typeLeadOptions = [
    { label: "Frío", value: "FRIO" },
    { label: "Tibio", value: "TIBIO" },
    { label: "Caliente", value: "CALIENTE" },
  ];

  const genderOptions = [
    { label: "Masculino", value: "MALE" },
    { label: "Femenino", value: "FEMALE" },
  ];

  const handleUpdateClient = async () => {
    setIsLoading(true);
    const updatedLeadData: InfoLeads = {
      names,
      paternal_surname: paternalSurname,
      maternal_surname: maternalSurname,
      email,
      phone_number: phoneNumber,
      city,
      state,
      birthday_date: birthdayDate,
      age: parseInt(age),
      type_lead: typeLead,
      gender,
      status: typeof lead.status === "boolean" ? lead.status : null,
      is_client: true,
      assigned_to: lead.assigned_to,
    };

    try {
      if (userInfo && userInfo.id) {
        await updateClient(lead._id || "", userInfo.id, updatedLeadData);
        Toast.fire({ icon: "success", title: "Cliente actualizado" });
      }
    } catch {
      Toast.fire({
        icon: "error",
        title: "Error al actualizar el cliente",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (date: string) => {
    const today = new Date();
    const birthDate = new Date(date);
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      calculatedAge--;
    }
    return calculatedAge.toString();
  };

  const handleBirthdayDateChange = (value: string) => {
    setBirthdayDate(value);
    setAge(calculateAge(value));
  };

  const deleteLeadHandler = async (id: string) => {
    setIsLoadingDelete(true);
    try {
      await deleteLead(id);
      Toast.fire({ icon: "success", title: "Lead eliminado correctamente" });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error || "Error al eliminar el lead",
      });
    } finally {
      setIsLoadingDelete(false);
    }
  };

  return (
    <div>
      <div className="flex items-center border-b-2">
        <img src="/images/avatar.png" className="w-20" alt="Avatar" />
        <div>
          <span className="font-medium text-lg">
            {lead.names} {lead.paternal_surname} {lead.maternal_surname}
          </span>
          <div className="flex w-full gap-3 mt-1">
            <span className="bg-gray-300 rounded-md p-[1px] cursor-pointer">
              <Icon source={PhoneIcon} tone="base" />
            </span>
            <span className="bg-gray-300 rounded-md p-[1px] cursor-pointer">
              <Icon source={EmailIcon} tone="base" />
            </span>
          </div>
        </div>
      </div>
      <div className="p-2">
        <TextField
          label="Nombre"
          value={names}
          onChange={(value) => setNames(value)}
          autoComplete="off"
        />
        <TextField
          label="Apellido Paterno"
          value={paternalSurname}
          onChange={(value) => setPaternalSurname(value)}
          autoComplete="off"
        />
        <TextField
          label="Apellido Materno"
          value={maternalSurname}
          onChange={(value) => setMaternalSurname(value)}
          autoComplete="off"
        />
        <TextField
          label="Correo"
          value={email}
          onChange={(value) => setEmail(value)}
          autoComplete="off"
          type="email"
        />
        <TextField
          label="Teléfono"
          value={phoneNumber}
          onChange={(value) => setPhoneNumber(value)}
          type="tel"
          autoComplete="off"
        />
        <Select
          label="Estado"
          options={[
            { label: "Selecciona una opción", value: "" },
            ...Ciudades.map((estado) => ({
              label: estado.Estado,
              value: estado.Estado,
            })),
          ]}
          value={state}
          onChange={(value) => setState(value)}
        />
        <Select
          label="Ciudad"
          options={[
            { label: "Selecciona una opción", value: "" },
            ...ciudades.map((ciudad) => ({
              label: ciudad,
              value: ciudad,
            })),
          ]}
          value={city}
          onChange={(value) => setCity(value)}
        />
        <TextField
          label="Fecha de nacimiento"
          value={formattedDate}
          onChange={(value) => handleBirthdayDateChange(value)}
          type="date"
          autoComplete="off"
        />
        <TextField
          label="Edad"
          value={age}
          type="number"
          disabled
          autoComplete="off"
        />
        <Select
          label="Tipo de lead"
          options={typeLeadOptions}
          value={typeLead}
          onChange={(value) => setTypeLead(value)}
        />
        <Select
          label="Género"
          options={genderOptions}
          value={gender || "MALE"}
          onChange={(value) => setGender(value as "MALE" | "FEMALE")}
        />
        <p>
          <strong>Fecha de creación:</strong>{" "}
          {new Date(lead.created_at ?? "").toLocaleDateString()}
        </p>
        <p>
          <strong>Última actualización:</strong>{" "}
          {new Date(lead.updated_at ?? "").toLocaleDateString()}
        </p>
        {(pathname.includes("comprador") || pathname.includes("cliente")) && (
          <div className="flex items-center gap-3">
            <strong>Regimen fiscal: </strong>
            {lead.type_person ? lead.type_person : "Sin Asignacion"}
            <Button onClick={() => setIsRegimenOpen(true)} variant="primary">
              Cambiar
            </Button>
          </div>
        )}
        <div className="mt-3 flex gap-2">
          {modificarLeads && (
            <Button
              disabled={isLoading}
              onClick={handleUpdateClient}
              variant="primary"
            >
              {isLoading ? "Actualizando..." : "Actualizar"}
            </Button>
          )}
          {eliminarLeads && (
            <Button
              disabled={isLoadingDelete}
              onClick={() => setIsModalOpen(true)}
            >
              {isLoadingDelete ? "Eliminando..." : "Eliminar"}
            </Button>
          )}
        </div>
      </div>
      {isRegimenOpen && (
        <ModalRegimenFiscal
          isOpen={isRegimenOpen}
          setIsOpen={setIsRegimenOpen}
          id={lead._id || ""}
        />
      )}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirmar eliminación"
          primaryAction={{
            content: "Eliminar",
            onAction: async () => {
              await deleteLeadHandler(lead._id || "");
              setIsModalOpen(false);
            },
            destructive: true,
          }}
          secondaryActions={[
            {
              content: "Cancelar",
              onAction: () => setIsModalOpen(false),
            },
          ]}
        >
          <Modal.Section>
            <p>
              ¿Estás seguro de que deseas eliminar este lead? Esta acción no se
              puede deshacer.
            </p>
          </Modal.Section>
        </Modal>
      )}
    </div>
  );
}
