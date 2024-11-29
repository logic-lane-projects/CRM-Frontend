// src/services/clientes.ts
import { All } from "./buyer";
export interface Client {
  _id?: string | undefined;
  names: string;
  paternal_surname: string;
  maternal_surname: string;
  email: string;
  phone_number: string;
  age: number;
  birthday_date: string;
  city: string | null;
  state: string | null;
  status?: string | null;
  type_lead: string;
  gender: "MALE" | "FEMALE" | null;
  is_client: boolean | null;
  created_at?: string;
  updated_at?: string;
  type_person: string;
}

const API_URL = import.meta.env.VITE_API_URL;
const API_URL_TWILIO = import.meta.env.VITE_API_TWILIO_URL;

export const getActiveClient = async (): Promise<{
  result: boolean;
  error: string;
  data: All[];
}> => {
  try {
    const response = await fetch(`${API_URL}clientes/custom/all/CLIENTE`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Error al obtener los clientes activos");
    }
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("Error al obtener los clientes activos:", error);
    throw error;
  }
};

export const getClientById = async (
  id: string
): Promise<{ result: boolean; error: string; data: Client }> => {
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

export interface UnregisterClient {
  _id: string;
  created_At: string;
  is_activate: string|boolean;
  number: string|number;
}

export const getUnregisterClients = async (): 
Promise<{ message: UnregisterClient[] }> => {
  try {
    const response = await fetch(`${API_URL_TWILIO}get_unregistered_chats`, {
      method: "GET",
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("Error al obtener la información de los clientes", error);
    throw error;
  }
}