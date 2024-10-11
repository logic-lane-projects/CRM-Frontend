import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Card, Icon } from "@shopify/polaris";
import {
  NotificationIcon,
  EmailIcon,
  PhoneIcon,
  ListBulletedFilledIcon,
  NoteIcon,
} from "@shopify/polaris-icons";
import Actividad from "./Actividad";
import Correos from "./Correos";
import Llamadas from "./Llamadas";
import Tareas from "./Tareas";
import Notas from "./Notas";
import InfoLead from "./LeadInfo";
import Whatsapp from "./Whatsapp";

const mockLeadData = {
  id: "1",
  nombre: "Juan",
  apellidoPaterno: "Pérez",
  apellidoMaterno: "González",
  organizacion: "Tech Solutions",
  website: "www.techsolutions.com",
  industria: "Tecnología",
  jobTitle: "Ingeniero de Software",
  source: "Facebook",
  asignadoA: "Carlos García",
  referirseComo: {
    nombre: "Juan",
    apellidoPaterno: "Pérez",
    apellidoMaterno: "González",
  },
  email: "juan.perez@email.com",
  telefono: "555-123-4567",
  emailsRecibidos: 5,
  llamadasRealizadas: 3,
};

export default function LeadInfo() {
  const { id } = useParams();
  const [leadData, setLeadData] = useState<any>(true); //Regresar a false cuando se tengan enpoints
  const [selectedTab, setSelectedTab] = useState<string>("Actividad");

  useEffect(() => {
    if (id === "1") {
      setLeadData(mockLeadData);
    }
  }, [id]);

  if (!leadData) {
    return <div>Cargando datos del lead...</div>;
  }

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <Card>
      {/* Topbar */}
      <div className="flex justify-between items-center bg-white w-full px-2 py-3">
        <div>
          <span className="font-semibold text-lg">Leads/</span>
          <span className="ml-1 text-[15px]">
            {`${mockLeadData?.nombre} ${mockLeadData?.apellidoPaterno}`}
          </span>
        </div>
        <Button variant="primary">Hacer trato</Button>
      </div>

      <div className="grid grid-cols-3">
        <div className="flex flex-col gap-3 col-span-2">
          <div className="flex gap-4 bg-white border-gray-300 border-[1px] p-2">
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTab === "Actividad"
                  ? "border-b-2 border-b-black"
                  : "hover:border-b-2 hover:border-b-black"
              }`}
              onClick={() => handleTabClick("Actividad")}
            >
              <div className="flex gap-1">
                <Icon source={NotificationIcon} />
                <span>Actividad</span>
              </div>
            </div>
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTab === "Correos"
                  ? "border-b-2 border-b-black"
                  : "hover:border-b-2 hover:border-b-black"
              }`}
              onClick={() => handleTabClick("Correos")}
            >
              <div className="flex gap-1">
                <Icon source={EmailIcon} />
                <span>Correos</span>
              </div>{" "}
            </div>
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTab === "Llamadas"
                  ? "border-b-2 border-b-black"
                  : "hover:border-b-2 hover:border-b-black"
              }`}
              onClick={() => handleTabClick("Llamadas")}
            >
              <div className="flex gap-1">
                <Icon source={PhoneIcon} />
                <span>Llamadas</span>
              </div>{" "}
            </div>
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTab === "Whatsapp"
                  ? "border-b-2 border-b-black"
                  : "hover:border-b-2 hover:border-b-black"
              }`}
              onClick={() => handleTabClick("Whatsapp")}
            >
              <div className="flex gap-1 items-center">
                <img className="w-3 h-3" src="../../../public/images/whatsapp.png"/>
                <span>Whatsapp</span>
              </div>{" "}
            </div>
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTab === "Tareas"
                  ? "border-b-2 border-b-black"
                  : "hover:border-b-2 hover:border-b-black"
              }`}
              onClick={() => handleTabClick("Tareas")}
            >
              <div className="flex gap-1">
                <Icon source={ListBulletedFilledIcon} />
                <span>Tareas</span>
              </div>{" "}
            </div>
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTab === "Notas"
                  ? "border-b-2 border-b-black"
                  : "hover:border-b-2 hover:border-b-black"
              }`}
              onClick={() => handleTabClick("Notas")}
            >
              <div className="flex gap-1">
                <Icon source={NoteIcon} />
                <span>Notas</span>
              </div>{" "}
            </div>
          </div>
          <div className="border-[1px] border-gray-300 p-2">
            {selectedTab === "Actividad" && <Actividad />}
            {selectedTab === "Correos" && <Correos />}
            {selectedTab === "Llamadas" && <Llamadas />}
            {selectedTab === "Tareas" && <Tareas />}
            {selectedTab === "Notas" && <Notas />}
            {selectedTab === "Whatsapp" && <Whatsapp />}
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full col-span-1">
          <div className="flex gap-10 bg-white border-gray-300 border-[1px] p-2 pt-2.5">
            <span className="font-semibold flex  justify-center w-full">
              Acerca de este Lead
            </span>
          </div>
          <div className="border-[1px]  border-gray-300 p-2">
            <InfoLead lead={mockLeadData} />
          </div>
        </div>
      </div>
    </Card>
  );
}
