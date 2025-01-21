import { TextField, Button } from '@shopify/polaris';
import { useState } from 'react';
import { Toast } from '../Toast/toast';
import { sendTemplate } from './../../services/template';
import { Lead } from '../../services/leads';

interface Template3Props {
    setIsOpen: (isOpen: boolean) => void;
    clientInfo: Lead;
}

export default function Template3({ setIsOpen, clientInfo }: Template3Props) {
    const [userName, setUserName] = useState('');
    const [userPosition, setUserPosition] = useState('');
    const [state, setState] = useState('');
    const [projectName, setProjectName] = useState('');
    const [city, setCity] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const nombreOficina = localStorage.getItem("oficinaActualNombre");
    const clientNumber = localStorage.getItem("clientNumber") ?? "";

    const isFormValid = userName.trim() !== '' &&
        userPosition.trim() !== '' &&
        state.trim() !== '' &&
        projectName.trim() !== '' &&
        city.trim() !== '';

    const handleSend = async () => {
        setIsLoading(true);
        try {
            await sendTemplate({
                to: clientNumber.toString(),
                client_name: `${clientInfo?.names} ${clientInfo?.maternal_surname} ${clientInfo?.paternal_surname}`,
                seller_name: userName,
                seller_position: userPosition,
                of_name: nombreOficina ?? "",
                city: city ?? "",
                state: state ?? "",
                project_name: projectName ?? "",
                template_number: "3"
            });
            Toast.fire({ icon: "success", title: "Template enviado exitosamente" });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            Toast.fire({ icon: "error", title: "Error", text: errorMessage, timer: 5000 });
        } finally {
            setIsLoading(false);
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
                <p>Hola! Buenos días. Soy <strong>{userName}</strong>, <strong>{userPosition}</strong> de 50Doctors en <strong>{state}</strong>.<br />Un gusto saludarle.<br />He visto que nos ha pedido información sobre nuestro proyecto <strong>{projectName}</strong> en <strong>{city}</strong>.<br />Dígame en qué podemos ayudarle. Gracias.</p>
            </div>
            <div className='mt-3 flex gap-2 items-center'>
                <Button variant='primary' disabled={!isFormValid || isLoading} onClick={handleSend}>{isLoading ? "Enviando..." : "Enviar"}</Button>
                <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
            </div>
        </div>
    );
}
