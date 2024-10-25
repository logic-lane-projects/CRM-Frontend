import { useState } from "react";
import { Modal, TextContainer } from "@shopify/polaris";
import { Toast } from "../../components/Toast/toast";
import {
  uploadFileByClientId,
  uploadPaymentFileById,
} from "../../services/files";
import { useNavigate } from "react-router-dom";

interface ModalArchivos {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  id?: string;
  isPayment?: boolean;
  setFinishLoading: (loading: boolean) => void;
}

export default function ModalSubirArchivos({
  isOpen,
  setIsOpen,
  id,
  isPayment,
  setFinishLoading,
}: ModalArchivos) {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const navigate = useNavigate();

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
      setIsOpen(false); // Cierra el modal después de la subida
    } catch (error) {
      setFinishLoading(true);
      const errorMessage = typeof error === "string" ? error : String(error);
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="Sube un archivo"
      primaryAction={{
        content: isPayment ? "Subir Pago" : "Subir Archivo",
        onAction: handleFileUpload,
      }}
      secondaryActions={[
        {
          content: "Cancelar",
          onAction: () => setIsOpen(false),
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <p>Selecciona el archivo PDF que deseas subir.</p>
          <input
            type="file"
            onChange={handleFileChange}
            accept="application/pdf"
          />
        </TextContainer>
      </Modal.Section>
    </Modal>
  );
}
