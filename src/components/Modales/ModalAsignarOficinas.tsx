import { useState, useEffect } from "react";
import {
  Frame,
  Modal,
  TextContainer,
  TextField,
  ResourceList,
  ResourceItem,
} from "@shopify/polaris";
import { getAllOffices } from "../../services/oficinas";
import { asignOffice } from "../../services/leads";
import { useAuthToken } from "../../hooks/useAuthToken";
import { Toast } from "../Toast/toast";

interface OfficeData {
  _id: string;
  nombre: string;
  ciudad: string;
  estado: string;
}

interface ModalAsignarOficinasProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  leadIds: string[];
}

export default function ModalAsignarOficinas({
  isOpen,
  setIsOpen,
  leadIds,
}: ModalAsignarOficinasProps) {
  const { userInfo } = useAuthToken();
  const [searchTerm, setSearchTerm] = useState("");
  const [offices, setOffices] = useState<OfficeData[]>([]);
  const [filteredOffices, setFilteredOffices] = useState<OfficeData[]>([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const { result, data, error } = await getAllOffices();
        if (result) {
          setOffices(data);
        } else {
          Toast.fire({
            icon: "error",
            title: error || "Error al cargar oficinas.",
          });
        }
      } catch (error) {
        console.error("Error fetching offices:", error);
        Toast.fire({ icon: "error", title: "Error al cargar oficinas." });
      }
    };
    fetchOffices();
  }, []);

  useEffect(() => {
    setFilteredOffices(
      offices.filter(
        (office) =>
          office.nombre &&
          office.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, offices]);

  const handleAssign = async () => {
    if (!selectedOfficeId) {
      Toast.fire({
        icon: "warning",
        title: "Selecciona una oficina antes de asignar.",
      });
      return;
    }

    if (!userInfo) {
      Toast.fire({
        icon: "warning",
        title: "User info no está disponible.",
      });
      return;
    }

    setIsLoading(true);
    Toast.fire({
      icon: "info",
      title: "Asignando oficina...",
    });

    try {
      await asignOffice(userInfo.id, selectedOfficeId, leadIds);
      Toast.fire({
        icon: "success",
        title: "Oficina asignada exitosamente.",
      });
      setIsOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error || "Error al asignar la oficina.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ height: "500px" }}>
      <Frame>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Asignar Oficina"
          primaryAction={{
            content: isLoading ? "Cargando..." : "Asignar",
            onAction: handleAssign,
            disabled: isLoading,
          }}
          secondaryActions={[
            {
              content: "Cancelar",
              onAction: () => setIsOpen(false),
              disabled: isLoading,
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <p className="mb-2">Busca una oficina para asignarla:</p>
              <TextField
                label=""
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                placeholder="Escribe una oficina."
                autoComplete="off"
                disabled={isLoading}
              />
              {searchTerm && (
                <ResourceList
                  resourceName={{ singular: "office", plural: "offices" }}
                  items={filteredOffices}
                  renderItem={(office) => {
                    const { _id, nombre, ciudad, estado } = office;
                    const isSelected = selectedOfficeId === _id;
                    return (
                      <ResourceItem
                        id={_id || ""}
                        onClick={() => setSelectedOfficeId(_id || null)}
                      >
                        <div
                          className={`p-2 cursor-pointer ${
                            isSelected
                              ? "bg-gray-200 border border-black"
                              : "bg-white"
                          }`}
                        >
                          <div
                            className={isSelected ? "font-bold" : "font-normal"}
                          >
                            <p>{nombre}</p>
                            <p>
                              {ciudad}, {estado}
                            </p>
                          </div>
                        </div>
                      </ResourceItem>
                    );
                  }}
                />
              )}
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
