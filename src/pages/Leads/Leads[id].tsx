import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@shopify/polaris";

// Simula la respuesta de la API para el lead con ID 1
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
  const [leadData, setLeadData] = useState<any>(null);

  useEffect(() => {
    // Simulación de obtención de datos basados en el ID
    if (id === "1") {
      setLeadData(mockLeadData);
    }
    // Aquí podrías hacer una llamada a la API si no estás simulando datos
  }, [id]);

  if (!leadData) {
    return <div>Cargando datos del lead...</div>;
  }

  return (
    <div>
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
      <div className="flex gap-10 bg-white border-t-gray-500 border-[1px]">
        <div className="hover:hidden cursor-pointer">
          <div>Actividad</div>
        </div>
        <div>
          <div>Correos</div>
        </div>
        <div>
          <div>Llamadas</div>
        </div>
        <div>
          <div>Tareas</div>
        </div>
        <div>
          <div>Notas</div>
        </div>
      </div>
    </div>
  );
}
