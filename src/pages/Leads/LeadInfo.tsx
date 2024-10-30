import { Button, Icon, TextField, Select } from "@shopify/polaris";
import { PhoneIcon, EmailIcon } from "@shopify/polaris-icons";
import { useState } from "react";
import ModalRegimenFiscal from "../../components/Modales/ModalRegimenFiscal";
import { useLocation } from "react-router-dom";
import { updateClient } from "../../services/leads";
import { useAuthToken } from "../../hooks/useAuthToken";
import { Toast } from "../../components/Toast/toast";

interface InfoLead {
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
}

interface InfoLeadProps {
  lead: InfoLead;
}

export default function InfoLead({ lead }: InfoLeadProps) {
  const { userInfo } = useAuthToken();
  const [isRegimenOpen, setIsRegimenOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  // Estados para los campos editables
  const [names, setNames] = useState(lead.names);
  const [paternalSurname, setPaternalSurname] = useState(lead.paternal_surname);
  const [maternalSurname, setMaternalSurname] = useState(lead.maternal_surname);
  const [email, setEmail] = useState(lead.email);
  const [phoneNumber, setPhoneNumber] = useState(lead.phone_number);
  const [city, setCity] = useState(lead.city || "");
  const [state, setState] = useState(lead.state || "");
  const [birthdayDate, setBirthdayDate] = useState(lead.birthday_date);
  const [age, setAge] = useState(lead.age ? lead.age.toString() : "");

  // Estado para tipo de lead y género
  const [typeLead, setTypeLead] = useState(lead.type_lead);
  const [gender, setGender] = useState(lead.gender);

  // Opciones para el campo select
  const typeLeadOptions = [
    { label: "Frío", value: "FRIO" },
    { label: "Tibio", value: "TIBIO" },
    { label: "Caliente", value: "CALIENTE" },
  ];

  const genderOptions = [
    { label: "Masculino", value: "MALE" },
    { label: "Femenino", value: "FEMALE" },
  ];

  // Función para manejar la actualización del cliente
  const handleUpdateClient = async () => {
    const updatedLeadData: InfoLead = {
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
      status: true,
      is_client: true,
    };

    try {
      if (userInfo && userInfo.id) {
        await updateClient(lead._id || "", userInfo.id, updatedLeadData);
      }
      Toast.fire({ icon: "success", title: "Cliente actualizado" });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error || "Error al actualizar el cliente",
      });
    }
  };

  return (
    <div>
      {/* Foto y Nombre */}
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

      {/* Detalles Lead */}
      <div className="p-2">
        <TextField
          label="Nombre"
          value={names}
          onChange={(value) => setNames(value)}
          autoComplete=""
        />
        <TextField
          label="Apellido Paterno"
          value={paternalSurname}
          onChange={(value) => setPaternalSurname(value)}
          autoComplete=""
        />
        <TextField
          label="Apellido Materno"
          value={maternalSurname}
          onChange={(value) => setMaternalSurname(value)}
          autoComplete=""
        />
        <TextField
          label="Correo"
          value={email}
          onChange={(value) => setEmail(value)}
          type="email"
          autoComplete="email"
        />
        <TextField
          label="Teléfono"
          value={phoneNumber}
          onChange={(value) => setPhoneNumber(value)}
          type="tel"
          autoComplete="tel"
        />
        <TextField
          label="Ciudad"
          value={city}
          onChange={(value) => setCity(value)}
          autoComplete=""
        />
        <TextField
          label="Estado"
          value={state}
          onChange={(value) => setState(value)}
          autoComplete=""
        />
        <TextField
          label="Fecha de nacimiento"
          value={birthdayDate}
          onChange={(value) => setBirthdayDate(value)}
          autoComplete=""
          type="date"
        />
        <TextField
          label="Edad"
          value={age}
          onChange={(value) => setAge(value)}
          type="number"
          autoComplete=""
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
            <Button
              onClick={() => {
                setIsRegimenOpen(true);
              }}
              variant="primary"
            >
              Cambiar
            </Button>
          </div>
        )}
        <div className="mt-3">
          <Button onClick={handleUpdateClient} variant="primary">
            Actualizar
          </Button>
        </div>
      </div>
      {isRegimenOpen && (
        <ModalRegimenFiscal
          isOpen={isRegimenOpen}
          setIsOpen={setIsRegimenOpen}
          id={lead._id || ""}
        />
      )}
    </div>
  );
}
