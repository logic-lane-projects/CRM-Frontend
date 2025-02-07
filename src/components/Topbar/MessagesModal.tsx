import { Frame, Modal, Card, DataTable } from "@shopify/polaris";

interface Message {
    names: string;
    type_client: string;
    createdAt: string;
    folio: string;
}

export default function MessagesModal({
    isOpen,
    setIsOpen,
    messages,
}: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    messages: Message[];
}) {
    const rows = messages.map((message) => [
        <span className="flex items-center justify-start">{message.names}</span>,
        <span className="flex items-center justify-start">{message.type_client}</span>,
        <span className="flex items-center justify-start">{message.folio}</span>,
        new Date(message.createdAt).toLocaleString(),
    ]);

    return (
        <Frame>
            <Modal
                open={isOpen}
                onClose={() => setIsOpen(false)}
                title="Mensajes sin Leer"
                primaryAction={{
                    content: "Cerrar",
                    onAction: () => setIsOpen(false),
                }}
            >
                <Modal.Section>
                    {messages.length > 0 ? (
                        <Card>
                            <DataTable
                                columnContentTypes={["text", "text", "numeric"]}
                                headings={["Cliente", "Tipo", <span className="flex items-center justify-start">Folio</span>, "Fecha"]}
                                rows={rows}
                            />
                        </Card>
                    ) : (
                        <p style={{ textAlign: "center", padding: "20px", color: "#999" }}>No hay mensajes nuevos.</p>
                    )}
                </Modal.Section>
            </Modal>
        </Frame>
    );
}
