import { useState, useEffect } from "react";
import Permissions from "../../utils/enumPerms";
import { Button } from "@shopify/polaris";
import { updatePermissions } from "../../services/user";
import { useAuthToken } from "../../hooks/useAuthToken";
import { Toast } from "../../components/Toast/toast";

interface PermisosUsuarioProps {
  user: { permisos?: string[], _id: string };
}

export default function PermisosUsuario({ user }: PermisosUsuarioProps) {
  const { userInfo } = useAuthToken();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(user.permisos ?? []);  // Cambio aquí
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

  useEffect(() => {
    setSelectedPermissions(user.permisos ?? []);  // Cambio aquí
  }, [user.permisos]);

  const handleCheckboxChange = (permission: string) => {
    setSelectedPermissions((prevSelected) => {
      const updatedPermissions = prevSelected.includes(permission)
        ? prevSelected.filter((item) => item !== permission)
        : [...prevSelected, permission];

      return updatedPermissions;
    });
  };

  const handleUpdatePermissions = async () => {
    if (!userInfo) {
      Toast.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha podido cargar la información del usuario.',
      });
      return;
    }

    setLoadingUpdate(true);

    try {
      const response = await updatePermissions(userInfo.id, user._id, selectedPermissions);

      if (response && response.result) {
        Toast.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Permisos actualizados con éxito',
          timer: 5000
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        const errorMessage = response?.error || 'Error al actualizar los permisos.';
        Toast.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          timer: 5000
        });
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar los permisos.',
        timer: 5000
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="flex flex-col justify-center mt-10">
      <span className="font-bold text-[20px]">Permisos del usuario</span>
      <ul className="mt-4">
        {Object.values(Permissions).map((permiso, index) => (
          <li key={index} className="text-lg flex items-center">
            <input
              type="checkbox"
              id={permiso}
              value={permiso}
              checked={selectedPermissions.includes(permiso)}
              onChange={() => handleCheckboxChange(permiso)}
              className="mr-2"
            />
            <label htmlFor={permiso}>{permiso}</label>
          </li>
        ))}
      </ul>

      <div className="flex justify-end mt-4">
        <Button
          variant="primary"
          onClick={handleUpdatePermissions}
          loading={loadingUpdate}
          disabled={loadingUpdate}
        >
          {loadingUpdate ? "Actualizando..." : "Actualizar permisos"}
        </Button>
      </div>
    </div>
  );
}
