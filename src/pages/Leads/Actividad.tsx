import { Button } from "@shopify/polaris";

export default function Actividad() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="font-semibold text-[15px]">Actividad Reciente</div>
        <Button variant="primary">Crear</Button>
      </div>
    </div>
  );
}
