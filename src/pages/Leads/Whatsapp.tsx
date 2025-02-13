import ModalArchivosCarpetas from "../../components/Modales/ModalArchivosCarpetasWhatsapp";
import { PageDownIcon, AttachmentFilledIcon } from "@shopify/polaris-icons";
import { SplitDateTime, FormatTime } from "../../utils/functions";
import { Box, Button, Tooltip } from "@shopify/polaris";
import { getAllFiles } from "../../services/newFiles";
import { Toast } from "../../components/Toast/toast";
import { useState, useEffect, useRef } from "react";
import {
  FolderIcon,
  PauseCircleIcon,
  PlayIcon,
  DeleteIcon,
} from "@shopify/polaris-icons";
import { PDFFileIcon } from "../../components/icons";
import { RefreshIcon } from "@shopify/polaris-icons";
import AudioRecorderComponent from "../../components/RecordAudio/record-audio";
import * as XLSX from "xlsx";

import { io } from "socket.io-client";
import TemplatesWhats from "../../components/Templates/TemplatesWhats";
const APP_TWILIO_URL = import.meta.env.VITE_API_TWILIO_URL;
const socket = io(`${APP_TWILIO_URL}/`);

export interface FolderData {
  _id: string;
  nombre_carpeta: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export default function Whatsapp({ phone ,leadData}: { phone: string,leadData:any }) {
  type Message = {
    body: string;
    date_sent: string;
    from: string;
    media: string[];
    to: string;
  };

  const PHONE_NUMBER = phone || "15951129872";

  const [messages, setMessages] = useState<Message[]>([]);
  const clientMessages = messages.filter((message) =>
    message.from.includes(PHONE_NUMBER)
  );
  const lastMessage =
    clientMessages.length > 0
      ? clientMessages.sort(
          (a, b) =>
            new Date(b.date_sent).getTime() - new Date(a.date_sent).getTime()
        )[0]
      : null;

  let hasPassed23Hours = false;

  if (lastMessage) {
    const lastMessageDate = new Date(lastMessage.date_sent);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - lastMessageDate.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff >= 24) {
      hasPassed23Hours = true;
    }
  }

  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [openArchivos, setOpenArchivos] = useState<boolean>(false);
  const [loadingFolders, setLoadingFolders] = useState<boolean>(false);
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [fileSelected, setFileSelected] = useState<string[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (audioPlayer.current) {
      const player = audioPlayer.current;
      if (player.paused) {
        player.play();
        setIsPlaying(true);
      } else {
        player.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleGetMessages = async () => {
    try {
      const response = await fetch(
        `${APP_TWILIO_URL}get_all_messages?number=${PHONE_NUMBER}`
      );
      if (!response.ok) {
        setMessages([]);
        throw new Error("Error al obtener mensajes.");
      }
      const data = await response.json();
      setMessages(data.messages as Message[]);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (
    messageBody: string,
    mediaUrl?: string[]
  ) => {
    if (!PHONE_NUMBER || !messageBody.trim()) return;

    if (socket) {
      // Enviar un nuevo mensaje
      socket.emit(
        "message",
        JSON.parse(`{ "client_number":"${PHONE_NUMBER}"}`)
      );
    }

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

      setMessages([
        ...messages,
        {
          body: messageBody,
          date_sent: String(new Date()),
          from: "5555555",
          to: PHONE_NUMBER,
          media: mediaUrl
            ? mediaUrl?.length > 0
              ? mediaUrl?.map((item) => item.replace(APP_TWILIO_URL, ""))
              : []
            : [],
        },
      ]);

      setInput("");
      if (mediaUrl && mediaUrl?.length > 0) {
        setFileSelected([]);
        setOpenArchivos(false);
      }
      setTimeout(()=>{
        window.location.reload()
      },1500)
      // handleGetMessages();
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  const handleSendAudio = async () => {
    if (!PHONE_NUMBER || !audioFile) return;

    const formData = new FormData();

    formData.append("file", audioFile);

    try {
      const response = await fetch(`${APP_TWILIO_URL}upload_audio`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido");
      }

      const data = await response.json();

      if (data.url) {
        handleSendMessage("audio:", [
          `https://fiftydoctorsback.com/crmtwilio${data.url}`,
        ]);
        setAudioFile(null);
      }
    } catch (error) {
      console.error("Error al enviar el audio:", error);
    }
  };

  useEffect(() => {
    if (messages && messages.length > 0) {
      if (messagesEndRef.current) {
        const scrollContainer = messagesEndRef.current;
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }
  }, [messagesEndRef, messages]);

  const fetchAllFolders = async () => {
    setLoadingFolders(true);
    try {
      const response = await getAllFiles();
      if (response.result && Array.isArray(response.data)) {
        setFolders(response.data);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se encontraron carpetas",
        });
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title:
          error instanceof Error
            ? error.message
            : "Error al obtener las carpetas",
      });
    } finally {
      setLoadingFolders(false);
    }
  };

  useEffect(() => {
    if (openArchivos) {
      fetchAllFolders();
    }
  }, [openArchivos]);

  const handleViewFolder = (folder: FolderData) => {
    setSelectedFolder({ id: folder._id, name: folder.nombre_carpeta });
    setIsOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function listenPhone(data: any) {
    if (data.messages && data.messages.length > 0) {
      setMessages(data.messages as Message[]);
    }
  }

  useEffect(() => {
    // socket.connect();
    if (socket) {
      // Enviar un nuevo mensaje
      socket.emit(
        "message",
        JSON.parse(`{ "client_number":"${PHONE_NUMBER}"}`)
      );
    }

    socket.on(PHONE_NUMBER, listenPhone);
    return () => {
      socket.off(PHONE_NUMBER);
      socket.disconnect();
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phone) {
      handleGetMessages();
    }
  }, []);


  return (
    <div className="flex flex-col w-full rounded-lg gap-0">
      <div className="flex items-center justify-between px-3 py-2">
        <h2 className="font-semibold text-[15px]">Whatsapp Chat</h2>
        <div className="flex items-center gap-2">
          <Button
            icon={RefreshIcon}
            onClick={handleGetMessages}
            variant="tertiary"
          >
            Recargar
          </Button>
          <Button
            onClick={() => {
              const worksheet = XLSX.utils.json_to_sheet(messages);
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, "Chat History");

              const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
              });
              const blob = new Blob([excelBuffer], {
                type: "application/octet-stream",
              });

              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "message_history.xlsx";
              a.click();
            }}
            variant="primary"
            icon={PageDownIcon}
          >
            Descargar Chat
          </Button>
        </div>
      </div>

      <Box
        background="bg-surface-secondary"
        paddingInline={"0"}
        paddingBlock={"400"}
      >
        <div className="px-4 flex flex-col gap-2">
          <div
            className="flex flex-col gap-1 overflow-y-scroll h-[50vh] px-2 py-2 relative"
            ref={messagesEndRef}
          >
            {messages && messages.length > 0 ? (
              messages.map((msg, index) => {
                const { time } = SplitDateTime(msg.date_sent);
                return (
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
                        <div
                          className={`w-full grid ${
                            msg.media.length > 3 ? "grid-cols-4" : "grid-cols-1"
                          }`}
                        >
                          {msg.media.map((mediaUrl, mediaIndex) => {
                            if (mediaUrl.endsWith(".pdf")) {
                              return (
                                <a
                                  key={`file-${mediaIndex}`}
                                  href={`${APP_TWILIO_URL}${mediaUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  Ver archivo
                                </a>
                              );
                            } else if (
                              mediaUrl.endsWith(".mp3") ||
                              mediaUrl.endsWith(".mpeg") ||
                              mediaUrl.endsWith(".ogg")
                            ) {
                              return (
                                <audio
                                  key={`file-${mediaIndex}`}
                                  className=""
                                  controls
                                >
                                  <source
                                    src={`${APP_TWILIO_URL}${mediaUrl}`}
                                  />
                                </audio>
                              );
                            } else {
                              return (
                                <img
                                  key={`img-${mediaIndex}`}
                                  src={`${APP_TWILIO_URL}${mediaUrl}`}
                                  alt={`media chat ${mediaIndex}`}
                                  className="w-full h-auto object-cover rounded-md"
                                />
                              );
                            }
                          })}
                        </div>
                      )}
                      {msg.body !== "audio:" && <p>{msg.body}</p>}
                    </div>
                    <span className="text-[11px] font-normal">
                      {FormatTime(time)} hrs.
                    </span>
                  </div>
                );
              })
            ) : (
              <p>No hay mensajes disponibles.</p>
            )}
          </div>
          <div className="bg-white w-full flex flex-col items-center gap-2 rounded-lg border border-[#E9E9E9] px-2 py-1">
            {openArchivos && (
              <div className="w-full flex flex-wrap gap-1">
                {loadingFolders ? (
                  <p>Cargando...</p>
                ) : (
                  <>
                    {folders &&
                    folders.length > 0 &&
                    fileSelected.length == 0 ? (
                      folders.map((folder: FolderData) => {
                        return (
                          <Button
                            key={folder._id}
                            icon={FolderIcon}
                            variant="tertiary"
                            onClick={() => handleViewFolder(folder)}
                          >
                            {folder.nombre_carpeta}
                          </Button>
                        );
                      })
                    ) : fileSelected.length >= 0 ? (
                      <>
                        {fileSelected.map((files: string, idx: number) => {
                          if (files.endsWith(".pdf")) {
                            return (
                              <div
                                key={`files-msg-${idx}`}
                                className="w-10 aspect-square flex justify-center items-center bg-[#E9E9E9] rounded-md overflow-hidden p-1"
                              >
                                <PDFFileIcon className="w-7 h-auto" />
                              </div>
                            );
                          } else {
                            return (
                              <div
                                key={`files-msg-${idx}`}
                                className="w-10 aspect-square flex justify-center items-center bg-[#E9E9E9] rounded-md overflow-hidden p-1"
                              >
                                <img
                                  src={`${files}`}
                                  alt={`Archivo ${idx + 1}`}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </div>
                            );
                          }
                        })}
                        {/* <button 
                            className="w-10 aspect-square flex justify-center items-center transition-all duration-200 bg-[#E9E9E9] hover:bg-[#dbdbdb] rounded-lg p-1"
                            onClick={() => setIsOpen((prev) => !prev)}
                          >
                            <Icon source={PlusCircleIcon} />
                          </button> */}
                      </>
                    ) : (
                      <p>No hay carpetas disponibles</p>
                    )}
                  </>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 w-full">
              {audioFile && audioFile !== null ? (
                <div className="[&_button]:bg-[#E9E9E9] w-full flex justify-center items-center">
                  <Button
                    variant="tertiary"
                    onClick={togglePlayPause}
                    icon={isPlaying ? PauseCircleIcon : PlayIcon}
                    fullWidth
                  >
                    {isPlaying ? "Pausar" : "Reproducir"}
                  </Button>
                  <audio
                    ref={audioPlayer}
                    controls
                    className="hidden"
                    onEnded={() => setIsPlaying(false)}
                  >
                    <source src={URL.createObjectURL(audioFile)} />
                  </audio>
                </div>
              ) : (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe un mensaje"
                  className="flex-1 w-full p-2 bg-transparent"
                />
              )}
              <AudioRecorderComponent
                audioFile={audioFile}
                setAudioFile={setAudioFile}
              />
              {audioFile && audioFile !== null ? (
                <Tooltip content="Eliminar Audio">
                  <div className="transition-all duration-500 [&_button]:bg-[#ffa9a9] [&_button]:hover:bg-[#ff8989] flex justify-center items-center">
                    <Button
                      icon={DeleteIcon}
                      variant="tertiary"
                      tone="critical"
                      onClick={() => setAudioFile(null)}
                    />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip content="Agregar archivo">
                  <div className="transition-all duration-500 [&_button]:bg-[#E9E9E9] [&_button]:hover:bg-[#c2c2c2] flex justify-center items-center">
                    <Button
                      icon={AttachmentFilledIcon}
                      variant="tertiary"
                      onClick={() => setOpenArchivos((prev) => !prev)}
                    />
                  </div>
                </Tooltip>
              )}
              <Tooltip content="Han pasado mas de 24 hrs despues del ultimo mensaje, envia un template" active={hasPassed23Hours}>
                <button
                  disabled={hasPassed23Hours}
                  onClick={() => {
                    if (audioFile && audioFile !== null) {
                      handleSendAudio();
                    } else {
                      handleSendMessage(input, fileSelected);
                    }
                  }}
                  className="px-4 py-1 bg-green-500 text-white transition-all duration-200 rounded-md hover:bg-green-600"
                >
                  Enviar
                </button>
              </Tooltip>
            </div>
          </div>
          <TemplatesWhats refetch={handleGetMessages} clientNumber={phone} clientInfo={leadData} />
        </div>
      </Box>

      {isOpen && selectedFolder && (
        <ModalArchivosCarpetas
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          folder={selectedFolder}
          fileSelected={fileSelected}
          setFileSelected={setFileSelected}
        />
      )}
    </div>
  );
}
