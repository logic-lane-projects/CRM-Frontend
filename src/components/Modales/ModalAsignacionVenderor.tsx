import { useState, useEffect } from "react";
import {
  Frame,
  Modal,
  TextContainer,
  TextField,
  ResourceList,
  ResourceItem,
} from "@shopify/polaris";
import { getUsers } from "../../services/users";
import { assignSeller } from "../../services/users";
import { useAuthToken } from "../../hooks/useAuthToken";
import type { User } from "../../services/users";

interface ModalAsignacionVendedorProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  leadIds: string[];
}

export default function ModalAsignacionVendedor({
  isOpen,
  setIsOpen,
  leadIds,
}: ModalAsignacionVendedorProps) {
  const { userInfo } = useAuthToken();
  const [searchTerm, setSearchTerm] = useState("");
  const [sellers, setSellers] = useState<User[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<User[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  // Fetch sellers on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setSellers(users);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredSellers(
      sellers.filter((seller) =>
        seller.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, sellers]);

  const handleAssign = async () => {
    if (!selectedSellerId) {
      console.warn("Selecciona un vendedor antes de asignar.");
      return;
    }

    if (!userInfo) {
      console.warn("User info no está disponible.");
      return;
    }

    try {
      await assignSeller(userInfo.id, selectedSellerId, leadIds);
      console.log("Lead asignado exitosamente.");
      setIsOpen(false); // Cerrar el modal al asignar correctamente
    } catch (error) {
      console.error("Error al asignar el lead:", error);
    }
  };

  return (
    <div style={{ height: "500px" }}>
      <Frame>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Asignar un Vendedor"
          primaryAction={{
            content: "Asignar",
            onAction: handleAssign,
          }}
          secondaryActions={[
            {
              content: "Cancelar",
              onAction: () => setIsOpen(false),
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <p className="mb-2">Busca un vendedor para asignarlo:</p>
            </TextContainer>
            <TextField
              label=""
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              placeholder="Escribe un nombre."
              autoComplete="off"
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
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
