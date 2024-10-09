import { Button } from "@shopify/polaris";
import ModalRegistroUsuarios from "../../components/Modales/ModalRegistroUsuarios";
import { useState } from "react";

export default function Usuarios() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="">
      <div className="flex w-full justify-between items-center">
        <span className="font-semibold text-[20px]">Usuarios</span>
        <div className="ml-[100px]">
          <Button
            onClick={() => {
              setIsOpen(true);
            }}
            variant="primary"
          >
            Registro
          </Button>
        </div>
      </div>
      {isOpen && (
        <ModalRegistroUsuarios isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
}
