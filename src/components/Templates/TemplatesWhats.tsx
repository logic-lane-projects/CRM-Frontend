import { useState } from "react";
import { Toast } from "../Toast/toast";
import { sendTemplate } from "../../services/template";
import { useAuthToken } from "../../hooks/useAuthToken";
import { Lead } from "../../services/leads";
import ModalTemplates from "./ModalTemplates";

export default function TemplatesWhats({
  clientNumber,
  refetch,
  clientInfo
}: {
  clientNumber: string;
  refetch: () => void;
  clientInfo: Lead
}) {
  const { userInfo } = useAuthToken();
  const [loading, setLoading] = useState<string | null>(null);
  const nombre = userInfo?.name ?? "";
  const paterno = userInfo?.paternal_surname ?? "";
  const nombreOficina = localStorage.getItem("oficinaActualNombre");
  const [isOpen, setIsOpen] = useState(false);
  const [templateNumber, setTemplateNumber] = useState<number | null>(null);
  const roleUser = userInfo?.role;
  const city = localStorage.getItem("ciudadOficinaActual");
  const state = localStorage.getItem("estadoOficinaActual");
  const handleSend = async (template_number: number) => {
    try {
      setLoading(`btn-${template_number}`);
      await sendTemplate({
        to: clientNumber,
        client_name: clientInfo?.names + " " + clientInfo?.maternal_surname + " " + clientInfo?.paternal_surname,
        seller_name: `${nombre} ${paterno}`,
        seller_position: roleUser ?? "",
        of_name: nombreOficina ?? "",
        city: city ?? "",
        state: state ?? "",
        project_name: "",
        template_number: template_number.toString(),
        img_name: ""
      });
      Toast.fire({ icon: "success", title: "Template enviado exitosamente" });
      setTimeout(() => {
        refetch();
      }, 1500);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
        timer: 5000,
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col w-full mt-2 gap-4">

      <div className="flex justify-between">
        {/* Contacto 1 */}
        <button
          // onClick={() => handleSend(1)}
          onClick={() => { setIsOpen(true); setTemplateNumber(1) }}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${loading === "btn-1" && "opacity-50 cursor-not-allowed"
            }`}
          disabled={loading === "btn-1"}
        >
          {loading === "btn-1" ? "Enviando..." : "Contacto 1"}
        </button>

        {/* Contacto 2 */}
        <button
          // onClick={() => handleSend(2)}
          onClick={() => { setIsOpen(true); setTemplateNumber(2) }}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${loading === "btn-2" && "opacity-50 cursor-not-allowed"
            }`}
          disabled={loading === "btn-2"}
        >
          {loading === "btn-2" ? "Enviando..." : "Contacto 2"}
        </button>

        {/* Contacto 3 */}
        <button
          // onClick={() => handleSend(3)}
          onClick={() => { setIsOpen(true); setTemplateNumber(3) }}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${loading === "btn-3" && "opacity-50 cursor-not-allowed"
            }`}
          disabled={loading === "btn-3"}
        >
          {loading === "btn-3" ? "Enviando..." : "Contacto 3"}
        </button>

        {/* Contacto 4 */}
        <button
          onClick={() => { setIsOpen(true); setTemplateNumber(4) }}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${loading === "btn-4" && "opacity-50 cursor-not-allowed"
            }`}
          disabled={loading === "btn-4"}
        >
          {loading === "btn-4" ? "Enviando..." : "Contacto 4"}
        </button>

        {/* Contacto 5 */}
        {/* <button
          onClick={() => { setIsOpen(true); setTemplateNumber(5) }}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${loading === "btn-5" && "opacity-50 cursor-not-allowed"
            }`}
          disabled={loading === "btn-5"}
        >
          {loading === "btn-5" ? "Enviando..." : "Contacto 5"}
        </button> */}
      </div>

      <div className="flex items-center justify-center">
        <button
          onClick={() => handleSend(4)}
          className={`bg-green-500 text-white px-4 py-2 rounded ${loading === "btn-4" && "opacity-50 cursor-not-allowed"
            }`}
          disabled={loading === "btn-4"}
        >
          {loading === "btn-4" ? "Enviando..." : "Seguir conversacion"}
        </button>
      </div>

      {isOpen && (
        <ModalTemplates
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          templateNumber={templateNumber ?? 1}
          clientNumber={clientNumber}
          clientInfo={clientInfo}
        />
      )}
    </div>
  );
}
