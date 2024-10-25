import { useState, useEffect } from "react";
import { Button } from "@shopify/polaris";
import {
  getAllFilesByClientId,
  uploadFileByClientId,
  deleteFileByClientId,
  uploadPaymentFileById,
} from "../../services/files";
import { Toast } from "../../components/Toast/toast";
import { useNavigate } from "react-router-dom";
import type { FilesData } from "../../services/files";

const API_URL = import.meta.env.VITE_API_URL;

interface ArchivosProps {
  id?: string;
  isPayment?: boolean;
  setFinishLoading: (loading: boolean) => void;
}

export default function Archivos({
  id,
  isPayment,
  setFinishLoading,
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
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      if (id) {
        try {
          const response = await getAllFilesByClientId(id);
          setFiles(response);
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

  const handleFileUpload = async () => {
    if (!fileToUpload) {
      Toast.fire({
        icon: "warning",
        title: "Por favor selecciona un archivo",
      });
      return;
    }

    try {
      if (isPayment) {
        const renamedFile = new File([fileToUpload], fileToUpload.name, {
          type: fileToUpload.type,
        });
        await uploadFileByClientId(id!, renamedFile);
      } else {
        const formData = new FormData();
        formData.append("archivo_pago", fileToUpload, "archivo_pago");
        await uploadPaymentFileById(id!, formData);
        navigate("/leads");
      }

      Toast.fire({
        icon: "success",
        title: "Archivo subido correctamente",
      });
      setFinishLoading(true);
    } catch (error) {
      setFinishLoading(true);
      const errorMessage = typeof error === "string" ? error : String(error);
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    }
  };

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
        <span className="font-semibold text-[15px]">Archivos</span>
        <Button variant="primary" onClick={handleFileUpload}>
          {isPayment ? "Subir archivo" : "Subir Pago"}
        </Button>
      </div>

      <input type="file" onChange={handleFileChange} accept="application/pdf" />
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
    </div>
  );
}
