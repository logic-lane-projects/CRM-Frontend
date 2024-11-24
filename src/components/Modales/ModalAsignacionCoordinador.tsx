import { useState, useEffect } from "react";
import {
  Frame,
  Modal,
  TextContainer,
  TextField,
  ResourceList,
  ResourceItem,
  Button,
} from "@shopify/polaris";
import {
  getAllCoordinators,
  findCoordinatorById,
  asignCordinatorToSeller,
} from "../../services/coordinadores";
import { useAuthToken } from "../../hooks/useAuthToken";
import type { Coordinator } from "./ModalRegistroCoordinadores";
import { Toast } from "../Toast/toast";

interface ModalAsignacionVendedorProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  assignedTo: string | null;
  userId: string | undefined;
  vendedorId: string;
}

export default function ModalAsignacionCoordinador({
  isOpen,
  setIsOpen,
  assignedTo,
  userId,
  vendedorId,
}: ModalAsignacionVendedorProps) {
  const { userInfo } = useAuthToken();
  const [searchTerm, setSearchTerm] = useState("");
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [filteredCoordinators, setFilteredCoordinators] = useState<
    Coordinator[]
  >([]);
  const [selectedCoordinatorId, setSelectedCoordinatorId] = useState<
    string | null
  >(null);
  const [assignedCoordinatorInfo, setAssignedCoordinatorInfo] =
    useState<Coordinator | null>(null);
  const [isChangingCoordinator, setIsChangingCoordinator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAssignedCoordinator = async () => {
      if (assignedTo) {
        try {
          const coordinator = await findCoordinatorById(assignedTo);
          setAssignedCoordinatorInfo(coordinator);
        } catch (error) {
          console.error("Error fetching assigned coordinator info:", error);
        }
      } else {
        setAssignedCoordinatorInfo(null);
      }
    };

    fetchAssignedCoordinator();
  }, [assignedTo]);

  useEffect(() => {
    if (!assignedTo || isChangingCoordinator) {
      const fetchCoordinators = async () => {
        try {
          const coordinators = await getAllCoordinators();
          setCoordinators(coordinators.data);
        } catch (error) {
          console.error("Error fetching coordinators:", error);
        }
      };
      fetchCoordinators();
    }
  }, [assignedTo, isChangingCoordinator]);

  useEffect(() => {
    setFilteredCoordinators(
      coordinators.filter((coordinator) =>
        coordinator.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, coordinators]);

  const handleAssign = async () => {
    if (!selectedCoordinatorId) {
      Toast.fire({
        icon: "warning",
        title: "Selecciona un coordinador antes de asignar.",
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
      title: "Asignando coordinador...",
    });

    try {
      if (userId) {
        await asignCordinatorToSeller(
          selectedCoordinatorId,
          [vendedorId],
          userId
        );
      }

      Toast.fire({
        icon: "success",
        title: "Coordinador asignado exitosamente.",
        timer: 2000,
      });
      setIsOpen(false);
      setIsChangingCoordinator(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error || "Error al asignar el coordinador.",
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
          onClose={() => {
            setIsOpen(false);
            setIsChangingCoordinator(false);
          }}
          title={
            assignedTo && !isChangingCoordinator
              ? "Coordinador asignado"
              : "Asignar Coordinador"
          }
          primaryAction={{
            content: isLoading ? "Cargando..." : "Asignar",
            onAction:
              assignedTo && !isChangingCoordinator
                ? () => setIsOpen(false)
                : handleAssign,
            disabled: isLoading,
          }}
          secondaryActions={[
            {
              content: "Cancelar",
              onAction: () => {
                setIsOpen(false);
                setIsChangingCoordinator(false);
              },
              disabled: isLoading,
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              {assignedCoordinatorInfo && !isChangingCoordinator ? (
                <>
                  <p className="mb-2">Coordinador Asignado:</p>
                  <p>
                    <strong>Nombre:</strong> {assignedCoordinatorInfo.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {assignedCoordinatorInfo.email}
                  </p>
                  <p>
                    <strong>Teléfono:</strong>{" "}
                    {assignedCoordinatorInfo.cellphone}
                  </p>
                  <Button
                    onClick={() => setIsChangingCoordinator(true)}
                    disabled={isLoading}
                  >
                    Cambiar Coordinador
                  </Button>
                </>
              ) : (
                <>
                  <p className="mb-2">Busca un Coordinador para asignarlo:</p>
                  <TextField
                    label=""
                    value={searchTerm}
                    onChange={(value) => setSearchTerm(value)}
                    placeholder="Escribe un nombre."
                    autoComplete="off"
                    disabled={isLoading}
                  />
                  {searchTerm && (
                    <ResourceList
                      resourceName={{
                        singular: "coordinator",
                        plural: "coordinators",
                      }}
                      items={filteredCoordinators}
                      renderItem={(coordinator) => {
                        const { _id, name } = coordinator;
                        return (
                          <ResourceItem
                            id={_id || ""}
                            onClick={() =>
                              setSelectedCoordinatorId(_id || null)
                            }
                          >
                            <p
                              style={{
                                fontWeight:
                                  selectedCoordinatorId === _id
                                    ? "bold"
                                    : "normal",
                              }}
                            >
                              {name}
                            </p>
                          </ResourceItem>
                        );
                      }}
                    />
                  )}
                </>
              )}
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
