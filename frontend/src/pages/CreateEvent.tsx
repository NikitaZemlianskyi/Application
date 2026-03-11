import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const CreateEvent = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    visibility: "public",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const dateTime = new Date(`${formData.date}T${formData.time}`);

    if (dateTime < new Date()) {
      setError("Cannot create events in the past");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        dateTime: dateTime.toISOString(),
        location: formData.location,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        visibility: formData.visibility,
      };

      const response = await api.post("/events", payload);
      navigate(`/events/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 border rounded-xl shadow-sm">
      <Link
        to="/"
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <h2 className="text-3xl font-bold mb-2">Create New Event</h2>
      <p className="text-gray-500 mb-8">
        Fill in the details to create an amazing event
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Title *
          </label>
          <input
            required
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="e.g., Tech Conference 2026"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            required
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Describe what makes your event special..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              required
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <input
              required
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            required
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="e.g., Convention Center"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacity (optional)
          </label>
          <input
            type="number"
            name="capacity"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Leave empty for unlimited"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum number of participants. Leave empty for unlimited capacity.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visibility
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={formData.visibility === "public"}
                onChange={handleChange}
              />
              <span>Public - Anyone can see and join this event</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={formData.visibility === "private"}
                onChange={handleChange}
              />
              <span>Private - Only invited people can see this event</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Link
            to="/"
            className="flex-1 text-center border py-2 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};
