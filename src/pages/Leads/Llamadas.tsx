import { useState } from 'react';
import { PhoneIcon } from "@shopify/polaris-icons";
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

function Llamadas({phone, historial,idLead}: {phone? : string, historial?: CallsHistorial|null, idLead:string|undefined}) {
  const [seleted, setSelected] = useState<HistorialCalls|null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const telefonoOficinaActual = localStorage.getItem("telefonoOficinaActual");


  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  }

  const handleToneBadge = (status: string) => {
    if(status == "completed") return "success";
    if(status == "no-answer") return "attention";
    if(status == "busy") return "warning";
    return "info"
  }

  const handleTranslateStatus = (status: string) => {
    if(status == "completed") return "Finalizada";
    if(status == "no-answer") return "No respondió";
    if(status == "busy") return "Ocupado";
    return status
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
                  <div key={`llamada-${idx}`} className="flex w-full h-full items-start gap-2 relative -mt-0.5">
                    <span className="font-bold text-md text-[#656463] w-full max-w-[90px]">
                      {FormatDateHistory(date)}
                    </span>
                    <div className="w-3 h-3 rounded-full bg-[#656463] border-2 border-[#E9E9E9] mt-1 z-[1]" />
                    <div className="w-1 h-full bg-[#E9E9E9] rounded-full absolute left-[102px] top-1"/>
                    <div className="w-fit flex flex-col gap-0 pb-2">
                      <p className="text-[12px] font-bold text-[#656463]">
                        Número: {item.client_number}
                      </p>
                      <p className="text-[11px] font-normal">
                      <b>Hora: </b>{time} hrs. 
                      </p>
                      <p className="text-[11px] font-normal">
                        <b>Duración: </b>{item.durantions_in_seconds}s
                      </p>
                      <p className="text-[11px] font-normal">
                        <b>Estatus: </b>
                        <Badge 
                          tone={handleToneBadge(String(item.status_calls))}
                          size="small"
                        >
                          {handleTranslateStatus(String(item.status_calls))}
                        </Badge>
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
          <div className="font-semibold text-[15px]">Historial de llamadas</div>
          <Button
            target='_blank'
            icon={PhoneIcon}
            variant='primary'
            url={`https://fiftydoctorsback.com/crmtwilio/?of_num=${telefonoOficinaActual}&to=${phone}&ident=crm_${idLead}`}
          >
            Llamar
          </Button>
        </div>
        { (historial && historial != null) && (
          <ResourceList
            resourceName={{singular: 'customer', plural: 'customers'}}
            items={historial.history_calls}
            pagination={{
              hasNext: false,
              onNext: () => {},
            }}
            emptyState={<p className="px-2 py-3">Aún no hay historial</p>}
            renderItem={(item, idx) => {
              const { calls } = item;
              const media = <Icon source={PhoneIcon} />;
              const { date } = SplitDateTime(item.day);

              return (
                <ResourceItem
                  id={idx}
                  media={media}
                  url="#"
                  accessibilityLabel={`Ver detalles del ${date}`}
                  shortcutActions={[
                    { content: "Ver llamadas", onAction: () => {
                      setSelected(item);
                      setOpen(true);
                    }, accessibilityLabel: `Ver detalles del ${date}`},
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

export default Llamadas;
