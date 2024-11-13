import { useState, useEffect } from "react";

export default function Whatsapp({phone}: {phone: string}) {
  type Message = {
    role: string;
    text: string;
    sender: "user" | "whatsapp";
  };
const APP_URL = import.meta.env.VITE_API_URL;
  const PHONE_NUMBER = phone ?? "15951129872";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${APP_URL}messages`)
        .then(response => response.json())
        .then(data => {
          // Verifica que data.messages sea un array
          if (Array.isArray(data.messages)) {
            setMessages(data.messages);
          } else {
            setMessages([]); // Asegura que messages sea un array
          }
        })
        .catch(error => {
          console.error("Error al obtener mensajes:", error);
          setMessages([]); // Asegura que messages sea un array en caso de error
        });
    }, 3000); // Cada 3 segundos
  
    return () => clearInterval(interval); // Limpiar el interval cuando el componente se desmonta
  }, []);
  

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, {
        text: input, sender: "user",
        role: ""
      }]);
      setInput("");

      // Enviar el mensaje al servidor
      sendMessage(input);
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
      <div className="font-semibold text-[15px] mb-2">Whatsapp Chat</div>
      
      <div className="flex-1 overflow-y-auto mb-2 bg-gray-100 p-2 rounded">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded ${
              msg.role === "seller" ? "bg-green-500 text-white" : "bg-gray-300"
            }`}
          >
            {msg.text}
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
          className="p-2 bg-green-500 text-white rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
