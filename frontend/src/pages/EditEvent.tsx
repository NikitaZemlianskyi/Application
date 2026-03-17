import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api/axios";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "../components/events/EventForm";
import type { EventFormData } from "../components/events/EventForm";

export const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<EventFormData | undefined>(undefined);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        const event = response.data;
        
        // Parse datetime to extract separate date and time for inputs
        const dt = new Date(event.dateTime);
        const dateStr = dt.toISOString().split('T')[0];
        const timeStr = dt.toTimeString().split(' ')[0].substring(0, 5); // HH:mm format

        setInitialData({
          title: event.title,
          description: event.description,
          date: dateStr,
          time: timeStr,
          location: event.location,
          capacity: event.capacity ? String(event.capacity) : "",
          visibility: event.visibility || "public",
          tags: event.tags ? event.tags.map((t: any) => t.name) : [],
        });
      } catch (err) {
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleSubmit = async (formData: EventFormData) => {
    setError("");

    const dateTime = new Date(`${formData.date}T${formData.time}`);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        dateTime: dateTime.toISOString(),
        location: formData.location,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        visibility: formData.visibility,
        tags: formData.tags,
      };

      await api.patch(`/events/${id}`, payload);
      navigate(`/events/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update event");
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 border rounded-xl shadow-sm">
      <Link
        to={`/events/${id}`}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Event
      </Link>

      <h2 className="text-3xl font-bold mb-2">Edit Event</h2>
      <p className="text-gray-500 mb-8">
        Update the details for this event
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      {initialData && (
        <EventForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitText="Save Changes"
          cancelLink={`/events/${id}`}
        />
      )}
    </div>
  );
};
