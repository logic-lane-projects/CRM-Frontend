const APP_URL = import.meta.env.VITE_API_TWILIO_URL;

export const getUnreadNumbers = async ({
  user_id,
  office_id,
}: {
  user_id: string;
  office_id: string;
}) => {
  try {
    const response = await fetch(
      `${APP_URL}get_unread_numbers?user_id=${user_id}&office_id=${office_id}`
    );
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los números no leídos:", error);
    return null;
  }
};

export const gellAllMessagesByOffice = async (office_id: string) => {
  try {
    const response = await fetch(
      `${APP_URL}get_all_unread_numbers_by_office?office_id=${office_id}`
    );
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los números no leídos:", error);
    return null;
  }
};
