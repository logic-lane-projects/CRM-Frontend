import React, { useState, useEffect } from "react";
import { Toast } from "../../components/Toast/toast";
import {
  createFolder,
  getAllFiles,
  deleteFolder,
} from "../../services/newFiles";
import {
  Button,
  Card,
  TextField,
  Modal,
  TextContainer,
  IndexTable,
  Tooltip,
} from "@shopify/polaris";
import ModalArchivosCarpetas from "../../components/Modales/ModalArchivosCarpetas";

import {
  FolderIcon,
  DeleteIcon,
  ViewIcon,
} from '@shopify/polaris-icons';

interface FolderData {
  _id: string;
  nombre_carpeta: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

const Archivos: React.FC = () => {
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [folderName, setFolderName] = useState<string>("");
  const [loadingFolders, setLoadingFolders] = useState<boolean>(false);
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [loadingDeleteFolderId, setLoadingDeleteFolderId] = useState<
    string | null
  >(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<FolderData | null>(null);

  useEffect(() => {
    fetchAllFolders();
  }, []);

  const fetchAllFolders = async () => {
    setLoadingFolders(true);
    try {
      const response = await getAllFiles();
      if (response.result && Array.isArray(response.data)) {
        setFolders(response.data);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se encontraron carpetas",
        });
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title:
          error instanceof Error
            ? error.message
            : "Error al obtener las carpetas",
      });
    } finally {
      setLoadingFolders(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName) {
      Toast.fire({
        icon: "warning",
        title: "Por favor asigna un nombre a la carpeta",
      });
      return;
    }

    const regex = /^[a-zA-Z0-9 ]*$/;
    if (!regex.test(folderName)) {
      Toast.fire({
        icon: "warning",
        title: "El nombre de la carpeta solo puede contener letras y números",
      });
      return;
    }

    setLoadingCreate(true);
    try {
      await createFolder(folderName);
      Toast.fire({
        icon: "success",
        title: "Carpeta creada exitosamente",
      });
      setFolderName("");
      fetchAllFolders();
    } catch (error) {
      Toast.fire({
        icon: "error",
        title:
          error instanceof Error
            ? error.message
            : "Error desconocido al crear la carpeta",
        timer: 5000,
      });
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleFolderNameChange = (value: string) => {
    const regex = /^[a-zA-Z0-9 ]*$/;
    if (regex.test(value)) {
      setFolderName(value);
    } else {
      Toast.fire({
        icon: "warning",
        title:
          "El nombre de la carpeta solo puede contener letras, números y espacios",
      });
    }
  };

  const confirmDeleteFolder = (folder: FolderData) => {
    setFolderToDelete(folder);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteFolder = async () => {
    if (!folderToDelete) return;

    setLoadingDeleteFolderId(folderToDelete._id);
    try {
      await deleteFolder(folderToDelete._id);
      Toast.fire({
        icon: "success",
        title: "Carpeta eliminada exitosamente",
      });
      fetchAllFolders();
      setIsDeleteModalOpen(false);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title:
          error instanceof Error
            ? error.message
            : "Error al eliminar la carpeta",
      });
    } finally {
      setLoadingDeleteFolderId(null);
    }
  };

  const handleViewFolder = (folder: FolderData) => {
    setSelectedFolder({ id: folder._id, name: folder.nombre_carpeta });
    setIsOpen(true);
  };

  const rowMarkup = folders.map((folder, index) => (
    <IndexTable.Row
      key={folder._id}
      id={folder._id}
      position={index}
    >
      <IndexTable.Cell className="w-full">
        <span>{folder.nombre_carpeta}</span>
      </IndexTable.Cell>
      <IndexTable.Cell className="max-w-[300px]">
        <div className="flex gap-3 items-center">
          <Tooltip content="Ver carpeta">
            <Button 
              onClick={() => handleViewFolder(folder)} 
              variant="tertiary"
              icon={ViewIcon}
            />
          </Tooltip>
          <Tooltip content="Eliminar carpeta">
            <Button
              icon={DeleteIcon}
              variant="tertiary"
              tone="critical"
              onClick={() => confirmDeleteFolder(folder)}
              loading={loadingDeleteFolderId === folder._id}
            />
          </Tooltip>
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ))

  return (
    <div className="w-full flex flex-col gap-4">
      <span className="font-semibold text-[20px]">Archivos</span>
      <Card padding={'0'}>
        <div className="flex flex-col px-2 py-2 border-b">
          <TextField
            label="Nombre de la carpeta"
            value={folderName}
            onChange={handleFolderNameChange}
            placeholder="Escribe el nombre de la carpeta"
            autoComplete="off"
            connectedRight={
              <Button
                onClick={handleCreateFolder}
                loading={loadingCreate}
                variant="primary"
                icon={FolderIcon}
              >
                Crear carpeta
              </Button>
            }
          />
        </div>

        <div className="w-full flex flex-col divide-y">
          <IndexTable
            resourceName={{ singular: "folder", plural: "folders" }}
            itemCount={folders.length}
            headings={[
              { title: "Nombre de carpeta" },
              { title: "Acciones" },
            ]}
            selectable={false}
            loading={loadingFolders}
            emptyState={<p>No hay carpetas disponibles</p>}
          >
            {rowMarkup}
          </IndexTable>
        </div>
      </Card>

      {isOpen && selectedFolder && (
        <ModalArchivosCarpetas
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          folder={selectedFolder}
        />
      )}

      {isDeleteModalOpen && folderToDelete && (
        <Modal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Eliminar carpeta"
          primaryAction={{
            content: "Eliminar",
            onAction: handleDeleteFolder,
            destructive: true,
            loading: loadingDeleteFolderId === folderToDelete._id,
          }}
          secondaryActions={[
            {
              content: "Cancelar",
              onAction: () => setIsDeleteModalOpen(false),
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <p>
                ¿Estás seguro que deseas eliminar la carpeta{" "}
                <strong>{folderToDelete.nombre_carpeta}</strong>? Todos los
                archivos internos serán eliminados permanentemente.
              </p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      )}
    </div>
  );
};

export default Archivos;
