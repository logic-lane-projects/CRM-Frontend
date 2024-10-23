import React, { useState, useEffect, useCallback, useRef} from "react";
import { Button,
        Modal,
        LegacyStack,
 } from "@shopify/polaris";
import {
  getAllFilesByClientId,
  uploadFileByClientId,
  deleteFileByClientId,
} from "../../services/files";
import { Toast } from "../../components/Toast/toast";

const API_URL = import.meta.env.VITE_API_URL; 

interface ArchivosProps {
  id?: string;
}

export default function Archivos({ id }: ArchivosProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [active, setActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);//Ref para el input del archivo
  const toggleActive = useCallback(() => {
      setActive((active) => !active);
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      if (id) {
        try {
          const clientFiles = await getAllFilesByClientId(id);
          setFiles(clientFiles);
        } catch (error) {
          const errorMessage =
            typeof error === "string" ? error : String(error);
          Toast.fire({
            icon: "error",
            title: errorMessage,
          });
          setError("Error al cargar los archivos del cliente");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFiles();
  }, [id]);

  // Función para manejar la selección del archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        Toast.fire({
          icon: "warning",
          title: "Por favor selecciona un archivo PDF",
        });
        return;
      }
      setFileToUpload(selectedFile);
    }
  };

  // Función para manejar la subida del archivo
  const handleFileUpload = async () => {
    if (!fileToUpload) {
      Toast.fire({
        icon: "warning",
        title: "Por favor selecciona un archivo",
      });
      return;
    }

    try {
      await uploadFileByClientId(id!, fileToUpload); // Subir archivo
      Toast.fire({
        icon: "success",
        title: "Archivo subido correctamente",
      });

      // Actualizar la lista de archivos después de la subida
      const clientFiles = await getAllFilesByClientId(id!);
      setFiles(clientFiles);
    } catch (error) {
      const errorMessage = typeof error === "string" ? error : String(error);
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    }
  };

  // Función para manejar la eliminación del archivo
  const handleDeleteFile = async (filePath: string) => {
    if (!id) return;

    try {
      await deleteFileByClientId(id, filePath);
      Toast.fire({
        icon: "success",
        title: "Archivo eliminado correctamente",
      });

      // Actualizar la lista de archivos después de eliminar
      const clientFiles = await getAllFilesByClientId(id);
      setFiles(clientFiles);
    } catch (error) {
      const errorMessage = typeof error === "string" ? error : String(error);
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    }
  };

  if (loading) {
    return <div>Cargando archivos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Función para manejar clic en archivo para previsualizar
  const handleFileClick = (file: string) => {
    const formattedUrl = API_URL.endsWith("/")
      ? `${API_URL}${file.slice(1)}`
      : `${API_URL}${file}`;
    setSelectedFile(formattedUrl);
  };

  //Funcion que simula el click del boton sustituyendo al input
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <span className="font-semibold text-[15px]">Archivos</span>
        <Button variant="primary" onClick={toggleActive}>
          Subir archivo
        </Button>
      </div>
        {/* Modal */}
          <Modal
            size="small"
            open={active}
            onClose={toggleActive}
            title="Seleccion de archivo"
            primaryAction={{
              content: 'Subir',
              onAction: async () => {
                await handleFileUpload();
                toggleActive();
              },              
            }}
            secondaryActions={[
              {
                content: 'Cancelar',
                onAction: toggleActive,
              },
            ]}
          >
            <Modal.Section>
              <LegacyStack vertical>                 
                  <div className="flex items-center justify-center">
                    <div className="border-dashed border-2 border-gray-400 p-16 m-2">
                      <Button variant="tertiary" onClick={handleButtonClick}>
                        Seleccionar archivo
                      </Button>                     
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange} 
                        accept="application/pdf"
                        style={{display:"none"}}
                      />
                    </div>                    
                  </div>                                                                         
              </LegacyStack>
            </Modal.Section>
          </Modal>
      <ul>
        {files.length > 0 ? (
          files.map((file, index) => (
            <li key={index}>
              {/* Al hacer clic en el nombre del archivo, se previsualiza */}
              <a
                href="#"
                onClick={() => handleFileClick(file)}
                className="text-blue-500 hover:underline"
              >
                {file.split("/").pop()}
              </a>
              {" - "}
              <a
                href={`${
                  API_URL.endsWith("/")
                    ? API_URL + file.slice(1)
                    : API_URL + file
                }`}
                download={file.split("/").pop()}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Descargar
              </a>
              <Button
                onClick={() => {
                  handleDeleteFile(file);
                }}
              >
                Eliminar
              </Button>
            </li>
          ))
        ) : (
          <li>No hay archivos disponibles.</li>
        )}
      </ul>

      {/* Previsualización del archivo PDF */}
      {selectedFile && (
        <div className="mt-4">
          <iframe
            src={selectedFile}
            width="100%"
            height="600px"
            title="Previsualización de PDF"
          ></iframe>
        </div>
      )}
      
    </div>
  );
}