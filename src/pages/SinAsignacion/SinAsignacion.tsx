import { useState, useEffect } from "react";
import {
    IndexTable,
    useIndexResourceState,
    TextField,
    Pagination,
    Button,
    Card,
    Select,
} from "@shopify/polaris";
import { getAllLeadsNoSeller, Lead } from "../../services/leads";
import { Toast } from "../../components/Toast/toast";
import ModalAsignacionVendedor from "../../components/Modales/ModalAsignacionVenderor";
import { useAuthToken } from "../../hooks/useAuthToken";

export default function SinAsignacion() {
    const { userInfo } = useAuthToken();
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState("10");
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userInfo && userInfo?.city) {
            fetchLeads(userInfo.city);
        }
    }, [userInfo]);

    const fetchLeads = async (city: string) => {
        setLoading(true);
        try {
            const leadsData: Lead[] = await getAllLeadsNoSeller(city);
            setLeads(leadsData);
        } catch (error) {
            setError("Error al cargar los leads");
            const errorMessage = typeof error === "string" ? error : String(error);
            Toast.fire({
                icon: "error",
                title: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = Array.isArray(leads)
        ? leads.filter(
            (lead: Lead) =>
                lead.names.toLowerCase().includes(searchValue.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchValue.toLowerCase())
        )
        : [];

    const numItemsPerPage =
        itemsPerPage === "todos"
            ? filteredLeads.length
            : parseInt(itemsPerPage, 10);

    const paginatedLeads = filteredLeads.slice(
        (currentPage - 1) * numItemsPerPage,
        currentPage * numItemsPerPage
    );

    const totalPages = Math.ceil(filteredLeads.length / numItemsPerPage);

    const resourceLeads = filteredLeads.map((lead) => ({
        ...lead,
        id: lead._id ?? "unknown-id",
    }));

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(resourceLeads);

    const promotedBulkActions = [
        {
            content: "Ver Lead",
            onAction: () => console.log("Ver Lead"),
        },
        // {
        //     content: "Eliminar",
        //     onAction: () => console.log("Eliminar Lead"),
        // },
    ];

    const handlePagination = (direction: "previous" | "next") => {
        setCurrentPage((prevPage) => {
            if (direction === "next" && prevPage < totalPages) {
                return prevPage + 1;
            } else if (direction === "previous" && prevPage > 1) {
                return prevPage - 1;
            }
            return prevPage;
        });
    };

    const rowMarkup = paginatedLeads.map(
        ({ _id, names, email, phone_number, city }: Lead, index: number) => (
            <IndexTable.Row
                id={_id ?? "unknown-id"}
                key={_id ?? index}
                position={index}
                selected={selectedResources.includes(_id ?? "")}
            >
                <IndexTable.Cell>{names ?? "Nombre desconocido"}</IndexTable.Cell>
                <IndexTable.Cell>{email ?? "Correo desconocido"}</IndexTable.Cell>
                <IndexTable.Cell>{phone_number ?? "Teléfono desconocido"}</IndexTable.Cell>
                <IndexTable.Cell>{city ?? "Ciudad desconocida"}</IndexTable.Cell>
                <IndexTable.Cell>
                    <Button onClick={() => setIsOpen(true)}>Asignar Vendedor</Button>
                </IndexTable.Cell>
            </IndexTable.Row>
        )
    );

    if (loading) {
        return <p>Cargando Leads...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <span className="font-bold text-[20px]">Leads sin asignación</span>
            <Card>
                <div className="flex flex-col gap-4">
                    <TextField
                        label=""
                        value={searchValue}
                        onChange={(value) => {
                            setSearchValue(value);
                            setCurrentPage(1);
                        }}
                        placeholder="Buscar por nombre, correo o ciudad"
                        clearButton
                        onClearButtonClick={() => setSearchValue("")}
                        autoComplete="off"
                    />
                    <IndexTable
                        resourceName={{ singular: "lead", plural: "leads" }}
                        itemCount={filteredLeads.length}
                        selectedItemsCount={
                            allResourcesSelected ? "All" : selectedResources.length
                        }
                        onSelectionChange={handleSelectionChange}
                        headings={[
                            { title: "Nombre" },
                            { title: "Correo Electrónico" },
                            { title: "Teléfono" },
                            { title: "Ciudad" },
                            { title: "Acciones" },
                        ]}
                        promotedBulkActions={promotedBulkActions}
                        emptyState="No se encontraron resultados"
                    >
                        {rowMarkup}
                    </IndexTable>
                    <div className="flex flex-row-reverse items-center w-full justify-between">
                        <Pagination
                            hasPrevious={currentPage > 1}
                            onPrevious={() => handlePagination("previous")}
                            hasNext={currentPage < totalPages}
                            onNext={() => handlePagination("next")}
                        />
                        <Select
                            label=""
                            options={[
                                { label: "10", value: "10" },
                                { label: "20", value: "20" },
                                { label: "Todos", value: "todos" },
                            ]}
                            value={itemsPerPage}
                            onChange={(value) => {
                                setItemsPerPage(value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            </Card>
            {isOpen && (
                <ModalAsignacionVendedor
                    leadIds={selectedResources}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    assignedTo={null}
                />
            )}
        </div>
    );
}
