import { useState, useEffect } from "react";
import { Button } from "@shopify/polaris";
import {
  getAllFilesByClientId,
  deleteFileByClientId,
} from "../../services/files";
import { Toast } from "../../components/Toast/toast";
import type { FilesData } from "../../services/files";
import ModalSubirArchivos from "../../components/Modales/ModalSubirArchivos";

const API_URL = import.meta.env.VITE_API_URL;

interface ArchivosProps {
  id?: string;
  isPayment?: boolean;
  setFinishLoading: (loading: boolean) => void;
  regimen?: string;
}

export default function Archivos({
  id,
  isPayment,
  setFinishLoading,
  regimen,
}: ArchivosProps) {
  const [files, setFiles] = useState<FilesData>({
    type_person: "",
    files_legal_extra: [],
    files_legal_fisica: [],
    files_legal_moral: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      if (id) {
        try {
          const response = await getAllFilesByClientId(id);
          // Aseguramos que los arrays siempre estén definidos
          setFiles({
            ...response,
            files_legal_extra: response.files_legal_extra || [],
            files_legal_fisica: response.files_legal_fisica || [],
            files_legal_moral: response.files_legal_moral || [],
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          Toast.fire({
            icon: "error",
            title: errorMessage,
          });
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFiles();
  }, [id]);

  const handleDeleteFile = async (filePath: string) => {
    if (!id) return;

    try {
      await deleteFileByClientId(id, filePath);
      Toast.fire({
        icon: "success",
        title: "Archivo eliminado correctamente",
      });
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

  const filesToDisplay = [
    ...files.files_legal_extra,
    ...(files.type_person === "MORAL"
      ? files.files_legal_moral
      : files.files_legal_fisica),
  ];

  const handleFileClick = (file: string) => {
    const formattedUrl = API_URL.endsWith("/")
      ? `${API_URL}${file.slice(1)}`
      : `${API_URL}${file}`;
    setSelectedFile(formattedUrl);
  };

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <span className="font-semibold text-[15px]">{`Archivos`}</span>
        <Button
          onClick={() => {
            if (regimen === null || regimen === "") {
              Toast.fire({
                icon: "error",
                title: "Primero debes de elegir el regimen del cliente",
              });
            } else {
              setIsOpen(true);
            }
          }}
        >
          Subir Archivo
        </Button>
      </div>

      <ul>
        {filesToDisplay.length > 0 ? (
          filesToDisplay.map((file, index) => (
            <li key={index}>
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

      {isOpen && (
        <ModalSubirArchivos
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setFinishLoading={setFinishLoading}
          id={id}
          isPayment={isPayment}
          regimen={regimen}
        />
      )}
    </div>
  );
}
