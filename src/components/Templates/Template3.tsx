import { TextField, Button } from '@shopify/polaris';
import { useState } from 'react';
import { Toast } from '../Toast/toast';
import { sendTemplate } from './../../services/template';
import { Lead } from '../../services/leads';

interface Template3Props {
    setIsOpen: (isOpen: boolean) => void;
    clientNumber: string;
    clientInfo?: Lead;
}

export default function Template3({ setIsOpen , clientNumber}: Template3Props) {
    const [direccion, setDireccion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isFormValid =
        direccion.trim() !== '';

    const handleSend = async () => {
        setIsLoading(true);
        try {
            await sendTemplate({
                to: clientNumber.toString(),
                address:direccion ?? "",
                template_number: "3",
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
            <TextField label="Direccion" value={direccion} onChange={setDireccion} autoComplete="off" error={direccion === '' && 'Ingrese la Direccion de la origina'} />
            <div className="mt-4">
                <p>
                    ¿Sabías que <strong>50 Doctors</strong> es el complejo hospitalario más moderno y de mayor crecimiento en México?<br />
                    Me dará gusto acompañarle en este proceso para adquirir su consultorio y pueda obtener más información de todos nuestros servicios en <strong>{direccion}</strong>.<br />
                    ¡Gracias por confiar en nosotros!
                </p>
            </div>
            <div className="mt-3 flex gap-2 items-center">
                <Button variant="primary" disabled={!isFormValid || isLoading} onClick={handleSend}>
                    {isLoading ? "Enviando..." : "Enviar"}
                </Button>
                <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
            </div>
        </div>
    );
}
