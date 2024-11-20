import { Button } from "@shopify/polaris";

interface Call {
  client_number: string;
  date_call: string;
  durantions_in_seconds: string;
  status_calls: string;
  twilio_number: string;
}

export default function Actividad() {
  const history_calls: { calls: Call[]; day: string }[] = [
    {
        "calls": [
            {
                "client_number": "+525951129872",
                "date_call": "Wed, 13 Nov 2024 23:13:34 GMT",
                "durantions_in_seconds": "27",
                "status_calls": "completed",
                "twilio_number": "+14695356917"
            },
            {
                "client_number": "+525951129872",
                "date_call": "Wed, 13 Nov 2024 22:44:28 GMT",
                "durantions_in_seconds": "8",
                "status_calls": "completed",
                "twilio_number": "+14695356917"
            },
            {
                "client_number": "+525951129872",
                "date_call": "Wed, 13 Nov 2024 05:33:19 GMT",
                "durantions_in_seconds": "0",
                "status_calls": "no-answer",
                "twilio_number": "+14695356917"
            },
            {
                "client_number": "+525951129872",
                "date_call": "Wed, 13 Nov 2024 01:55:59 GMT",
                "durantions_in_seconds": "0",
                "status_calls": "busy",
                "twilio_number": "+14695356917"
            }
        ],
        "day": "Wed, 13 Nov 2024 00:00:00 GMT"
    },
    {
        "calls": [
            {
                "client_number": "+525951129872",
                "date_call": "Tue, 12 Nov 2024 23:42:12 GMT",
                "durantions_in_seconds": "0",
                "status_calls": "busy",
                "twilio_number": "+14695356917"
            },
            {
                "client_number": "+525951129872",
                "date_call": "Tue, 12 Nov 2024 23:40:58 GMT",
                "durantions_in_seconds": "7",
                "status_calls": "completed",
                "twilio_number": "+14695356917"
            },
            {
                "client_number": "+525951129872",
                "date_call": "Tue, 12 Nov 2024 23:40:02 GMT",
                "durantions_in_seconds": "21",
                "status_calls": "completed",
                "twilio_number": "+14695356917"
            }
        ],
        "day": "Tue, 12 Nov 2024 00:00:00 GMT"
    },
    {
        "calls": [
            {
                "client_number": "+525951129872",
                "date_call": "Thu, 07 Nov 2024 02:55:55 GMT",
                "durantions_in_seconds": "80",
                "status_calls": "completed",
                "twilio_number": "+14695356917"
            }
        ],
        "day": "Thu, 07 Nov 2024 00:00:00 GMT"
    },
    {
        "calls": [
            {
                "client_number": "+525951129872",
                "date_call": "Fri, 25 Oct 2024 03:56:48 GMT",
                "durantions_in_seconds": "33",
                "status_calls": "completed",
                "twilio_number": "+14695356917"
            }
        ],
        "day": "Fri, 25 Oct 2024 00:00:00 GMT"
    }
]
  return (
    <div>
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="font-semibold text-[15px]">Actividad Reciente</div>
          <Button variant="primary">Crear</Button>
        </div>
        {
          history_calls.map((item, index) => (
            <div key={index} className="flex flex-col justify-between mt-2">
              <div className="font-semibold text-[15px]">{item.day}</div>
              <div className="text-[15px]">{item.calls.length} llamadas</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
