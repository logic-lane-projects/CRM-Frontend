const API_URL = import.meta.env.VITE_API_URL;

// funcion para obtener todos los archivos de un cliente
export async function getAllFilesByClientId(id: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}client/legal_files/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener los archivos del cliente");
    }

    const data = await response.json();

    return data.data;
  } catch (error) {
    console.error("Error al obtener los archivos del cliente", error);
    throw error;
  }
}

// funcion para enviar un archivo
export async function uploadFileByClientId(
  id: string,
  file: File
): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("clientId", id);

    const response = await fetch(`${API_URL}client/upload_legal_file/${id}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error al subir el archivo");
    }

    const data = await response.json();
    console.log("Archivo subido correctamente", data);
  } catch (error) {
    console.error("Error al subir el archivo del cliente", error);
    throw error;
  }
}

//   funcion para eliminar un archivo
export async function deleteFileByClientId(
  id: string,
  filePath: string
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}client/delete/legal_files`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        ruta: filePath,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el archivo");
    }

    const data = await response.json();
    console.log("Archivo eliminado correctamente", data);
  } catch (error) {
    console.error("Error al eliminar el archivo del cliente", error);
    throw error;
  }
}
