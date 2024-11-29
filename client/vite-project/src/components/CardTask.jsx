import { useDraggable } from "@dnd-kit/core";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid"; // Import ikon dari Heroicons v2.2.0

export default function CardTask({ note, openEditModal, handleDeletedNotes }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: note.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-4 bg-blue-100 rounded shadow-md cursor-pointer`}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      {/* Icons in the top-right corner */}
      <div className="mb-2 flex space-x-2 justify-content-end">
        <button
          onClick={() => openEditModal(note)}
          className="p-1 text-blue-500 bg-white rounded-full shadow hover:bg-blue-100"
          aria-label="Edit"
        >
          <PencilSquareIcon className="w-5 h-5" />
        </button>
        {/* delete */}
        <button
          onClick={() => {
            console.log("delete");
            handleDeletedNotes(note.id);
          }}
          className="p-1 text-red-500 bg-white rounded-full shadow hover:bg-red-100"
          aria-label="Delete"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <h4 className="font-semibold">{note.task}</h4>
      <p>{note.description}</p>
    </div>
  );
}
