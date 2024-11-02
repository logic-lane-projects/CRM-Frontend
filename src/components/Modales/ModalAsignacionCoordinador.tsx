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
import { getUsers, getUserById } from "../../services/users";
// import { assignSeller } from "../../services/users";
import { useAuthToken } from "../../hooks/useAuthToken";
import type { User } from "../../services/users";
import { Toast } from "../Toast/toast";

interface ModalAsignacionVendedorProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  assignedTo: string | null;
}

export default function ModalAsignacionCoordinador({
  isOpen,
  setIsOpen,
  assignedTo,
}: ModalAsignacionVendedorProps) {
  const { userInfo } = useAuthToken();
  const [searchTerm, setSearchTerm] = useState("");
  const [sellers, setSellers] = useState<User[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<User[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [assignedSellerInfo, setAssignedSellerInfo] = useState<User | null>(
    null
  );
  const [isChangingSeller, setIsChangingSeller] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAssignedSeller = async () => {
      if (assignedTo) {
        try {
          const seller = await getUserById(assignedTo);
          setAssignedSellerInfo(seller);
        } catch (error) {
          console.error("Error fetching assigned seller info:", error);
        }
      } else {
        setAssignedSellerInfo(null);
      }
    };

    fetchAssignedSeller();
  }, [assignedTo]);

  useEffect(() => {
    if (!assignedTo || isChangingSeller) {
      const fetchUsers = async () => {
        try {
          const users = await getUsers();
          setSellers(users);
        } catch (error) {
          console.error("Error fetching sellers:", error);
        }
      };
      fetchUsers();
    }
  }, [assignedTo, isChangingSeller]);

  useEffect(() => {
    setFilteredSellers(
      sellers.filter((seller) =>
        seller.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, sellers]);

  const handleAssign = async () => {
    if (!selectedSellerId) {
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
      //   await assignSeller(userInfo.id, selectedSellerId, assignedTo);
      Toast.fire({
        icon: "success",
        title: "Coordinador asignado exitosamente.",
      });
      setIsOpen(false);
      setIsChangingSeller(false);
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
            setIsChangingSeller(false);
          }}
          title={
            assignedTo && !isChangingSeller
              ? "Coordinador asignado"
              : "Asignar Coordinador"
          }
          primaryAction={{
            content: isLoading ? "Cargando..." : "Asignar",
            onAction:
              assignedTo && !isChangingSeller
                ? () => setIsOpen(false)
                : handleAssign,
            disabled: isLoading,
          }}
          secondaryActions={[
            {
              content: "Cancelar",
              onAction: () => {
                setIsOpen(false);
                setIsChangingSeller(false);
              },
              disabled: isLoading,
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              {assignedSellerInfo && !isChangingSeller ? (
                <>
                  <p className="mb-2">Coordinador Asignado:</p>
                  <p>
                    <strong>Nombre:</strong> {assignedSellerInfo.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {assignedSellerInfo.email}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {assignedSellerInfo.cellphone}
                  </p>
                  <Button
                    onClick={() => setIsChangingSeller(true)}
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
                      resourceName={{ singular: "seller", plural: "sellers" }}
                      items={filteredSellers}
                      renderItem={(seller) => {
                        const { id, name } = seller;
                        return (
                          <ResourceItem
                            id={id || ""}
                            onClick={() => setSelectedSellerId(id || null)}
                          >
                            <p
                              style={{
                                fontWeight:
                                  selectedSellerId === id ? "bold" : "normal",
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
