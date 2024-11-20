import React, { useState, useEffect } from "react";
import { Toast } from "../../components/Toast/toast";
import { uploadMarketingFile, getAllMarketingFiles, deleteMarketingFile, searchMarketingFileByName } from "../../services/archivos";
import { Button, Card, TextField, Modal } from "@shopify/polaris";
import { useAuthToken } from "../../hooks/useAuthToken";

const Archivos: React.FC = () => {
    const { userInfo } = useAuthToken();
    const [files, setFiles] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
    const [, setLoadingUpload] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [fileError, setFileError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchAllFiles();
    }, []);

    const fetchAllFiles = async () => {
        setLoadingFiles(true);
        try {
            const response = await getAllMarketingFiles();
            if (response.result && response.data) {
                setFiles(response.data);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se encontraron archivos",
                });
            }
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: error instanceof Error ? error.message : "Error al cargar los archivos",
            });
        } finally {
            setLoadingFiles(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];

            const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif", "image/webp"];
            if (validTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
                setFileError(null);
                setIsModalOpen(true);
            } else {
                setFileError("Por favor selecciona un archivo PDF o una imagen (JPG, PNG, GIF, WEBP).");
                setFile(null);
                setIsModalOpen(false);
            }
        }
    };

    const handleUpload = async () => {
        if (!file || !fileName) {
            Toast.fire({
                icon: "warning",
                title: "Por favor selecciona un archivo y asigna un nombre",
            });
            return;
        }

        setLoadingUpload(true);
        try {
            // Obtenemos la extensión del archivo original
            const fileExtension = file.name.split('.').pop(); // Obtiene la extensión del archivo original
            const newFileName = `${fileName}.${fileExtension}`; // Asigna el nuevo nombre con la extensión original

            // Renombramos el archivo con el nuevo nombre
            const renamedFile = new File([file], newFileName, { type: file.type });

            if (userInfo?.id) {
                await uploadMarketingFile(userInfo.id, renamedFile);
                Toast.fire({
                    icon: "success",
                    title: "Archivo subido exitosamente",
                });
                setFile(null);
                setFileName("");
                fetchAllFiles();
                setIsModalOpen(false);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "Usuario no encontrado",
                });
            }
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: error instanceof Error ? error.message : "Error al subir el archivo",
            });
        } finally {
            setLoadingUpload(false);
        }
    };


    const handleSearchByName = async () => {
        setLoadingFiles(true);
        try {
            const results = await searchMarketingFileByName(fileName);
            setFiles(results);
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: error instanceof Error ? error.message : "Error al buscar el archivo",
            });
        } finally {
            setLoadingFiles(false);
        }
    };

    const handleDelete = async (id: string) => {
        setLoadingDelete(true);
        try {
            await deleteMarketingFile(id);
            Toast.fire({
                icon: "success",
                title: "Archivo eliminado exitosamente",
            });
            fetchAllFiles();
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: error instanceof Error ? error.message : "Error al eliminar el archivo",
            });
        } finally {
            setLoadingDelete(false);
        }
    };

    const handleOpenFile = (filePath: string) => {
        const fileUrl = filePath.startsWith('http') ? filePath : `${API_URL}${filePath.replace('./public', '')}`;
        window.open(fileUrl, "_blank");
    };

    return (
        <div>
            <Card>
                <div className="mb-4">
                    <span className="font-bold text-[20px]">Archvios Generales</span>
                    <TextField
                        label="Buscar archivo por nombre"
                        value={fileName}
                        onChange={(value) => setFileName(value)}
                        autoComplete="off"
                    />
                    <Button onClick={handleSearchByName} loading={loadingFiles} variant="primary">
                        Buscar
                    </Button>
                </div>

                <div className="mb-4">
                    <input type="file" onChange={handleFileChange} />
                    {fileError && <div style={{ color: 'red', marginTop: '8px' }}>{fileError}</div>}
                </div>

                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Asigna un nombre al archivo"
                    primaryAction={{
                        content: "Subir Archivo",
                        onAction: handleUpload,
                    }}
                    secondaryActions={[
                        {
                            content: "Cancelar",
                            onAction: () => setIsModalOpen(false),
                        },
                    ]}
                >
                    <Modal.Section>
                        <TextField
                            label="Nombre del archivo"
                            value={fileName}
                            onChange={(value) => setFileName(value)}
                            placeholder="Escribe el nombre del archivo"
                            autoComplete="off"
                            clearButton
                        />
                    </Modal.Section>
                </Modal>

                <div>
                    {files.length > 0 ? (
                        files.map((file) => {
                            return (
                                <div key={file._id} className="p-2 flex justify-between items-center border-b">
                                    <span>{file.ruta_archivo.split('/').pop()}</span>
                                    <Button
                                        onClick={() => handleDelete(file._id)}
                                        loading={loadingDelete}
                                        variant="primary"
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        onClick={() => handleOpenFile(file.ruta_archivo)}
                                        variant="secondary"
                                    >
                                        Ver archivo
                                    </Button>
                                </div>
                            );
                        })
                    ) : (
                        <p>No hay archivos disponibles</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Archivos;
