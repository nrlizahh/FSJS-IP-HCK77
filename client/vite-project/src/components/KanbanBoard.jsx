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

export default function KanbanBoard({
  status,
  notes,
  openEditModal,
  handleDeletedNotes,
}) {
  const { setNodeRef } = useDroppable({ id: status.id });
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // const openEditModal = (task) => {
  //   setSelectedTask(task);
  //   setIsEditModalOpen(true);
  // };

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
        className="w-full md:w-1/3 h-[90vh] bg-gray-700  rounded-lg shadow-md p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white m-0">
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
