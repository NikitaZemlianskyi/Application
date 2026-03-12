import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/axios";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "../components/events/EventForm";
import type { EventFormData } from "../components/events/EventForm";

export const CreateEvent = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (formData: EventFormData) => {
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

      <EventForm
        onSubmit={handleSubmit}
        submitText="Create Event"
        cancelLink="/"
      />
    </div>
  );
};
