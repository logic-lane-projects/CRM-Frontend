// src/services/clientes.ts
export interface All {
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
  profesion?: string;	
  especialidad?:string;
  folio?:string
  nombre_campania_externa?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

// Consultar clientes activos
export const getActiveBuyers = async (): Promise<{
  result: boolean;
  error: string;
  data: All[];
}> => {
  try {
    const response = await fetch(
      `${API_URL}clientes/custom/all/COMPRADOR
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
): Promise<{ result: boolean; error: string; data: All }> => {
  try {
    const response = await fetch(`${API_URL}clientes/custom/${id}`, {
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

export const changeProspectToClient = async (
  id?: string | number,
  userId?: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_URL}client/change/client/${id}/${userId}`,
      {
        method: "PATCH",
      }
    );
    if (!response.ok) {
      throw new Error("Error al pasar el lead a prospecto");
    }
  } catch (error) {
    console.error("Error al pasar el lead a prospecto", error);
    throw error;
  }
};
