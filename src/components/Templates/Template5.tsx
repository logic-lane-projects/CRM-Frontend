import { Button } from '@shopify/polaris';
import { useState } from 'react';
import { Toast } from '../Toast/toast';
import { Lead } from '../../services/leads';
import { sendTemplate } from '../../services/template';

interface Template5Props {
    setIsOpen: (isOpen: boolean) => void;
    clientNumber: string;
    clientInfo: Lead;
}

export default function Template5({ setIsOpen, clientInfo }: Template5Props) {
    const [isLoading, setIsLoading] = useState({
        sending: false
    });

    const nombreOficina = localStorage.getItem("oficinaActualNombre");
    const clientNumber = localStorage.getItem("clientNumber") ?? "";

    const handleSend = async () => {
        setIsLoading({ ...isLoading, sending: true });
        try {
            await sendTemplate({
                to: clientNumber.toString(),
                client_name: `${clientInfo?.names} ${clientInfo?.maternal_surname} ${clientInfo?.paternal_surname}`,
                of_name: nombreOficina ?? "",
                template_number: "5"
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
            <div className="mt-4">
                <p>Si lo desea puede agendar una cita conmigo en la caseta de ventas situada donde se ubica el proyecto hospitalario. Ahí podemos ver los consultorios que quedan disponibles para encontrar la mejor solución para usted. ¡Gracias y saludos!</p>
            </div>

            <div className='mt-3 flex gap-2 items-center'>
                <Button variant='primary' disabled={isLoading.sending} onClick={handleSend}>{isLoading.sending ? "Enviando..." : "Enviar"}</Button>
                <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
            </div>
        </div>
    );
}
