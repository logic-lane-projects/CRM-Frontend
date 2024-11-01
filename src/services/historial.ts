
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

const API_URL = import.meta.env.VITE_API_URL;

export const getHistorialById = async (id: string): Promise<userHistorial> => {
    try {
        const response = await fetch(`${API_URL}historial/${id}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`Error al obtener el historial con ID ${id}`);
        }    
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error(`Error al obtener el historial con ID ${id}:`, error);
        throw error;
      }
}