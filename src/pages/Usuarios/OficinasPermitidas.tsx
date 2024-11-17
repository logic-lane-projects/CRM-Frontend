import { useEffect, useState } from "react";
import { Spinner, Button, TextField, Checkbox, Tag } from "@shopify/polaris";
import { getAllOffices } from "../../services/oficinas";
import { OfficeData } from "../../services/oficinas";
import { updateOficinasPermitidas } from "../../services/user";
import { useAuthToken } from "../../hooks/useAuthToken";
import { Toast } from "../../components/Toast/toast";

interface OficinasPermitidasProps {
    user: { permisos?: string[]; _id: string; oficinas_permitidas: string[] | undefined };
}

export default function OficinasPermitidas({ user }: OficinasPermitidasProps) {
    const { userInfo } = useAuthToken();
    const [offices, setOffices] = useState<OfficeData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedOffices, setSelectedOffices] = useState<string[]>(user.oficinas_permitidas || []);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    useEffect(() => {
        const fetchOffices = async () => {
            setLoading(true);
            const response = await getAllOffices();
            if (response.result && response.data) {
                setOffices(response.data);
            } else {
                console.error(response.error);
            }
            setLoading(false);
        };
        fetchOffices();
    }, []);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
    };

    const handleCheckboxChange = (id: string) => {
        setSelectedOffices((prevSelectedOffices) => {
            if (prevSelectedOffices.includes(id)) {
                return prevSelectedOffices.filter((selectedId) => selectedId !== id);
            } else {
                return [...prevSelectedOffices, id];
            }
        });
    };

    const filteredOffices = offices.filter((office) => {
        const lowerCaseSearchQuery = searchQuery.toLowerCase();
        return (
            office.nombre.toLowerCase().includes(lowerCaseSearchQuery) ||
            office.ciudad.toLowerCase().includes(lowerCaseSearchQuery) ||
            office.estado.toLowerCase().includes(lowerCaseSearchQuery)
        );
    });

    const handleSaveSelection = async () => {
        if (!userInfo) {
            console.error('Usuario no autenticado');
            return;
        }

        setIsSaving(true);
        const result = await updateOficinasPermitidas(user._id, selectedOffices, userInfo.id);
        setIsSaving(false);

        if (result.error) {
            Toast.fire({
                icon: "error",
                title: `Error al actualizar las oficinas: ${result.error}`,
            });
        } else {
            Toast.fire({
                icon: "success",
                title: "Oficinas actualizadas correctamente",
            });
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <span className="font-bold text-[20px]">Oficinas Permitidas</span>

            <div className="mt-4">
                <span className="font-semibold">Oficinas Seleccionadas:</span>
                <div className="mt-2">
                    {selectedOffices.length > 0 ? (
                        selectedOffices.map((officeId) => {
                            const office = offices.find((office) => office._id === officeId);
                            return office ? (
                                <Tag key={office._id} onRemove={() => handleCheckboxChange(office._id)}>
                                    {office.nombre} - {office.ciudad}, {office.estado}
                                </Tag>
                            ) : null;
                        })
                    ) : (
                        <span>No se ha seleccionado ninguna oficina.</span>
                    )}
                </div>
            </div>

            {loading ? (
                <Spinner size="large" />
            ) : (
                <>
                    <TextField
                        label="Buscar oficina (por nombre, ciudad o estado)"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Buscar..."
                        autoComplete="off"
                    />

                    <div className="mt-4">
                        <Button
                            variant="primary"
                            onClick={handleSaveSelection}
                            loading={isSaving}
                            disabled={isSaving}
                        >
                            Guardar Selección
                        </Button>
                    </div>

                    {filteredOffices.length === 0 && (
                        <p className="mt-4 text-red-500">No se encontraron resultados.</p>
                    )}

                    <div className="mt-4 w-full">
                        <ul>
                            {filteredOffices.map((office) => (
                                <li key={office._id} className="flex items-center space-x-2">
                                    <Checkbox
                                        label={`${office.nombre} - ${office.ciudad}, ${office.estado}`}
                                        checked={selectedOffices.includes(office._id)}
                                        onChange={() => handleCheckboxChange(office._id)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
