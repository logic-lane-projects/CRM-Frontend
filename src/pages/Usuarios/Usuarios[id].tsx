import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser, deleteUser, User } from "../../services/user";
import { Toast } from "../../components/Toast/toast";
import { Button, Card, TextField, Modal, Select } from "@shopify/polaris";
import { UserRole } from "../../types/enums";
import { Ciudades } from "../../utils/estados";
import PermisosUsuario from "./PermisosUsuario";
import OficinasPermitidas from "./OficinasPermitidas";

export default function InfoUsuarios() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [estados, setEstados] = useState<string[]>([]);
  const [ciudades, setCiudades] = useState<string[]>([]);

  const [name, setName] = useState<string>("");
  const [paternalSurname, setPaternalSurname] = useState<string>("");
  const [maternalSurname, setMaternalSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cellphone, setCellphone] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [role, setRole] = useState<string>(UserRole.Vendedor);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await getUserById(id);

          if (response.success && response.data) {
            setUser(response.data);
            setName(response.data.name);
            setPaternalSurname(response.data.paternal_surname);
            setMaternalSurname(response.data.maternal_surname);
            setEmail(response.data.email);
            setCellphone(response.data.cellphone);
            setCity(response.data.city);
            setState(response.data.state);
            setRole(response.data.role);
          } else {
            setError("No se pudo obtener la información del usuario.");
          }
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

  useEffect(() => {
    setEstados(Ciudades.map((item) => item.Estado));
  }, []);

  useEffect(() => {
    if (state) {
      const selectedEstado = Ciudades.find((item) => item.Estado === state);
      setCiudades(selectedEstado ? selectedEstado.Ciudad : []);
    }
  }, [state]);

  const handleSave = async () => {
    if (id && user) {
      setIsSaving(true);
      try {
        const response = await updateUser(id, {
          name,
          paternal_surname: paternalSurname,
          maternal_surname: maternalSurname,
          email,
          cellphone,
          city,
          state,
          role,
        });

        if (response.success && response.data) {
          setUser(response.data);
          Toast.fire({
            icon: "success",
            title: "Usuario actualizado con éxito",
          });
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          Toast.fire({
            icon: "error",
            title: response.message || "Error al actualizar el usuario",
          });
        }
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

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteUser(id);
        Toast.fire({
          icon: "success",
          title: "Usuario eliminado con éxito",
        });
        setIsModalOpen(false);
        navigate("/usuarios");
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

  const roleOptions = [
    { label: "Vendedor", value: UserRole.Vendedor },
    { label: "Administrador", value: UserRole.Administrador },
    { label: "Asignador", value: UserRole.Asignador },
    { label: "Coordinador", value: UserRole.Coordinador },
    { label: "Marketing", value: UserRole.Marketing },
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
              disabled
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
            <p className="font-bold">Estado:</p>
            <Select
              label=""
              options={estados.map((estado) => ({
                label: estado,
                value: estado,
              }))}
              value={state}
              onChange={(value) => setState(value)}
            />
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Ciudad:</p>
            <Select
              label=""
              options={ciudades.map((ciudad) => ({
                label: ciudad,
                value: ciudad,
              }))}
              value={city}
              onChange={(value) => setCity(value)}
            />
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Rol:</p>
            <Select
              label=""
              options={roleOptions}
              value={role}
              onChange={(value) => setRole(value)}
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
          <PermisosUsuario user={{ ...user, _id: user._id ?? "" }} />
          <OficinasPermitidas
            user={{
              ...user,
              _id: user?._id ?? "",
              oficinas_permitidas: user?.oficinas_permitidas ?? [],
            }}
          />
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
