import { Icon } from "@shopify/polaris";
import { PhoneIcon, EmailIcon } from "@shopify/polaris-icons";

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
  created_at: string;
  updated_at: string;
}

interface InfoLeadProps {
  lead: InfoLead;
}

export default function InfoLead({ lead }: InfoLeadProps) {
  return (
    <div>
      {/* Foto y Nombre */}
      <div className="flex items-center border-b-2">
        <img src="../../../public/images/avatar.png" className="w-20" alt="Avatar" />
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
        <p><strong>Correo:</strong> {lead.email}</p>
        <p><strong>Teléfono:</strong> {lead.phone_number}</p>
        <p><strong>Ciudad:</strong> {lead.city ? lead.city : "No disponible"}</p>
        <p><strong>Estado:</strong> {lead.state ? lead.state : "No disponible"}</p>
        <p><strong>Fecha de nacimiento:</strong> {lead.birthday_date}</p>
        <p><strong>Edad:</strong> {lead.age}</p>
        <p><strong>Tipo de lead:</strong> {lead.type_lead}</p>
        <p><strong>Género:</strong> {lead.gender === "MALE" ? "Masculino" : "Femenino"}</p>
        <p><strong>Fecha de creación:</strong> {new Date(lead.created_at).toLocaleDateString()}</p>
        <p><strong>Última actualización:</strong> {new Date(lead.updated_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
