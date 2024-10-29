const API_URL = import.meta.env.VITE_API_URL;

export const selectTypePerson = async (
  id: string,
  type_person: string,
  userId: string
) => {
  try {
    const response = await fetch(
      `${API_URL}select/type_person/${id}/${type_person}/${userId}`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al seleccionar tipo de persona:", error);
    throw error;
  }
};
