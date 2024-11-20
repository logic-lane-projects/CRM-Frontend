import { useState, useEffect } from "react";

export default function Whatsapp({ phone }: { phone: string }) {
  type Message = {
    body: string;
    date_sent: string;
    from: string;
    media: string[];
    to: string;
  };

  const APP_TWILIO_URL = import.meta.env.VITE_API_TWILIO_URL;
  const PHONE_NUMBER = phone || "15951129872";

  const [messages, setMessages] = useState<Message[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [input, setInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [, setFileUrl] = useState("");

  const handleGetMessages = async () => {
    try {
      const response = await fetch(
        `${APP_TWILIO_URL}get_all_messages?number=${PHONE_NUMBER}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener mensajes.");
      }
      const data = await response.json();
      setMessages(data.messages as Message[]);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (messageBody: string, mediaUrl?: string[]) => {
    if (!PHONE_NUMBER || !messageBody.trim()) return;

    try {
      const response = await fetch(`${APP_TWILIO_URL}send_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          To: PHONE_NUMBER,
          Message: messageBody,
          Media_Url: mediaUrl || [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido");
      }

      setInput("");
      handleGetMessages();
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Selecciona un archivo para subir.");
      return;
    }

    setUploadStatus("Subiendo archivo...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${APP_TWILIO_URL}upload_file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al subir el archivo");

      const data = await response.json();
      setFileUrl(data.file_url);
      setUploadStatus("Archivo subido exitosamente.");

      // Enviar el archivo como mensaje después de subirlo
      handleSendMessage(`Te envío un archivo: ${data.file_url}`, [data.file_url]);
    } catch (error) {
      setUploadStatus("Error al subir el archivo.");
      console.error("Error uploading file:", error);
    }
  };

  useEffect(() => {
    handleGetMessages();
  }, []);

  return (
    <div className="flex flex-col h-[400px] w-full border border-gray-300 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-[15px] mb-2">Whatsapp Chat</h2>
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(messages)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "message_history.json";
            a.click();
          }}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded cursor-pointer"
        >
          Descargar Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-2 bg-gray-100 p-2 rounded">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-1 rounded ${
                msg.from.includes(PHONE_NUMBER)
                  ? "bg-gray-300 mr-4"
                  : "bg-green-500 text-white ml-4"
              }`}
            >
              <p>{msg.body}</p>
              {msg.media && msg.media.length > 0 && (
                <div className="mt-2">
                  {msg.media.map((mediaUrl, mediaIndex) => (
                    <a
                      key={mediaIndex}
                      href={`${APP_TWILIO_URL}${mediaUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Ver archivo
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay mensajes disponibles.</p>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={() => handleSendMessage(input)}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Enviar
        </button>
        <div>
          <label className="block">Selecciona un archivo:</label>
          <input type="file" onChange={handleFileChange} className="mb-1" />
          <button
            onClick={handleUpload}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Subir
          </button>
          <p>{uploadStatus}</p>
        </div>
      </div>
    </div>
  );
}
