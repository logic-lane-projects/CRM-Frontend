
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
const API_URL_TWILIO = import.meta.env.VITE_API_TWILIO_URL;

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

type Calls = {
  client_number: string;
  date_call: string;
  durantions_in_seconds: string|number;
  status_calls: string|number;
  twilio_number: string|number;
}

export type HistorialCalls = {
  calls: Calls[];
  day: string;
}

export interface CallsHistorial { 
  history_calls: HistorialCalls[]
}

export const getHistorialCallsByNumber = async (number: number|string): Promise<CallsHistorial> => {
  try {
    const response = await fetch(`${API_URL_TWILIO}get_calls_histories?number=${number}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener el historial de llamas del ${number}`);
    }    
    const data = await response.json();
    return data;
  } catch(error){
    console.error(`Error al obtener el historial de llamadas de ${number}:`, error);
    throw error;
  }
}