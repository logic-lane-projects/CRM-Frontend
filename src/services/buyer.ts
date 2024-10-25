// src/services/clientes.ts
export interface Buyer {
  _id?: string;
  names: string;
  paternal_surname: string;
  maternal_surname: string;
  email: string;
  phone_number: string;
  age: number;
  birthday_date: string;
  city: string | null;
  state: string | null;
  status?: boolean | null;
  type_lead: string;
  type_client?: string; 
  type_person?: string; 
  gender: "MALE" | "FEMALE" | null;
  is_client: boolean | null;
  assigned_to?: string | null; 
  files_legal_extra?: string[]; 
  files_legal_fisica?: string[]; 
  files_legal_moral?: string[];
  created_at?: string;
  updated_at?: string;
}


const API_URL = import.meta.env.VITE_API_URL;

// Consultar clientes activos
export const getActiveBuyers = async (): Promise<{
  result: boolean;
  error: string;
  data: Buyer[];
}> => {
  try {
    const response = await fetch(
      `${API_URL}buyer/active
  `,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error("Error al obtener los prospectos activos");
    }
    const jsonResponse = await response.json(); 
    return jsonResponse; 
  } catch (error) {
    console.error("Error al obtener los clientes activos:", error);
    throw error;
  }
};

export const getBuyerById = async (
  id: string
): Promise<{ result: boolean; error: string; data: Buyer }> => { 
  try {
    const response = await fetch(`${API_URL}buyer/active/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos del cliente");
    }

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("Error al obtener la información del cliente", error);
    throw error;
  }
};

export const changeProspectToClient = async (id?: string | number): Promise<void> => {
  try {
    const response = await fetch(
      `${API_URL}client/change/client/${id}`,
      {
        method: "PATCH",
      }
    );
    if (!response.ok) {
      throw new Error("Error al pasar el lead a prospecto");
    }
    console.log("El lead se hizo cliente existosamente");
  } catch (error) {
    console.error("Error al pasar el lead a prospecto", error);
    throw error;
  }
};

