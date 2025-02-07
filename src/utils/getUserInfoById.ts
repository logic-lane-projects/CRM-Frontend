import { getUserById } from "./../services/user";

interface ClientData {
  result: boolean;
  error: string;
  data: {
    _id: string;
    names: string;
    email: string;
    phone_number: string;
    city: string;
    state: string;
    type_lead: string;
    gender: string;
    oficina: string;
    assigned_to: string;
  };
}

export const getUserInfo = async (id: string): Promise<ClientData | null> => {
  try {
    const response = await getUserById(id);
    console.log(response)
    return response as unknown as ClientData;
  } catch (error) {
    console.error("Error al obtener la información del cliente:", error);
    return null;
  }
};
