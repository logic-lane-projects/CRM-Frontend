import { useState, useEffect } from "react";

export default function Whatsapp() {
  type Message = {
    text: string;
    sender: "user" | "whatsapp";
  };

  const PHONE_NUMBER = "15951129872";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Polling para obtener mensajes nuevos
    const interval = setInterval(() => {
      fetch("http://localhost:9292/messages")
        .then(response => response.json())
        .then(data => {
          setMessages(data.messages);
        });
    }, 3000); // Cada 3 segundos

    return () => clearInterval(interval); // Limpiar el interval cuando el componente se desmonta
  }, []);

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");

      // Enviar el mensaje al servidor
      sendMessage(input);
    }
  };

  const sendMessage = (message: string) => {
    fetch(`http://localhost:9292/send_message`, {
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
        {messages.map((msg, index) => (
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
