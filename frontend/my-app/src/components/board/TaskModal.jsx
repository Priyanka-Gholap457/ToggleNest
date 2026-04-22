import { useState, useEffect } from "react";
import api from "../../api";
import { useParams } from "react-router-dom";
import { MdClose, MdTask, MdDescription } from "react-icons/md";

const TaskModal = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("");

  const { id } = useParams(); // project id

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(`/tasks/project/${id}`, {
        title,
        description,
        priority
      });

      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const suggestPriority = async () => {
    if (!title.trim()) return;

    try {
      const res = await api.post("/ai/suggest-priority", { task: title });
      setPriority(res.data.priority);
    } catch (error) {
      console.log("AI priority suggestion failed", error);
      alert(error.response?.data?.message || "AI priority suggestion failed");
    }
  };

  const generateDescription = async () => {
    if (!title.trim()) return;

    try {
      const res = await api.post("/ai/generate-description", { title });
      setDescription(res.data.description);
    } catch (error) {
      console.log("AI description generation failed", error);
      alert(error.response?.data?.message || "AI description generation failed");
    }
  };

  // 🔹 Auto AI priority detection while typing
  useEffect(() => {

    if (!title.trim()) return;

    const timer = setTimeout(() => {
      suggestPriority();
    }, 1000); // wait 1 second after typing

    return () => clearTimeout(timer);

  }, [title]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <MdTask className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Add New Task</h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <MdClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* Task Title */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Task Title *
            </label>
            <div className="relative">
              <MdTask className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., Design homepage mockup"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>

            {/* AI Priority Button */}
            <button
              onClick={suggestPriority}
              className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
            >
              ✨ Suggest Priority with AI
            </button>

            {/* Show AI Priority */}
            {priority && (
              <p className="mt-2 text-sm font-semibold text-purple-700">
                Suggested Priority: {priority}
              </p>
            )}
          </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (optional)
              </label>

            <div className="relative">
              <MdDescription className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />

              <textarea
                placeholder="Add more details about this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                rows={4}
              />
            </div>
            {/* AI Description Button */}
            <button
              onClick={generateDescription}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
            >
            ✨ Generate Description with AI
            </button>
            </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;