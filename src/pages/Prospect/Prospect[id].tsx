import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Card, Icon, Spinner } from "@shopify/polaris";
import {
  NotificationIcon,
  EmailIcon,
  PhoneIcon,
  ListBulletedFilledIcon,
  NoteIcon,
  FileIcon,
} from "@shopify/polaris-icons";
import {
  getPreClientById,
  changeProspectToClient,
  PreClient,
} from "./../../services/preClient";
import Actividad from "../Leads/Actividad";
import Correos from "../Leads/Correos";
import Llamadas from "../Leads/Llamadas";
import Tareas from "../Leads/Tareas";
import Notas from "../Leads/Notas";
import InfoLead from "../Leads/LeadInfo";
import Whatsapp from "../Leads/Whatsapp";
import Archivos from "../Leads/Archivos";
import { Toast } from "../../components/Toast/toast";
import { useNavigate } from "react-router-dom";

export default function ProspectInfo() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [leadData, setLeadData] = useState<PreClient | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("Actividad");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingChange, setIsLoadingChange] = useState(false);

  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        if (id) {
          const response = await getPreClientById(id);
          setLeadData(response.data);
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

    fetchLeadData();
  }, [id]);

  if (loading) {
    return <div>Cargando datos del lead...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!leadData) {
    return <div>No se encontró el lead</div>;
  }

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const handlePreClient = async () => {
    setIsLoadingChange(true);
    try {
      await changeProspectToClient(id);
      Toast.fire({ icon: "success", title: "Prospecto pasado a Cliente" });
      navigate("/leads");
    } catch (error) {
      const errorMessage = typeof error === "string" ? error : String(error);
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    } finally {
      setIsLoadingChange(false);
    }
  };
  return (
    <Card>
      {/* Topbar */}
      <div className="flex justify-between items-center bg-white w-full px-2 py-3">
        <div>
          <span className="font-semibold text-lg">Prospecto/</span>
          <span className="ml-1 text-[15px]">
            {`${leadData?.names} ${leadData?.maternal_surname} ${leadData?.paternal_surname}`}
          </span>
        </div>
        {isLoadingChange ? (
          <div>
            <Spinner size="small" />
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              leadData?.files_legal?.length == 0
                ? Toast.fire({
                    icon: "error",
                    title:
                      "Se debe de confirmar el primer deposito del cliente",
                  })
                : handlePreClient();
            }}
          >
            Pasar a Comprador
          </Button>
        )}
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
              </div>
            </div>
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTab === "Llamadas"
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
                selectedTab === "Whatsapp"
                  ? "border-b-2 border-b-black"
                  : "hover:border-b-2 hover-border-b-black"
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
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTab === "Tareas"
                  ? "border-b-2 border-b-black"
                  : "hover-border-b-2 hover-border-b-black"
              }`}
              onClick={() => handleTabClick("Tareas")}
            >
              <div className="flex gap-1">
                <Icon source={ListBulletedFilledIcon} />
                <span>Tareas</span>
              </div>
            </div>
            <div
              className={`cursor-pointer overflow-hidden ${
                selectedTab === "Notas"
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
                selectedTab === "Notas"
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
          </div>
          <div className="border-[1px] border-gray-300 p-2">
            {selectedTab === "Actividad" && <Actividad />}
            {selectedTab === "Correos" && <Correos />}
            {selectedTab === "Llamadas" && <Llamadas />}
            {selectedTab === "Tareas" && <Tareas />}
            {selectedTab === "Notas" && <Notas />}
            {selectedTab === "Whatsapp" && <Whatsapp />}
            {selectedTab === "Archivos" && <Archivos id={id} />}
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full col-span-1">
          <div className="flex gap-10 bg-white border-gray-300 border-[1px] p-2 pt-2.5">
            <span className="font-semibold flex justify-center w-full">
              Acerca de este Lead
            </span>
          </div>
          <div className="border-[1px] border-gray-300 p-2">
            <InfoLead
              lead={{
                ...leadData,
                status: leadData?.status ?? null,
                created_at: leadData?.created_at ?? "",
                updated_at: leadData?.updated_at ?? "",
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
