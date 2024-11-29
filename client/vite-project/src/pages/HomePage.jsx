import axios from "axios";
import { useEffect, useState } from "react";
import KanbanBoard from "../components/KanbanBoard";
import Navbar from "../components/Navbar";
import CreateTask from "../components/CreateTask";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  PointerSensor,
} from "@dnd-kit/core";

export default function HomePage() {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const [notes, setNotes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/statuses",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then(({ data }) => setStatuses(data))
      .catch(console.log);

    axios({
      method: "GET",
      url: "http://localhost:3000/notes",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then(({ data }) => setNotes(data))
      .catch(console.log);
  }, []);

  const updateNoteStatus = (noteId, newStatusId, newOrder) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId
          ? { ...note, statusId: newStatusId, order: newOrder }
          : note
      )
    );
  };

  const renderNotesByStatus = (statusId) => {
    return notes
      .filter((note) => note.statusId === statusId)
      .sort((a, b) => a.order - b.order);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    console.log(active, over);

    if (over) {
      const newStatusId = over.id;
      const noteId = active.id;
      const targetNotes = notes.filter((note) => note.statusId === newStatusId);
      const newOrder = targetNotes.length + 1;

      try {
        // Update the status of the note in the backend
        await axios.put(
          `http://localhost:3000/notes/${noteId}`,
          { statusId: newStatusId, order: newOrder },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        updateNoteStatus(noteId, newStatusId, newOrder);
      } catch (error) {
        console.error("Failed to update note status:", error);
      }
    }
  };
  const addTaskToBoard = (newTask) => {
    setNotes((prevNotes) => [...prevNotes, newTask]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 bg-gray-100 min-h-screen">
        <button
          onClick={() => setIsCreatingTask(true)}
          className="flex items-center gap-2 px-4 py-3 mb-2 text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-300"
          aria-label="Add Task"
        >
          <PlusCircleIcon className="w-7 h-7" />
          <p className="text-lg font-medium">Add Task</p>
        </button>
        <div className="flex flex-col md:flex-row gap-4 ">
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            className="z-40"
          >
            {statuses.map((status) => (
              <KanbanBoard
                key={status.id}
                status={status}
                notes={renderNotesByStatus(status.id)}
              />
            ))}
          </DndContext>
        </div>
      </div>

      {/* modalcreate */}
      {isCreatingTask && (
        <CreateTask
          onClose={() => setIsCreatingTask(false)}
          addTaskToBoard={addTaskToBoard}
        />
      )}
    </div>
  );
}
