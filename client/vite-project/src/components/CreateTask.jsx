import { useState, useEffect } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked'; // Mengimpor library untuk mengkonversi Markdown

export default function CreateTask({ onClose, addTaskToBoard }) {
  const [payload, setPayload] = useState({
    task: "",
    description: "",
  });
  const [isTaskCreated, setIsTaskCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [askAI, setAskAI] = useState(null)

  // Initialize the Gemini AI client with your API key
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_APIKEY);

  // Handle changes in input fields
  const onChangePayload = (field, value) => {
    if(field === 'askAI') {
      setAskAI(value)
    } else {
      setPayload((prevPayload) => ({
        ...prevPayload,
        [field]: value,
      }));
    }
  };

  // Fetch description suggestions based on the task description input
  const fetchDescriptionSuggestions = async (description) => {
    if (!description) return;

    setIsSuggestionsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(`Suggest a detailed description for the task: ${description}
          Use this JSON schema: 
        `);

      if (result.error && result.error.includes("SAFETY")) {
        console.error("Content blocked due to safety concerns.");
        // Handle the error (e.g., show a user-friendly message or retry)
        setSuggestions("We encountered an issue while generating the description. Please try a different prompt.");
      } else {
        // Extract the response text from the result and clean Markdown
        const response = result.response;
        const cleanText = marked(response.text()); // Parse Markdown to plain text
        setSuggestions(cleanText); // Assuming suggestions are returned as a list of strings
      }
      
    } catch (error) {
      console.error("Error fetching description suggestions:", error);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  // Debounced fetching of suggestions when the description changes
  useEffect(() => {
    if(askAI && askAI !== '') {
      const timeoutId = setTimeout(() => {
        fetchDescriptionSuggestions(askAI);
      }, 500); // Debounce delay (500ms)
  
      return () => clearTimeout(timeoutId);
    }
  }, [askAI]);

  // Submit the form to create a task
  const handleSubmit = (e) => {
    e.preventDefault();

    if (payload.task !== "" && payload.description !== "") {
      axios
        .post("http://localhost:3000/notes", payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          console.log("Task created:", response.data);
          addTaskToBoard(response.data.data);
          setIsTaskCreated(true);
          onClose();
        })
        .catch((error) => {
          console.error("Error creating task:", error);
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
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <h2 className="text-2xl font-semibold mb-4">Create New Task</h2>
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
          <div style={{marginBottom: '5rem'}}>
            <p className="mb-1">Ask Gemini to Description: </p>
            <input
              type="text"
              value={askAI}
              onChange={(e) => onChangePayload("askAI", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Send a message to Gemini"
            />
            {/* Show suggestions when loading is complete */}
            {isSuggestionsLoading && (
              <p style={{fontSize: 11}} className="mt-1 italic text-gray-500">Loading suggestions...</p>
            )}


            {/* Render the suggestions list */} 
            {
              suggestions &&
              <div
                className="mt-4 text-sm text-gray-600 border rounded p-3"
                style={{ maxHeight: '200px', overflowY: 'auto' }}
                dangerouslySetInnerHTML={{ __html: suggestions }}
              />
            }

            <button
              type="button"
              onClick={() => {
                onChangePayload('description', suggestions)
                setSuggestions(null)
                setAskAI(null)
              }}
              className="mt-2 p-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Use Suggestion
            </button>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => onClose()}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isTaskCreated || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {isTaskCreated ? "Task Created" : isLoading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
