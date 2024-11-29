import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  useDroppable,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import axios from "axios";
import CardTask from "./CardTask";
import EditTaskModal from "./EditTask";
import CreateTask from "./CreateTask";

export default function KanbanBoard({ status, notes }) {
  const { setNodeRef } = useDroppable({ id: status.id }); // Droppable area for Kanban column
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const updateTaskInBoard = (updatedTask) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedTask.id ? updatedTask : note))
    );
  };

  // Handle drag and drop
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      axios
        .put(
          `http://localhost:3000/notes/${active.id}`,
          { statusId: status.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        )
        .then(() => {
          setNotes((prevNotes) =>
            prevNotes.map((note) =>
              note.id === active.id ? { ...note, statusId: status.id } : note
            )
          );
        })
        .catch(console.log);
    }
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

  useEffect(() => {
    fetchData();
  }, []);

  // Hapus task
  const handleDeletedNotes = async (id) => {
    console.log("🚀 ~ DELETE request diterima untuk Note ID:");

    try {
      const access_token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:3000/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      fetchData();
      console.log("notes deleted successfully!");
    } catch (err) {
      console.log("🚀 ~ handleDeletedNotes ~ err:", err);
    }
  };

  return (
    <>
      {/* Render EditTaskModal */}
      {isEditModalOpen && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => setIsEditModalOpen(false)}
          updateTaskInBoard={updateTaskInBoard}
        />
      )}

      <div
        ref={setNodeRef}
        className="w-full md:w-1/3 bg-white rounded-lg shadow-md p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700 m-0">
            {status.name.toUpperCase()}
          </h3>
        </div>

        <div className="space-y-3">
          {notes.map((note) => (
            <CardTask
              key={note.id}
              note={note}
              openEditModal={openEditModal}
              handleDeletedNotes={handleDeletedNotes}
            />
          ))}
        </div>
      </div>
    </>
  );
}
