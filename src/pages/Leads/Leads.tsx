import { Button } from "@shopify/polaris";

export default function Leads() {
  return (
    <div>
      <div className="flex items-center">
        <span className="font-semibold text-[20px]">Leads</span>
        <div className="ml-3">
          <Button variant="primary">Registrar</Button>
        </div>
      </div>
    </div>
  );
}
