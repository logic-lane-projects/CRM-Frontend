interface SendTemplateParams {
    to: string;
    of_name: string;
    template_number: number;
    client_name: string;
    seller_name: string;
    city:string
  }
  
  const APP_URL = import.meta.env.VITE_API_TWILIO_URL as string;
  
  export const sendTemplate = async ({
    client_name,
    seller_name,
    of_name,
    city,
    template_number,
    to,
  }: SendTemplateParams): Promise<void> => {
    const url = `${APP_URL}/send_template?To=${to}`;
    const body = {
      client_name: client_name,
      seller_name: seller_name,
      of_name: of_name,
      city: city,
      template_number: template_number.toString()
    };
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al enviar el correo");
    }
  };