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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  //Modal para la confirmacion de eliminación de usuario
  const handleDelete = () => {
    console.log(`Eliminando usuario con ID: ${id}`);
    setIsModalOpen(false);
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

  return (
    <div>
      {user ? (
        <Card>
          <h2 className="pt-5 pb-10 text-center font-bold text-lg">Información del Vendedor</h2>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Nombre:</p>
            <p>{user.name}</p>            
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Apellido Paterno:</p>
            <p>{user.paternal_surname}</p>            
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Apellido Materno:</p>
            <p>{user.maternal_surname}</p>
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Email:</p>
            <p>{user.email}</p>
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Teléfono:</p>
            <p>{user.cellphone}</p>
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Ciudad:</p>
            <p>{user.city}</p>
          </div>
          <div className="p-2 grid grid-cols-3">
            <p className="font-bold">Rol:</p>
            <p>{user.role}</p>
          </div>
          <div className="p-3 flex justify-end ">
            <div className="bg-red-600 w-fit p-1 rounded-md text-white px-3 mt-1 text-center">
              <Button onClick={()=>
                  setIsModalOpen(true)
              } variant="monochromePlain">Eliminar</Button>
            </div>
          </div>          
        </Card>
      ) : (
        <p>No se encontró el vendedor.</p>
      )}
      {
        isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="mt-2 text-base">¿Deseas eliminar a este vendedor?</p>
              <div className="mt-5 flex justify-end">
                <div className="flex justify-center">
                  <Button onClick={cancelDelete} variant="primary" tone="critical">
                  Cancelar
                  </Button>
                </div>
                <div className="flex justify-center pl-5">
                  <Button onClick={handleDelete} variant="primary" tone="success">
                  Aceptar
                  </Button>
                </div>
                
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}
