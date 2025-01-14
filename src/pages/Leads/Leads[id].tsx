import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Card, Spinner, Page, Badge } from "@shopify/polaris";
import {
  // EmailIcon,
  PhoneIcon,
  // ListBulletedFilledIcon,
  NoteIcon,
  ClockIcon,
} from "@shopify/polaris-icons";
import { getLeadById, changeLeadToProspect } from "../../services/leads";
import { getHistorialCallsByNumber, getHistorialById } from "../../services/historial";
import Actividad from "./Actividad";
import Correos from "./Correos";
import Llamadas from "./Llamadas";
import Tareas from "./Tareas";
import Notas from "./Notas";
import InfoLead from "./LeadInfo";
import Whatsapp from "./Whatsapp";
import Historial from "./Historial";
import { Toast } from "../../components/Toast/toast";
import type { Lead } from "../../services/leads";
import type { CallsHistorial } from "../../services/historial";
import { useNavigate } from "react-router-dom";
import { useAuthToken } from "../../hooks/useAuthToken";

export default function LeadInfo() {
  const { userInfo } = useAuthToken();
  const navigate = useNavigate();
  const officeNumber = localStorage.getItem("telefonoOficinaActual") ?? "";
  const { id } = useParams<{ id: string }>();
  const [leadData, setLeadData] = useState<Lead | null>(null);
  const [historialCalls, setHistorialCalls] = useState<CallsHistorial | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("Llamadas");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingChange, setIsLoadingChange] = useState(false);

  const fetchHistorial = async (number: string|number) => {
    try{
      if(number){
        const response = await getHistorialCallsByNumber(number,officeNumber);
        setHistorialCalls(response);
      }
    } catch(error){
      const errorMessage = typeof error === "string" ? error : String(error);
      // setError(errorMessage);
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    }
  }

  useEffect(() => {
    if(leadData && leadData.phone_number){
      fetchHistorial(leadData.phone_number);
    }
  }, [leadData]);

  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        if (id) {
          const response = await getLeadById(id);
          setLeadData(response);
          const respuesta = await getHistorialById(id);
          console.log(respuesta)
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
      if (userInfo && userInfo.id) {
        await changeLeadToProspect(id, userInfo.id);
        Toast.fire({ icon: "success", title: "Lead pasado a prospecto" });
        navigate("/leads?selected=prospecto");
      } else {
        throw new Error("Información del usuario no disponible");
      }
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
    <Page
      backAction={{content: 'Regresar', onAction: () => navigate(-1)}}
      title={`${leadData?.names} ${leadData?.paternal_surname} ${leadData?.maternal_surname} #${leadData?.folio || "Sin folio"}`}
      titleMetadata={<Badge>Leads</Badge>}
      primaryAction={{ 
        content: "Pasar a Prospecto",
        onAction: () => {
          if (leadData?.assigned_to) {
            handlePreClient();
          } else {
            Toast.fire({
              icon: "error",
              title:
                "El Lead no tiene un asesor asignado, por favor asignale uno",
              timer: 3000,
            });
          }
        }
      }}
    >
      {/* Topbar */}
      {isLoadingChange && (
        <div className="w-full">
          <Spinner size="small" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="w-full col-span-2">
          <Card padding={'0'}>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex gap-4 items-center pt-3 px-3">
                {/* <Button 
                  variant="tertiary"
                  icon={NotificationIcon}
                  onClick={() => handleTabClick("Actividad")}
                  pressed={selectedTab === "Actividad"}
                >
                  Actividad
                </Button> */}
                {/* <div
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
                </div> */}
                <Button 
                  variant="tertiary"
                  icon={PhoneIcon}
                  onClick={() => handleTabClick("Llamadas")}
                  pressed={selectedTab === "Llamadas"}
                >
                  Llamadas
                </Button>
                <Button 
                  variant="tertiary"
                  icon={<img
                    className="w-4 h-4"
                    src="/images/whatsapp.png"
                    alt="Whatsapp"
                  />}
                  onClick={() => handleTabClick("Whatsapp")}
                  pressed={selectedTab === "Whatsapp"}
                >
                  Whatsapp
                </Button>
                {/* <div
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
                </div> */}
                <Button 
                  variant="tertiary"
                  icon={NoteIcon}
                  onClick={() => handleTabClick("Notas")}
                  pressed={selectedTab === "Notas"}
                >
                  Notas
                </Button>
                <Button 
                  variant="tertiary"
                  icon={ClockIcon}
                  onClick={() => handleTabClick("Historial")}
                  pressed={selectedTab === "Historial"}
                >
                  Historial
                </Button>
              </div>
              <div className="w-full">
                {selectedTab === "Actividad" && <Actividad historial={historialCalls}/>}
                {selectedTab === "Correos" && <Correos />}
                {selectedTab === "Llamadas" && <Llamadas phone={leadData.phone_number} historial={historialCalls} idLead={leadData?._id}/>}
                {selectedTab === "Tareas" && <Tareas />}
                {selectedTab === "Notas" && (
                  <Notas idCliente={leadData._id ?? ""} />
                )}
                {selectedTab === "Whatsapp" && (
                  <Whatsapp phone={leadData.phone_number} leadData={leadData}/>
                )}
                {selectedTab === "Historial" && <Historial />}
              </div>
            </div>
          </Card>
        </div>
        <div className="w-full col-span-1">
          <Card padding={'200'}>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex gap-10">
                <span className="font-semibold flex justify-center w-full">
                  Acerca de este Lead
                </span>
              </div>
              <div className="">
                <InfoLead
                  lead={{
                    ...leadData,
                    status: leadData?.status ?? null,
                    created_at: leadData?.created_at ?? "",
                    updated_at: leadData?.updated_at ?? "",
                    is_client: leadData?.is_client ?? undefined,
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
