import { useState } from "react";
import axios from "axios";

export default function EditTaskModal({ task, onClose, updateTaskInBoard }) {
  const [payload, setPayload] = useState({
    task: task.task || "",
    description: task.description || "",
  });

  const [isTaskUpdated, setIsTaskUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle perubahan input
  const onChangePayload = (field, value) => {
    setPayload((prevPayload) => ({
      ...prevPayload,
      [field]: value,
    }));
  };

  // Submit form untuk mengupdate task
  const handleSubmit = (e) => {
    e.preventDefault();

    if (payload.task !== "" && payload.description !== "") {
      setIsLoading(true);
      axios
        .put(`http://localhost:3000/notes/${task.id}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          console.log("Task updated:", response.data);
          updateTaskInBoard(response.data.data); // Memperbarui data di board
          setIsTaskUpdated(true);
          onClose();
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      alert("Please fill out both task name and description.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div
        className="relative bg-white p-6 rounded-lg shadow-lg w-96 z-60 border"
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Task Name</label>
            <input
              type="text"
              value={payload.task}
              onChange={(e) => onChangePayload("task", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter task name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Task Description</label>
            <textarea
              value={payload.description}
              onChange={(e) => onChangePayload("description", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter task description"
              rows="4"
            ></textarea>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isTaskUpdated || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {isTaskUpdated ? "Task Updated" : isLoading ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
