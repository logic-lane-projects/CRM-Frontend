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

export default function Template1({ setIsOpen }: Template1Props) {
    const [loadingFolders, setLoadingFolders] = useState<boolean>(false);
    const [folders, setFolders] = useState<FolderData[]>([]);
    const [fileSelected, setFileSelected] = useState<string[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<{ id: string; name: string } | null>(null);
    const [userName, setUserName] = useState('');
    const [userPosition, setUserPosition] = useState('');
    const [state, setState] = useState('');
    const [projectName, setProjectName] = useState('');
    const [city, setCity] = useState('');
    const [isOpen1, setIsOpen1] = useState(false);
    const [isLoading, setIsLoading] = useState({
        sending: false
    });
    const clientNumber = localStorage.getItem("clientNumber") ?? "";
    const isFormValid = (
        userName.trim() !== '' &&
        userPosition.trim() !== '' &&
        state.trim() !== '' &&
        projectName.trim() !== '' &&
        city.trim() !== '' &&
        fileSelected && fileSelected.length > 0
    );

    const fetchAllFolders = async () => {
        setLoadingFolders(true);
        try {
            const response = await getAllFiles();
            if (response.result && Array.isArray(response.data)) {
                const filteredFolders = response.data.filter(folder => ["vendedores", "templates"].includes(folder.nombre_carpeta));
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
                seller_name: userName,
                seller_position: userPosition,
                state: state ?? "",
                project_name: projectName ?? "",
                city: city ?? "",
                img_name: selectedFolder?.name +"/" + fileName,
                template_number: "1"
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
            <TextField label="Nombre del Vendedor" value={userName} onChange={setUserName} autoComplete="off" error={userName === '' && 'Ingrese el nombre del Vendedor'} />
            <TextField label="Puesto en la empresa" value={userPosition} onChange={setUserPosition} autoComplete="off" error={userPosition === '' && 'Ingrese el puesto en la empresa'} />
            <TextField label="Estado" value={state} onChange={setState} autoComplete="off" error={state === '' && 'Ingrese el estado'} />
            <TextField label="Nombre del proyecto" value={projectName} onChange={setProjectName} autoComplete="off" error={projectName === '' && 'Ingrese el nombre del proyecto'} />
            <TextField label="Ciudad" value={city} onChange={setCity} autoComplete="off" error={city === '' && 'Ingrese la ciudad'} />
            <div className="mt-4">
                <p>¡Hola! ¡Te doy la bienvenida! Soy <strong>{userName}</strong>, <strong>{userPosition}</strong> de 50 Doctors en <strong>{state}</strong>. Un gusto saludarte.<br />He visto que tiene interés sobre nuestro proyecto <strong>{projectName}</strong> en <strong>{city}</strong>. Me dará mucho gusto darle seguimiento y resolver todas sus dudas.</p>
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
