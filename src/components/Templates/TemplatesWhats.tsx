import { useState } from "react";
import { Toast } from "../Toast/toast";
import { sendTemplate } from "../../services/template";
import { useAuthToken } from "../../hooks/useAuthToken";

export default function TemplatesWhats({
  clientNumber,
  refetch,
}: {
  clientNumber: string;
  refetch: () => void;
}) {
  const { userInfo } = useAuthToken();
  console.log(userInfo?.paternal_surname);
  const [loading, setLoading] = useState<string | null>(null);
  const nombre = userInfo?.name ?? "";
  const paterno = userInfo?.paternal_surname ?? "";
  const nombreOficina = localStorage.getItem("oficinaActualNombre");
  const handleSend = async (template_number: number) => {
    try {
      setLoading(`btn-${template_number}`);
      await sendTemplate({
        to: clientNumber,
        of_name: nombreOficina ?? "",
        name_vendedor: `${nombre} ${paterno}`,
        template_number,
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
        <button
          onClick={() => handleSend(1)}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            loading === "btn-1" && "opacity-50 cursor-not-allowed"
          }`}
          disabled={loading === "btn-1"}
        >
          {loading === "btn-1" ? "Enviando..." : "Contacto 1"}
        </button>
        <button
          onClick={() => handleSend(2)}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            loading === "btn-2" && "opacity-50 cursor-not-allowed"
          }`}
          disabled={loading === "btn-2"}
        >
          {loading === "btn-2" ? "Enviando..." : "Contacto 2"}
        </button>
        <button
          onClick={() => handleSend(3)}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            loading === "btn-3" && "opacity-50 cursor-not-allowed"
          }`}
          disabled={loading === "btn-3"}
        >
          {loading === "btn-3" ? "Enviando..." : "Contacto 3"}
        </button>
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={() => handleSend(4)}
          className={`bg-green-500 text-white px-4 py-2 rounded ${
            loading === "btn-4" && "opacity-50 cursor-not-allowed"
          }`}
          disabled={loading === "btn-4"}
        >
          {loading === "btn-4" ? "Enviando..." : "Seguir conversacion"}
        </button>
      </div>
    </div>
  );
}
