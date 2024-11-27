import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  // Button, 
  Banner,
  Card, 
  Spinner, 
  Page, 
  Badge, 
  Icon,
} from "@shopify/polaris";
import {
  NotificationIcon,
  // EmailIcon,
  PhoneIcon,
  // ListBulletedFilledIcon,
  NoteIcon,
  FileIcon,
  ClockIcon,
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
import Historial from "../Leads/Historial";
import { Toast } from "../../components/Toast/toast";
import { useNavigate } from "react-router-dom";
import { getHistorialCallsByNumber } from "../../services/historial";
import type { CallsHistorial } from "../../services/historial";

export default function ProspectInfo() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [leadData, setLeadData] = useState<PreClient | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("Actividad");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingChange, setIsLoadingChange] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const [finishLoading, setFinishLoading] = useState(false);
  const [historialCalls, setHistorialCalls] = useState<CallsHistorial | null>(null);

  const fetchHistorial = async (number: string|number) => {
    try{
      if(number){
        const response = await getHistorialCallsByNumber(number);
        setHistorialCalls(response);
      }
    } catch(error){
      const errorMessage = typeof error === "string" ? error : String(error);
      setError(errorMessage);
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
          const response = await getPreClientById(id);
          setLeadData(response.data);
          if (response.data && response.data.files_legal) {
            const hasPrimerPago = response.data.files_legal.some((el: string) =>
              el.includes("archivo_pago")
            );
            setIsPayment(hasPrimerPago);
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
    if (!isPayment) {
      Toast.fire({
        icon: "error",
        title: "Primero se debe de confirmar el primer pago del cliente",
        timer: 5000,
      });
      setSelectedTab("Archivos");
      return;
    }

    setIsLoadingChange(true);

    try {
      await changeProspectToClient(id);
      navigate("/leads?selected=comprador");
      Toast.fire({ icon: "success", title: "Prospecto pasado a Cliente" });
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
      title={`${leadData?.names} ${leadData?.paternal_surname} ${leadData?.maternal_surname}`}
      titleMetadata={<Badge>Prospecto</Badge>}
      primaryAction={{ 
        content: "Pasar a Comprador",
        onAction: () => {
          handlePreClient();
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
        {finishLoading && (
          <Banner 
            title="Actualización de archivos"
            tone="info"
            onDismiss={() => setFinishLoading(false)}
          />
        )}
        <div className="w-full col-span-2">
          <Card padding={'0'}>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex gap-4 items-center pt-3 px-3">
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
                    selectedTab === "Archivos"
                      ? "border-b-2 border-b-black"
                      : "hover-border-b-2 hover-border-b-black"
                  }`}
                  onClick={() => handleTabClick("Archivos")}
                >
                  <div className="flex gap-1">
                    <Icon source={FileIcon} />
                    <span>Archivo Pago</span>
                  </div>
                </div>
                <div
                  className={`cursor-pointer overflow-hidden ${
                    selectedTab === "Historial"
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
              <div className="w-full">
                {selectedTab === "Actividad" && <Actividad historial={historialCalls}/>}
                {selectedTab === "Correos" && <Correos />}
                {selectedTab === "Llamadas" && <Llamadas phone={leadData.phone_number} />}
                {selectedTab === "Tareas" && <Tareas />}
                {selectedTab === "Notas" && (
                  <Notas idCliente={leadData._id ?? ""} />
                )}{" "}
                {selectedTab === "Whatsapp" && (
                  <Whatsapp phone={leadData.phone_number} />
                )}
                {selectedTab === "Archivos" && (
                  <Archivos
                    id={id}
                    isPayment={isPayment}
                    setFinishLoading={setFinishLoading}
                    regimen={""}
                  />
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
