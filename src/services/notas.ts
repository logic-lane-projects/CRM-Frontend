const API_BASE_URL = import.meta.env.VITE_API_URL;

const NotesService = {
  // Crear nota
  async createNote(idVendedor: string, nota: string) {
    try {
      const response = await fetch(`${API_BASE_URL}nota/${idVendedor}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nota }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la nota");
      }

      return await response.json();
    } catch (error) {
      throw new Error((error as Error).message || "Error al crear la nota");
    }
  },

  // Obtener todas las notas de un vendedor
  async getNotesBySeller(idVendedor: string) {
    try {
      const response = await fetch(`${API_BASE_URL}nota/${idVendedor}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener las notas");
      }

      return await response.json();
    } catch (error) {
      throw new Error((error as Error).message || "Error al obtener las notas");
    }
  },

  // Borrar nota
  async deleteNote(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/nota/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al borrar la nota");
      }

      return await response.json();
    } catch (error) {
      throw new Error((error as Error).message || "Error al borrar la nota");
    }
  },

  // Editar nota
  async editNote(id: string, idVendedor: string, nota: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/nota/${id}/${idVendedor}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nota }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al editar la nota");
      }

      return await response.json();
    } catch (error) {
      throw new Error((error as Error).message || "Error al editar la nota");
    }
  },

  // Obtener nota por ID
  async getNoteById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/nota/id/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener la nota");
      }

      return await response.json();
    } catch (error) {
      throw new Error((error as Error).message || "Error al obtener la nota");
    }
  },
};

export default NotesService;
