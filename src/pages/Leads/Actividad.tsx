import type { CallsHistorial, HistorialCalls } from "../../services/historial";
import { 
  Button, 
  ResourceList, 
  ResourceItem, 
  Text, 
  Icon, 
  Bleed, 
  Modal,
  Badge,
} from "@shopify/polaris";
import { SplitDateTime, FormatDate, FormatDateHistory } from "../../utils/functions";
import { PhoneIcon } from "@shopify/polaris-icons";
import { useState } from "react";

export default function Actividad({ historial }: { historial: CallsHistorial|null }) {
  const [seleted, setSelected] = useState<HistorialCalls|null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  }

  return (
    <Bleed marginInline="0">
      {open && (
        <Modal
          title="Detalle de la llamadas"
          open={open}
          onClose={handleClose}
        >
          <Modal.Section>
            {seleted !== null && (
              <div className="w-full flex flex-col gap-2">
                <Text variant="headingMd" as="h3">
                  Fecha: {seleted.day}
                </Text>
                <div className="w-full relative flex flex-col py-2">
                {seleted.calls.map((item, idx) => {
                  const { date, time } = SplitDateTime(item.date_call);
                  return(
                  <div key={`llamada-${idx}`} className="flex w-full items-start gap-3 relative -mt-0.5">
                    <span className="font-bold text-md text-[#656463]">
                      {FormatDateHistory(date)}
                    </span>
                    <div className="w-3 h-3 rounded-full bg-[#656463] border-2 border-[#E9E9E9] mt-1 z-[1]" />
                    <div className="w-1 h-full bg-[#E9E9E9] absolute left-[97px] top-1 rounded-full"/>
                    <div className="w-fit flex flex-col gap-0 pb-2">
                      <p className="text-[12px] font-bold text-[#656463]">
                        Número: {item.client_number}
                      </p>
                      <p className="text-[11px] font-normal">
                        {time} hrs. 
                      </p>
                      <p className="text-[11px] font-normal">
                        <b>Duración: </b>{item.durantions_in_seconds}s
                      </p>
                      <p className="text-[11px] font-normal">
                        <b>Estatus: </b><Badge tone="success">{String(item.status_calls)}</Badge>
                      </p>
                    </div>
                  </div>
                  )}
                )}
                </div>
              </div>
            )}
          </Modal.Section>
        </Modal>
      )}
      <div className="flex flex-col justify-between">
        <div className="flex justify-between px-3 py-2">
          <div className="font-semibold text-[15px]">Actividad Reciente</div>
          <Button variant="primary">Crear</Button>
        </div>
        { historial != null && (
          <ResourceList
          resourceName={{singular: 'customer', plural: 'customers'}}
          items={historial.history_calls}
          pagination={{
            hasNext: false,
            onNext: () => {},
          }}
          renderItem={(item, idx) => {
            const { calls } = item;
            const media = <Icon source={PhoneIcon} />;
            const { date } = SplitDateTime(item.day);

            return (
              <ResourceItem
                id={idx}
                media={media}
                url="#"
                accessibilityLabel={`View details for ${date}`}
                shortcutActions={[
                  { content: "Ver llamadas", onAction: () => {
                    setSelected(item);
                    setOpen(true);
                  }, accessibilityLabel: `View`, variant: "tertiary"},
                ]}
              >
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                  {FormatDate(date)}
                </Text>
                <span className="text-[15px]">{calls.length} llamadas</span>
              </ResourceItem>
            );
          }}
        />
        )}
      </div>
    </Bleed>
  );
}
