interface SendTemplateParams {
    to: string;
    of_name: string;
    name_vendedor: string;
    template_number: number;
  }
  
  const APP_URL = import.meta.env.VITE_API_TWILIO_URL as string;
  
  export const sendTemplate = async ({
    to,
    of_name,
    name_vendedor,
    template_number,
  }: SendTemplateParams): Promise<void> => {
    const url = `${APP_URL}send_template?To=${encodeURIComponent(to)}&of_name=${encodeURIComponent(
      of_name
    )}&name_vendedor=${encodeURIComponent(name_vendedor)}&template_number=${encodeURIComponent(
      template_number
    )}`;
  
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al enviar el correo");
    }
  };
  