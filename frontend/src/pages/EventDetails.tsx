import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuthStore } from "../store/useAuthStore";
import { format } from "date-fns";
import { MapPin, Users, CalendarDays, Trash2, Edit } from "lucide-react";

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [event, setEvent] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Event not found");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (!event) return <div className="text-center mt-20">Loading...</div>;

  const isOrganizer = user?.id === event.organizer.id;
  const isParticipant =
    user && event.participants.some((p: any) => p.id === user?.id);
  const isFull = event.capacity && event.participants.length >= event.capacity;

  const handleJoinLeave = async () => {
    try {
      if (isParticipant) {
        await api.post(`/events/${id}/leave`);
      } else {
        await api.post(`/events/${id}/join`);
      }
      fetchEvent();
    } catch (error) {
      alert("Action failed");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/events/${id}`);
      navigate("/");
    } catch (error) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            {isOrganizer && (
              <div className="flex gap-2">
                <button className="p-2 text-gray-500 hover:text-indigo-600 bg-gray-50 rounded-md">
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 rounded-md"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-600 whitespace-pre-wrap text-lg mb-8">
            {event.description}
          </p>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-indigo-500" />{" "}
              <span className="text-lg">
                {format(new Date(event.dateTime), "PPPP p")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-indigo-500" />{" "}
              <span className="text-lg">{event.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-indigo-500" />{" "}
              <span className="text-lg">
                {event.participants.length}{" "}
                {event.capacity ? `/ ${event.capacity}` : ""} participants
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          {user && !isOrganizer && (
            <button
              onClick={handleJoinLeave}
              disabled={isFull && !isParticipant}
              className={`w-full py-3 rounded-md font-medium text-lg mb-6 transition ${isParticipant ? "bg-red-50 text-red-600 hover:bg-red-100" : isFull ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
            >
              {isParticipant
                ? "Leave Event"
                : isFull
                  ? "Event Full"
                  : "Join Event"}{" "}
            </button>
          )}

          <h3 className="font-semibold text-lg mb-4 border-b pb-2">
            Participants ({event.participants.length})
          </h3>
          <ul className="space-y-3">
            {event.participants.map((p: any) => (
              <li key={p.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700">{p.name}</span>
              </li>
            ))}
            {event.participants.length === 0 && (
              <p className="text-gray-500 text-sm">No participants yet.</p>
            )}
          </ul>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Delete Event</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
