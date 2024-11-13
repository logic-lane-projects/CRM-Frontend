import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, Icon } from "@shopify/polaris";
import {
  NotificationIcon,
  // EmailIcon,
  PhoneIcon,
  // ListBulletedFilledIcon,
  NoteIcon,
  FileIcon,
  ClockIcon,
} from "@shopify/polaris-icons";
import { Client, getClientById } from "../../services/clientes";
import Actividad from "../Leads/Actividad";
import Correos from "../Leads/Correos";
import Llamadas from "../Leads/Llamadas";
import Tareas from "../Leads/Tareas";
import Notas from "../Leads/Notas";
import InfoLead from "../Leads/LeadInfo";
import Whatsapp from "../Leads/Whatsapp";
import { Toast } from "../../components/Toast/toast";
import Archivos from "../Leads/Archivos";
import Historial from "../Leads/Historial";

export default function LeadInfo() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [clientData, setClientData] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const selectedTabFromUrl = searchParams.get("selected") || "Actividad";

  const handleTabClick = (selected: string) => {
    setSearchParams({ selected });
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const response = await getClientById(id);
          if (response.result && response.data) {
            setClientData(response.data);
          } else {
            setError("No se encontró el cliente");
          }
        }
      } catch (error) {
        const errorMessage = typeof error === "string" ? error : String(error);
        setError(errorMessage);
        Toast.fire({
          icon: "error",
          title: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  if (loading) {
    return <div>Cargando datos del lead...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!clientData) {
    return <div>No se encontró el lead</div>;
  }

  return (
    <Card>
      {/* Topbar */}
      <div className="flex justify-between items-center bg-white w-full px-2 py-3">
        <div>
          <span className="font-semibold text-lg">Cliente/</span>
          <span className="ml-1 text-[15px]">
            {`${clientData?.names} ${clientData?.maternal_surname} ${clientData?.paternal_surname}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div className="flex flex-col gap-3 col-span-2">
          <div className="flex gap-4 bg-white border-gray-300 border-[1px] p-2">
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTabFromUrl === "Actividad"
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
            {/* <div
              className={`cursor-pointer overflow-hidden ${
                selectedTabFromUrl === "Correos"
                  ? "border-b-2 border-b-black"
                  : "hover:border-b-2 hover:border-b-black"
              }`}
              onClick={() => handleTabClick("Correos")}
            >
              <div className="flex gap-1">
                <Icon source={EmailIcon} />
                <span>Correos</span>
              </div>
            </div> */}
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTabFromUrl === "Llamadas"
                  ? "border-b-2 border-b-black"
                  : "hover:border-b-2 hover-border-b-black"
              }`}
              onClick={() => handleTabClick("Llamadas")}
            >
              <div className="flex gap-1">
                <Icon source={PhoneIcon} />
                <span>Llamadas</span>
              </div>
            </div>
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTabFromUrl === "Whatsapp"
                  ? "border-b-2 border-b-black"
                  : "hover-border-b-2 hover-border-b-black"
              }`}
              onClick={() => handleTabClick("Whatsapp")}
            >
              <div className="flex gap-1 items-center">
                <img
                  className="w-3 h-3"
                  src="/images/whatsapp.png"
                  alt="Whatsapp"
                />
                <span>Whatsapp</span>
              </div>
            </div>
            {/* <div
              className={`cursor-pointer overflow-hidden ${
                selectedTabFromUrl === "Tareas"
                  ? "border-b-2 border-b-black"
                  : "hover-border-b-2 hover-border-b-black"
              }`}
              onClick={() => handleTabClick("Tareas")}
            >
              <div className="flex gap-1">
                <Icon source={ListBulletedFilledIcon} />
                <span>Tareas</span>
              </div>
            </div> */}
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTabFromUrl === "Notas"
                  ? "border-b-2 border-b-black"
                  : "hover-border-b-2 hover-border-b-black"
              }`}
              onClick={() => handleTabClick("Notas")}
            >
              <div className="flex gap-1">
                <Icon source={NoteIcon} />
                <span>Notas</span>
              </div>
            </div>
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTabFromUrl === "Archivos"
                  ? "border-b-2 border-b-black"
                  : "hover-border-b-2 hover-border-b-black"
              }`}
              onClick={() => handleTabClick("Archivos")}
            >
              <div className="flex gap-1">
                <Icon source={FileIcon} />
                <span>Archivos</span>
              </div>
            </div>
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTabFromUrl === "Historial"
                  ? "border-b-2 border-b-black"
                  : "hover-border-b-2 hover-border-b-black"
              }`}
              onClick={() => handleTabClick("Historial")}
            >
              <div className="flex gap-1">
                <Icon source={ClockIcon} />
                <span>Historial</span>
              </div>
            </div>
          </div>
          <div className="border-[1px] border-gray-300 p-2">
            {selectedTabFromUrl === "Actividad" && <Actividad />}
            {selectedTabFromUrl === "Correos" && <Correos />}
            {selectedTabFromUrl === "Llamadas" && <Llamadas />}
            {selectedTabFromUrl === "Tareas" && <Tareas />}
            {selectedTabFromUrl === "Notas" && <Notas />}
            {selectedTabFromUrl === "Whatsapp" && <Whatsapp phone={clientData.phone_number} />}
            {selectedTabFromUrl === "Archivos" && <Archivos id={id} regimen={clientData.type_person}/>}
            {selectedTabFromUrl === "Historial" && <Historial />}
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full col-span-1">
          <div className="flex gap-10 bg-white border-gray-300 border-[1px] p-2 pt-2.5">
            <span className="font-semibold flex justify-center w-full">
              Acerca de este Cliente.
            </span>
          </div>
          <div className="border-[1px] border-gray-300 p-2">
            <InfoLead
              lead={{
                ...clientData,
                status: clientData?.status ?? null,
                created_at: clientData?.created_at ?? "",
                updated_at: clientData?.updated_at ?? "",
                is_client: clientData?.is_client ?? undefined,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
