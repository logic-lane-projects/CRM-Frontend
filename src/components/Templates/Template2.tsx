import { TextField, Button } from '@shopify/polaris';
import { useState, useEffect } from 'react';
import { FolderIcon } from "@shopify/polaris-icons";
import { Toast } from '../Toast/toast';
import { getAllFiles } from '../../services/newFiles';
import { FolderData } from '../../pages/Leads/Whatsapp';
import { PDFFileIcon } from '../icons';
import ModalArchivosCarpetas from '../Modales/ModalArchivosCarpetasWhatsapp';
import { sendTemplate } from './../../services/template';
import { Lead } from '../../services/leads';

interface Template1Props {
    setIsOpen: (isOpen: boolean) => void;
    clientNumber: string;
    clientInfo?: Lead;
}

export default function Template2({ setIsOpen,clientNumber }: Template1Props) {
    const [loadingFolders, setLoadingFolders] = useState<boolean>(false);
    const [folders, setFolders] = useState<FolderData[]>([]);
    const [fileSelected, setFileSelected] = useState<string[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<{ id: string; name: string } | null>(null);
    const [city, setCity] = useState('');
    const [isOpen1, setIsOpen1] = useState(false);
    const [isLoading, setIsLoading] = useState({
        sending: false
    });
    const isFormValid = (
        city.trim() !== '' &&
        fileSelected && fileSelected.length > 0
    );

    const fetchAllFolders = async () => {
        setLoadingFolders(true);
        try {
            const response = await getAllFiles();
            if (response.result && Array.isArray(response.data)) {
                const filteredFolders = response.data.filter(folder => ["templates", "vendedores"].includes(folder.nombre_carpeta));
                setFolders(filteredFolders.length ? filteredFolders : []);
            } else {
                Toast.fire({ icon: "error", title: "No se encontraron carpetas" });
            }
        } catch (error) {
            Toast.fire({ icon: "error", title: error instanceof Error ? error.message : "Error al obtener las carpetas" });
        } finally {
            setLoadingFolders(false);
        }
    };

    useEffect(() => {
        fetchAllFolders();
    }, []);

    const handleViewFolder = (folder: FolderData) => {
        setSelectedFolder({ id: folder._id, name: folder.nombre_carpeta });
        setIsOpen1(true);
    };

    const handleSend = async () => {
        setIsLoading({ ...isLoading, sending: true });
        try {
            const fileName = fileSelected[0].split('vendedores/')[1] ?? fileSelected[0].split('templates/')[1];
            await sendTemplate({
                to: clientNumber.toString(),
                city: city ?? "",
                img_name: selectedFolder?.name +"/" + fileName,
                template_number: "2"
            });
            Toast.fire({ icon: "success", title: "Template enviado exitosamente" });
            setIsLoading({ ...isLoading, sending: false });
        } catch (error) {
            setIsLoading({ ...isLoading, sending: false });
            Toast.fire({
                icon: "error",
                title: "Error",
                text: (error as Error).message,
                timer: 5000,
            });
        }
    };

    return (
        <div>
            <TextField label="Ciudad" value={city} onChange={setCity} autoComplete="off" error={city === '' && 'Ingrese la ciudad'} />
            <div className="mt-4">
                <p>
                    ¡Espero que esté teniendo un excelente día! Me comunico de nuevo con usted, pues recibí recientemente su solicitud de información para nuestro proyecto de hospital y consultorios en <strong>{city}</strong>.<br /><br />
                    Cuéntenos ¿cuál es la información que requiere para resolver todas sus dudas? ¡Esta a un paso de adquirir su consultorio!
                </p>
            </div>

            <div className='mt-3 flex gap-2 border-2 border-black'>
                {loadingFolders ? (
                    <p>Cargando...</p>
                ) : (
                    folders.length > 0 && fileSelected.length === 0 ? (
                        folders.map(folder => (
                            <Button key={folder._id} icon={FolderIcon} variant="tertiary" onClick={() => handleViewFolder(folder)}>
                                {folder.nombre_carpeta}
                            </Button>
                        ))
                    ) : (
                        fileSelected.map((file, idx) => (
                            <div key={`file-${idx}`} className="w-10 h-10 flex justify-center items-center bg-[#E9E9E9] rounded-md overflow-hidden p-1">
                                {file.endsWith(".pdf") ? (
                                    <PDFFileIcon className="w-7 h-auto" />
                                ) : (
                                    <img src={file} alt={`Archivo ${idx + 1}`} className="w-full h-full object-cover rounded-md" />
                                )}
                            </div>
                        ))
                    )
                )}
            </div>

            {isOpen1 && selectedFolder && (
                <div className='hidden'>
                    <ModalArchivosCarpetas isOpen={isOpen1} setIsOpen={setIsOpen1} folder={selectedFolder} fileSelected={fileSelected} setFileSelected={setFileSelected} />
                </div>
            )}

            {fileSelected?.length == 0 && (
                <span className="text-red-500 font-bold">Selecciona una imagen</span>
            )}

            {fileSelected.length > 0 && (
                <div className='mt-2'>
                    <Button onClick={() => setFileSelected([])}>Eliminar Imagen</Button>
                </div>
            )}

            <div className='mt-3 flex gap-2 items-center'>
                <Button variant='primary' disabled={!isFormValid || isLoading.sending} onClick={handleSend}>{isLoading.sending ? "Enviando..." : "Enviar"}</Button>
                <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
            </div>
        </div>
    );
}
