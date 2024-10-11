import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById, User } from "../../services/users";
import { Toast } from "../../components/Toast/toast";
import { Button, Card } from "@shopify/polaris";

export default function InfoVendedores() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if (id) {
          const fetchedUser = await getUserById(id);
          setUser(fetchedUser);
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

  if (loading) {
    return <p>Cargando información del vendedor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {user ? (
        <Card>
          <h2>Información del Vendedor</h2>
          <p>
            <strong>Nombre:</strong> {user.name}
          </p>
          <p>
            <strong>Apellido Paterno:</strong> {user.paternal_surname}
          </p>
          <p>
            <strong>Apellido Materno:</strong> {user.maternal_surname}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {user.cellphone}
          </p>
          <p>
            <strong>Ciudad:</strong> {user.city}
          </p>
          <p>
            <strong>Rol:</strong> {user.role}
          </p>
          <div className="bg-red-600 w-fit p-1 rounded-md text-white px-3 mt-1">
            <Button onClick={()=>{
                alert("Borrar")
            }} variant="monochromePlain">Eliminar</Button>
          </div>
        </Card>
      ) : (
        <p>No se encontró el vendedor.</p>
      )}
    </div>
  );
}
