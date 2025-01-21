interface SendTemplateParams {
  to: string;
  client_name?: string;
  seller_name?: string;
  seller_position?: string;
  of_name?: string;
  city?: string;
  state?: string;
  project_name?: string;
  template_number?: string;
  img_name?: string;
}

const APP_URL = import.meta.env.VITE_API_TWILIO_URL as string;

export const sendTemplate = async ({
  to,
  client_name,
  seller_name,
  seller_position,
  of_name,
  city,
  state,
  project_name,
  img_name,
  template_number,
}: SendTemplateParams): Promise<void> => {
  const url = `${APP_URL}/send_template?To=${to}`;
  const body = {
    client_name,
    seller_name,
    seller_position,
    of_name,
    city,
    state,
    project_name,
    img_name,
    template_number,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al enviar el correo");
  }
};
