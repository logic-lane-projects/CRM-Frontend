import { PageDownIcon, AttachmentFilledIcon } from "@shopify/polaris-icons";
import { SplitDateTime, FormatTime } from "../../utils/functions";
import { Box, Button, Tooltip, Modal } from "@shopify/polaris";
import { useState, useEffect, useRef } from "react";

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

  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if(messages && messages.length > 0){
      if(messagesEndRef.current){
        const scrollContainer = messagesEndRef.current;
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }
  }, [messagesEndRef, messages]);

  return (
    <div className="flex flex-col w-full rounded-lg gap-0">
      <div className="flex items-center justify-between px-3 py-2">
        <h2 className="font-semibold text-[15px]">Whatsapp Chat</h2>
        <Button
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
          variant="primary"
          icon={PageDownIcon}
        >
          Descargar Chat
        </Button>
      </div>

      <Box background="bg-surface-secondary" paddingInline={'0'} paddingBlock={'400'}>
        <div className="px-4 flex flex-col gap-2">
          <div className="flex flex-col gap-1 overflow-y-scroll h-[300px] px-2 py-2 relative" ref={messagesEndRef}>
            {messages.length > 0 ? (
              messages.map((msg, index) => {
                const { time } = SplitDateTime(msg.date_sent)
                return(
                <div
                  key={index}
                  className={`w-full flex flex-col ${
                    msg.from.includes(PHONE_NUMBER)
                      ? "justify-start items-start"
                      : "justify-end items-end"
                  }`}
                >
                  <div
                    className={`p-2 w-fit max-w-[80%] ${
                      msg.from.includes(PHONE_NUMBER)
                        ? "bg-gray-300 left-0 rounded-r-lg rounded-t-lg"
                        : "bg-green-500 text-white right-0 rounded-l-lg rounded-t-lg"
                    }`}
                  >
                    {msg.media && msg.media.length > 0 && (
                      <div className={`w-full grid ${msg.media.length > 3 ? 'grid-cols-4' : 'grid-cols-1'}`}>
                        {msg.media.map((mediaUrl, mediaIndex) => (
                          <img
                            key={mediaIndex}
                            src={`${APP_TWILIO_URL}${mediaUrl}`}
                            alt={`media chat ${mediaIndex}`}
                            className="w-full h-auto object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )}
                    <p>{msg.body}</p>
                  </div>
                  <span className="text-[11px] font-normal">{FormatTime(time)} hrs.</span>
                </div>
              )})
            ) : (
              <p>No hay mensajes disponibles.</p>
            )}
          </div>
          <div className="bg-white w-full flex items-center gap-2 rounded-lg border border-[#E9E9E9] px-2 py-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje"
              className="flex-1 w-full p-2 bg-transparent"
            />
            <Tooltip content="Agregar archivo">
              <div className="[&_button]:bg-[#E9E9E9] flex justify-center items-center">
                <Button
                  icon={AttachmentFilledIcon}
                  variant="tertiary"
                />
              </div>
            </Tooltip>
            <button
              onClick={() => handleSendMessage(input)}
              className="px-4 py-1 bg-green-500 text-white transition-all duration-200 rounded-md hover:bg-green-600"
            >
              Enviar
            </button>
          </div>
        </div>
      </Box>

      {/* <div className="flex gap-2 items-center px-3 py-2">
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
      </div> */}
    </div>
  );
}
