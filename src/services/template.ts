interface SendTemplateParams {
    to: string;
    of_name: string;
    name_vendedor: string;
    template_number: number;
    client_name: string;
    full_name: string;
    city:string
  }
  
  const APP_URL = import.meta.env.VITE_API_TWILIO_URL as string;
  
  export const sendTemplate = async ({
    client_name,
    full_name,
    to,
    of_name,
    template_number,
    city
  }: SendTemplateParams): Promise<void> => {
    const url = `${APP_URL}send_template?To=${encodeURIComponent(to)}`;
    const body={
      client_name: client_name,
      full_name: full_name,
      of_name: of_name,
      city:city,
      template_number:template_number
    }
    console.log("info enviada",body)
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al enviar el correo");
    }
  };
  