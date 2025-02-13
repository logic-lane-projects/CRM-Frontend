import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Card, Icon, Spinner } from "@shopify/polaris";
import {
  // NotificationIcon,
  // EmailIcon,
  PhoneIcon,
  // ListBulletedFilledIcon,
  NoteIcon,
  FileIcon,
  ClockIcon,
} from "@shopify/polaris-icons";
import { getBuyerById, changeProspectToClient } from "../../services/buyer";
import { getHistorialCallsByNumber } from "../../services/historial";
// import Actividad from "../Leads/Actividad";
import Correos from "../Leads/Correos";
import Llamadas from "../Leads/Llamadas";
import Tareas from "../Leads/Tareas";
import Notas from "../Leads/Notas";
import InfoLead from "../Leads/LeadInfo";
import Whatsapp from "../Leads/Whatsapp";
import Archivos from "../Leads/Archivos";
import Historial from "../Leads/Historial";
import { Toast } from "../../components/Toast/toast";
import type { All as Buyer } from "../../services/buyer";
import type { CallsHistorial } from "../../services/historial";
import { useAuthToken } from "../../hooks/useAuthToken";

export default function BuyerInfo() {
  const { userInfo } = useAuthToken();
  const officeNumber = localStorage.getItem("telefonoOficinaActual") ?? "";
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [leadData, setLeadData] = useState<Buyer | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("Whatsapp");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingChange, setIsLoadingChange] = useState(false);
  const [finishLoading, setFinishLoading] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const [historialCalls, setHistorialCalls] = useState<CallsHistorial | null>(null);

  const fetchHistorial = async (number: string | number) => {
    try {
      if (number) {
        const response = await getHistorialCallsByNumber(number, officeNumber);
        setHistorialCalls(response);
      }
    } catch (error) {
      const errorMessage = typeof error === "string" ? error : String(error);
      setError(errorMessage);
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    }
  }

  useEffect(() => {
    if (leadData && leadData.phone_number) {
      fetchHistorial(leadData.phone_number);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadData]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get("selected") || "Actividad";
    setSelectedTab(tabFromUrl);
  }, [location.search]);

  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        if (id) {
          const response = await getBuyerById(id);
          if (response.data && response.data.files_legal_extra) {
            response.data.files_legal_extra.map((el: string) => {
              if (el.includes("archivo_pago")) {
                setIsPayment(true);
              } else {
                setIsPayment(false);
              }
            });
          }
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
  }, [id, finishLoading]);

  if (loading) {
    return <div>Cargando datos del comprador...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!leadData) {
    return <div>No se encontró el comprador</div>;
  }

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    navigate(`/comprador/${id}?selected=${tab}`);
  };

  const handleClient = async () => {
    setIsLoadingChange(true);
    try {
      if (userInfo && userInfo.id) {
        await changeProspectToClient(id, userInfo.id);
      } else {
        Toast.fire({ icon: "error", title: "User info no disponible" });
      }
      Toast.fire({ icon: "success", title: "Prospecto pasado a Cliente" });
      navigate("/leads?selected=client");
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
        <div className="flex items-center gap-1">
          <span className="font-semibold text-lg">Comprador/</span>
          <span className="ml-1 text-[15px]">
            {`${leadData?.names} ${leadData?.maternal_surname} ${leadData?.paternal_surname} #${leadData?.folio || "Sin folio"}`}
          </span>
          {leadData?.type_person === "" ||
            (leadData.type_person === null && (
              <div className="ml-4 bg-red-700 px-2">
                <span>
                  Este comprador aun no tiene registrado su regimen fiscal
                </span>
              </div>
            ))}
        </div>
        {isLoadingChange ? (
          <div>
            <Spinner size="small" />
          </div>
        ) : (
          <Button variant="primary" onClick={handleClient}>
            Pasar a Cliente
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3">
        <div className="flex flex-col gap-3 col-span-2">
          <div className="flex gap-4 bg-white border-gray-300 border-[1px] p-2">
            {/* <div
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
            </div> */}
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
              className={`cursor-pointer overflow-hidden ${selectedTab === "Llamadas"
                  ? "border-b-2 border-b-black"
                  : "hover-border-b-2 hover-border-b-black"
                }`}
              onClick={() => handleTabClick("Llamadas")}
            >
              <div className="flex gap-1">
                <Icon source={PhoneIcon} />
                <span>Llamadas</span>
              </div>
            </div>
            <div
              className={`cursor-pointer overflow-hidden ${selectedTab === "Whatsapp"
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
              className={`cursor-pointer overflow-hidden ${selectedTab === "Notas"
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
              className={`cursor-pointer overflow-hidden ${selectedTab === "Archivos"
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
              className={`cursor-pointer overflow-hidden ${selectedTab === "Historial"
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
            {/* {selectedTab === "Actividad" && <Actividad historial={historialCalls}/>} */}
            {selectedTab === "Correos" && <Correos />}
            {selectedTab === "Llamadas" && <Llamadas phone={leadData.phone_number} historial={historialCalls} idLead={leadData?._id} />}
            {selectedTab === "Tareas" && <Tareas />}
            {selectedTab === "Notas" && (
              <Notas idCliente={leadData._id ?? ""} />
            )}{" "}
            {selectedTab === "Whatsapp" && (
              <Whatsapp phone={leadData.phone_number} leadData={leadData} />
            )}{" "}
            {selectedTab === "Archivos" && (
              <Archivos
                id={id}
                setFinishLoading={setFinishLoading}
                isPayment={isPayment}
                regimen={leadData.type_person ?? ""}
              />
            )}
            {selectedTab === "Historial" && <Historial />}
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full col-span-1">
          <div className="flex gap-10 bg-white border-gray-300 border-[1px] p-2 pt-2.5">
            <span className="font-semibold flex justify-center w-full">
              Acerca de este Comprador
            </span>
          </div>
          <div className="border-[1px] border-gray-300 p-2">
            <InfoLead
              lead={{
                ...leadData,
                status: leadData?.status ?? null,
                created_at: leadData?.created_at ?? "",
                is_client: leadData?.is_client ?? undefined,
                updated_at: leadData?.updated_at ?? "",
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
