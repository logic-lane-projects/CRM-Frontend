import { useState, useEffect } from "react";

export default function Whatsapp({phone}: {phone: string}) {
  type Message = {
    body: string;
    date_sent: string;
    from: string;
    media: string[];
    to: string;
  };

const APP_URL = import.meta.env.VITE_API_URL;
const APP_TWILIO_URL = import.meta.env.VITE_API_TWILIO_URL
  const PHONE_NUMBER = phone ?? "15951129872";
  const [messages, setMessages] = useState<Message[]>([]);
  const [file, setFile] = useState(null);
  const [input, setInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const handleGetMessages = async () => {
    try {
      const response = await fetch(`${APP_TWILIO_URL}get_all_messages?number=${PHONE_NUMBER}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data.messages)
      setMessages(data.messages as Message[]);
    } catch (error) {
      console.error("Error fetching messages:", error); 
    }
  }

  const handleSendMessage = async () => {
    try {
      const response = await fetch(`${APP_TWILIO_URL}send_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to_number: PHONE_NUMBER,
          message_body: input,
          media_url: fileUrl !== '' ? [fileUrl] : []
        }),
      });


      console.log(response)

    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  useEffect(() => {
    handleGetMessages()
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setInput(e.target.files[0].name);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Selecciona un archivo para subir.');
      return;
    }
    setUploadStatus('Subiendo archivo...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${APP_TWILIO_URL}upload_file`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir el archivo');

      const data = await response.json();
      setFileUrl(data.file_url); // Supongamos que el backend devuelve la URL del archivo subido
      setUploadStatus('Archivo subido exitosamente.');
    } catch (error) {
      setUploadStatus('Error al subir el archivo.');
      console.error('Error al subir el archivo:', error);
    }
  };

  
  
  const sendMessage = (message: string) => {
    fetch(`${APP_URL}send_message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: PHONE_NUMBER,
        message: message,
        role: "seller",
      }),
    });
  };
  
  return (
    <div className="flex flex-col h-[400px] w-full border border-gray-300 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-[15px] mb-2">Whatsapp Chat</div>
        <a className="bg-gray-200 hover:bg-gray-300 p-2 rounded cursor-pointer" href="/message_history.json" download="message_history.json">Descargar Chat</a>
      </div>
      <div className="flex-1 overflow-y-auto mb-2 bg-gray-100 p-2 rounded">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded ${
              msg.from.includes(PHONE_NUMBER) ? "bg-gray-300 mr-4" : "bg-green-500 text-white ml-4"
            }`}
          >
            {msg.body}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Enviar
        </button>

        <button className="bg-blue-500 text-white rounded px-2 hover:bg-blue-600">Enviar Archivos</button>
        <div>
        <label>Selecciona un archivo:</label>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Subir Archivo</button>
        <p>{uploadStatus}</p>
      </div>
      </div>
    </div>
  );
}
