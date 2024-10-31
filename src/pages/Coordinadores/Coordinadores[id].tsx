import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  updateCoordinator,
  findCoordinatorById,
} from "../../services/coordinadores";
import { Toast } from "../../components/Toast/toast";
import { Button, Card, TextField, Modal } from "@shopify/polaris";

export default function InfoCoordinador() {
  const { id } = useParams<{ id: string }>();
  //   const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para los campos del formulario
  const [name, setName] = useState<string>("");
  const [paternalSurname, setPaternalSurname] = useState<string>("");
  const [maternalSurname, setMaternalSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cellphone, setCellphone] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [oficina, setOficina] = useState<string>("");
  const [role, setRole] = useState<string>("COORIDINADOR");

  useEffect(() => {
    const fetchCoordinator = async () => {
      try {
        setLoading(true);
        if (id) {
          const fetchedCoordinator = await findCoordinatorById(id);

          if (fetchedCoordinator && fetchedCoordinator.result) {
            const coordinator = fetchedCoordinator.data;
            setName(coordinator.name);
            setPaternalSurname(coordinator.paternal_surname);
            setMaternalSurname(coordinator.maternal_surname);
            setEmail(coordinator.email);
            setCellphone(coordinator.cellphone);
            setCity(coordinator.city);
            setState(coordinator.state);
            setOficina(coordinator.oficina);
            setRole(coordinator.role);
          } else {
            setError("No se encontró el coordinador.");
          }
        } else {
          setError("ID no proporcionado.");
        }
      } catch (error) {
        setError("Error al obtener la información del coordinador.");
        Toast.fire({
          icon: "error",
          title: error instanceof Error ? error.message : String(error),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinator();
  }, [id]);

  const handleSave = async () => {
    if (id) {
      setIsSaving(true);
      try {
        const updatedCoordinator = await updateCoordinator(id, id, {
          name,
          paternal_surname: paternalSurname,
          maternal_surname: maternalSurname,
          email,
          cellphone,
          city,
          state,
          oficina,
          role,
        });

        if (updatedCoordinator && updatedCoordinator.result) {
          Toast.fire({
            icon: "success",
            title: "Coordinador actualizado con éxito",
          });
        } else {
          throw new Error("Error al actualizar el coordinador.");
        }
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: error instanceof Error ? error.message : String(error),
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (loading) {
    return <p>Cargando información del Coordinador...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Card>
        <h2 className="pt-5 pb-10 text-center font-bold text-lg">
          Información del Coordinador
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
            disabled
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
          <p className="font-bold">Estado:</p>
          <TextField
            value={state}
            onChange={(value) => setState(value)}
            label=""
            autoComplete="off"
          />
        </div>
        <div className="p-2 grid grid-cols-3">
          <p className="font-bold">Oficina:</p>
          <TextField
            value={oficina}
            onChange={(value) => setOficina(value)}
            label=""
            autoComplete="off"
          />
        </div>
        <div className="flex w-full justify-between max-w-[200px] ml-auto">
          <Button onClick={handleSave} loading={isSaving} variant="primary">
            Guardar cambios
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>Eliminar</Button>
        </div>
      </Card>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmar eliminación"
        primaryAction={{
          content: "Aceptar",
          onAction: () => {}, 
          destructive: true,
        }}
        secondaryActions={[
          {
            content: "Cancelar",
            onAction: () => setIsModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <p>¿Deseas eliminar a este coordinador?</p>
        </Modal.Section>
      </Modal>
    </div>
  );
}
