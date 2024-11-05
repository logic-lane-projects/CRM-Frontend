import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import { Toast } from "../../components/Toast/toast";
import { getHistorialById } from "../../services/historial";
import {
    Button,
    Collapsible,
    TextContainer,
    LegacyCard,
  } from "@shopify/polaris";

interface Activity { 
    _id: string;   
    activity_description: string;
    created_at: string;
    email_vendedor: string;       
    id_vendedor: string;          
    name_vendedor: string;        
    type_activity: string;        
    updated_at: string | null;
}

export interface userHistorial{
    activities: Activity[];
}

export default function Historial() {
    const { id } = useParams<{ id: string }>();
    const [historial, setHistorial] = useState<userHistorial | null>(null);
    const [loading, setLoading] = useState (true);
    const [error, setError] = useState<string | null>(null);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchHistorial = async () => {
            if (!id) {
                setError("ID no proporcionado.");
                setLoading(false);
                return;
            }
            setLoading(true);

            try {
                if (id) {
                    const data = await getHistorialById(id);
                    console.log('Historial obtenido:', data);
                    setHistorial(data);
                } else {
                    setError("ID no proporcionado.");
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message: String(error);
                setError(errorMessage);
                Toast.fire({
                    icon: "error",
                    title: errorMessage,
                });
            } finally{
                setLoading(false);
            }
        };
        if (id){
            fetchHistorial();
        }              
    }, [id]);

    if (loading) return <div>Cargando...</div>
    if (error) return <div>Error: {error}</div>

    //Funcion para agrupar actividades por fecha
    function groupActivitiesByDate(activities: Activity[]): Record<string, Activity[]> {
        return activities.reduce((acc, activity) => {                
            const date = new Date(activity.created_at).toLocaleDateString();                
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(activity);                
            return acc;
        }, {} as Record<string, Activity[]>);
    }
    
    const groupedActivities = historial ? groupActivitiesByDate(historial.activities) : {};

    const handleToggle = (date: string) => {
        setOpenGroups((prev) => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

return (
    <div className="font-semibold text-[15px]" >
        Historial
        {Object.keys(groupedActivities).length > 0 ? (
            Object.keys(groupedActivities).map(date => (
                <div key={date} className="p-2">                    
                    <Button onClick={() => handleToggle(date)} ariaExpanded={openGroups[date]} fullWidth>
                    {date} {openGroups[date] ? '▲' : '▼'}
                    </Button>
                    
                    <Collapsible 
                        id={`collapsible-${date}`}
                        open={openGroups[date] || false} 
                        transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}>
                        <div className="pt-4">
                            {groupedActivities[date].map(activity => (
                                <LegacyCard key={activity._id} sectioned>
                                    <TextContainer>
                                        <p>
                                            <span className="font-semibold">Actividad:  </span> 
                                            <span className="text-gray-700">{activity.type_activity}</span>
                                        </p>
                                        <p>
                                            <span className="font-semibold">Detalles:  </span> 
                                            <span className="text-gray-700">{activity.activity_description}</span>
                                        </p>
                                        <p>
                                            <span className="font-semibold">Vendedor:  </span> 
                                            <span className="text-gray-700">{activity.name_vendedor}</span>
                                        </p>
                                    </TextContainer>
                                </LegacyCard>
                            ))}
                        </div>
                    </Collapsible>                    
                </div>
                ))
            ) : (
                <p>No hay historial disponible.</p>
            )}
    </div>
        
 );
}