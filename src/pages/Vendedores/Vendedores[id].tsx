import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserById,
  updateUser,
  deleteUser,
  User,
} from "../../services/users";
import { Toast } from "../../components/Toast/toast";
import { Button, Card, TextField, Modal, Select } from "@shopify/polaris";
import { UserRole } from "../../types/enums";

export default function InfoVendedores() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Para el estado de guardado

  // Manejando el estado de cada campo
  const [name, setName] = useState<string>("");
  const [paternalSurname, setPaternalSurname] = useState<string>("");
  const [maternalSurname, setMaternalSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cellphone, setCellphone] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [role, setRole] = useState<string>(UserRole.Vendedor); // Estado inicial para el rol

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if (id) {
          const fetchedUser = await getUserById(id);
          setUser(fetchedUser);
          // Actualizando los valores en los campos controlados
          setName(fetchedUser.name);
          setPaternalSurname(fetchedUser.paternal_surname);
          setMaternalSurname(fetchedUser.maternal_surname);
          setEmail(fetchedUser.email);
          setCellphone(fetchedUser.cellphone);
          setCity(fetchedUser.city);
          setRole(fetchedUser.role); // Actualizar el estado del rol
        } else {
          setError("ID no proporcionado.");
        }
      } catch (error) {
        setError("Error al obtener la información del vendedor.");
        const errorMessage = typeof error === "string" ? error : String(error);
        Toast.fire({
          icon: "error",
          title: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Función para actualizar el usuario
  const handleSave = async () => {
    if (id && user) {
      setIsSaving(true);
      try {
        const updatedUser = await updateUser(id, {
          name,
          paternal_surname: paternalSurname,
          maternal_surname: maternalSurname,
          email,
          cellphone,
          city,
          role,
        });

        setUser(updatedUser);

        Toast.fire({
          icon: "success",
          title: "Usuario actualizado con éxito",
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: error || "Error al actualizar el usuario",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Función para eliminar el usuario
  const handleDelete = async () => {
    if (id) {
      try {
        await deleteUser(id);
        Toast.fire({
          icon: "success",
          title: "Usuario eliminado con éxito",
        });
        setIsModalOpen(false);
        navigate("/vendedores"); // Redirige a la página de usuarios después de eliminar
      } catch (error) {
        const errorMessage = typeof error === "string" ? error : String(error);
        Toast.fire({
          icon: "error",
          title: errorMessage,
        });
      }
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <p>Cargando información del vendedor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Opciones para el Select de roles
  const roleOptions = [
    { label: "Vendedor", value: UserRole.Vendedor },
    { label: "Administrador", value: UserRole.Administrador },
  ];

  return (
    <div>
      {user ? (
        <Card>
          <h2 className="pt-5 pb-10 text-center font-bold text-lg">
            Información del Vendedor
          </h2>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Nombre:</p>
            <TextField
              value={name}
              onChange={(value) => setName(value)}
              label=""
              autoComplete="off"
            />
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Apellido Paterno:</p>
            <TextField
              value={paternalSurname}
              onChange={(value) => setPaternalSurname(value)}
              label=""
              autoComplete="off"
            />
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Apellido Materno:</p>
            <TextField
              value={maternalSurname}
              onChange={(value) => setMaternalSurname(value)}
              label=""
              autoComplete="off"
            />
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Email:</p>
            <TextField
              value={email}
              onChange={(value) => setEmail(value)}
              label=""
              type="email"
              autoComplete="off"
            />
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Teléfono:</p>
            <TextField
              value={cellphone}
              onChange={(value) => setCellphone(value)}
              label=""
              type="tel"
              autoComplete="off"
            />
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Ciudad:</p>
            <TextField
              value={city}
              onChange={(value) => setCity(value)}
              label=""
              autoComplete="off"
            />
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Rol:</p>
            <Select
              label=""
              options={roleOptions} // Opciones del select basadas en el enum
              value={role}
              onChange={(value) => setRole(value)} // Actualizar el rol seleccionado
            />
          </div>
          <div className="p-3 flex justify-end">
            <Button onClick={handleSave} loading={isSaving} variant="primary">
              Guardar cambios
            </Button>
            <div className="bg-red-600 w-fit p-1 rounded-md text-white px-3 mt-1 text-center ml-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="monochromePlain"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <p>No se encontró el vendedor.</p>
      )}
      <Modal
        open={isModalOpen}
        onClose={cancelDelete}
        title="Confirmar eliminación"
        primaryAction={{
          content: "Aceptar",
          onAction: handleDelete,
          destructive: true,
        }}
        secondaryActions={[
          {
            content: "Cancelar",
            onAction: cancelDelete,
          },
        ]}
      >
        <Modal.Section>
          <p>¿Deseas eliminar a este vendedor?</p>
        </Modal.Section>
      </Modal>
    </div>
  );
}
