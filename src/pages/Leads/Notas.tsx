import { useState, useEffect } from "react";
import NotesService from "../../services/notas";

interface Note {
  _id: string;
  nota: string;
}

interface NotasProps {
  idCliente: string;
}

export default function Notas({ idCliente }: NotasProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCliente]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await NotesService.getNotesBySeller(idCliente);
      setNotes(response.data || []);
    } catch {
      setError("Error al cargar las notas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote) {
      setError("La nota no puede estar vacía");
      return;
    }
    try {
      setIsLoading(true);
      await NotesService.createNote(idCliente, newNote);
      setNewNote("");
      fetchNotes();
    } catch {
      setError("Error al crear la nota");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      setIsLoading(true);
      await NotesService.deleteNote(id);
      fetchNotes();
    } catch {
      setError("Error al eliminar la nota");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="font-semibold text-[20px]">Notas</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="my-4">
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="Escribe una nueva nota..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button
          onClick={handleCreateNote}
          className="bg-blue-500 text-white p-2 rounded mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Creando..." : "Agregar Nota"}
        </button>
      </div>
      <div className="my-4">
        {isLoading ? (
          <p>Cargando notas...</p>
        ) : (
          <ul>
            {notes.map((note) => (
              <li
                key={note._id}
                className="border p-2 rounded mb-2 flex justify-between items-center"
              >
                <span>{note.nota}</span>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="text-red-500"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
