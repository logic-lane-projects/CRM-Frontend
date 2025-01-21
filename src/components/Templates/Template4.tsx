import { Button, TextField } from '@shopify/polaris';
import { useState } from 'react';
import { Toast } from '../Toast/toast';
import { sendTemplate } from './../../services/template';
import { Lead } from '../../services/leads';

interface Template4Props {
    setIsOpen: (isOpen: boolean) => void;
    clientNumber: string;
    clientInfo?: Lead;
}

export default function Template4({ setIsOpen, clientInfo, clientNumber }: Template4Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [direccion, setDireccion] = useState('');

    const handleSend = async () => {
        setIsLoading(true);
        try {
            await sendTemplate({
                to: clientNumber.toString(),
                client_name: `${clientInfo?.names} ${clientInfo?.maternal_surname} ${clientInfo?.paternal_surname}`,
                address: direccion,
                template_number: "4"
            });
            Toast.fire({ icon: "success", title: "Template enviado exitosamente" });
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "Error",
                text: error instanceof Error ? error.message : "Error desconocido",
                timer: 5000
            });
        } finally {
            setIsOpen(false);
            setIsLoading(false);
        }
    };

    return (
        <div>
            <TextField
                label="Dirección de la oficina"
                value={direccion}
                onChange={setDireccion}
                autoComplete="off"
                error={direccion === '' && 'Ingrese la dirección'}
            />
            <div className="mt-4">
                <p>
                    ¡Deseamos que esté teniendo un día muy productivo! ¿Ha podido mirar la información que le mandamos?
                    Le reitero nuestro ofrecimiento para agendar una cita en nuestro showroom y darle todos los pormenores del proyecto.
                </p>
                <p>
                    ¡Visita nuestro showroom situado en el mismo lugar de nuestro proyecto hospitalario! Estamos ubicados en <strong>{direccion}</strong>.
                    Conozca los consultorios que siguen disponibles y encuentre el que más se adapte a sus necesidades.
                </p>
                <p>¡Sigamos en comunicación!</p>
            </div>
            <div className="mt-3 flex gap-2 items-center">
                <Button variant="primary" disabled={isLoading || direccion.trim() === ''} onClick={handleSend}>
                    {isLoading ? "Enviando..." : "Enviar"}
                </Button>
                <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
            </div>
        </div>
    );
}
