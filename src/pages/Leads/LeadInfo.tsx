import { Icon } from "@shopify/polaris";
import { PhoneIcon, EmailIcon } from "@shopify/polaris-icons";

interface InfoLead {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  organizacion: string;
  website: string;
  industria: string;
  jobTitle: string;
  source: string;
  asignadoA: string;
  referirseComo: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
  email: string;
  telefono: string;
  emailsRecibidos: number;
  llamadasRealizadas: number;
}

interface InfoLeadProps {
  lead: InfoLead;
}

export default function InfoLead({ lead }: InfoLeadProps) {
  return (
    <div>
      {/* Foto y Nombre */}
      <div className="flex items-center border-b-2">
        <img src="../../../public/images/avatar.png" className="w-20" alt="" />
        <div>
          <span className="font-medium text-lg">
            {lead.nombre} {lead.apellidoPaterno} {lead.apellidoMaterno}
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
        <p>
          <strong>Organización:</strong> {lead.organizacion}
        </p>
        <p>
          <strong>Website:</strong> {lead.website}
        </p>
        <p>
          <strong>Industria:</strong> {lead.industria}
        </p>
        <p>
          <strong>Cargo:</strong> {lead.jobTitle}
        </p>
        <p>
          <strong>Fuente:</strong> {lead.source}
        </p>
        <p>
          <strong>Asignado a:</strong> {lead.asignadoA}
        </p>
        <p>
          <strong>Correo:</strong> {lead.email}
        </p>
        <p>
          <strong>Teléfono:</strong> {lead.telefono}
        </p>
        <p>
          <strong>Emails Recibidos:</strong> {lead.emailsRecibidos}
        </p>
        <p>
          <strong>Llamadas Realizadas:</strong> {lead.llamadasRealizadas}
        </p>
      </div>
    </div>
  );
}
