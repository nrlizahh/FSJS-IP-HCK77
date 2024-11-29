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
import EditTaskModal from "../components/EditTask";

export default function HomePage() {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const [notes, setNotes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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

  // Handle Open Edit Modal
  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const updateTaskInBoard = (updatedTask) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === updatedTask.id ? updatedTask : note
      )
    );
  };
  


  const fetchData = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/notes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setNotes(data);
    } catch (err) {
      console.log("🚀 ~ fetchData ~ error:", err);
    }
  };

  // Handle Deleted Notes
  const handleDeletedNotes = async (id) => {
    try {
      const access_token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:3000/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      fetchData(); // Re-fetch after delete
    } catch (err) {
      console.log("🚀 ~ handleDeletedNotes ~ err:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 bg-gray-100 h-screen">
        <button
          onClick={() => setIsCreatingTask(true)}
          className="flex items-center gap-2 px-3 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-md shadow-sm hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-300 mb-6"
          aria-label="Add Task"
        >
          <PlusCircleIcon className="w-5 h-5" />
          <span className="text-sm font-medium leading-none">Add Task</span>
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
                openEditModal={openEditModal}
                handleDeletedNotes={handleDeletedNotes}
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
      {isEditModalOpen && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => setIsEditModalOpen(false)}
          updateTaskInBoard={updateTaskInBoard}
        />
      )}
    </div>
  );
}
