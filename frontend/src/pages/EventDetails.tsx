import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuthStore } from "../store/useAuthStore";
import { format } from "date-fns";
import { MapPin, Users, CalendarDays, Trash2, Edit } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { useEventActions } from "../hooks/useEventActions";
import { TagChip } from "../components/ui/TagChip";

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

  const { joinEvent, leaveEvent, deleteEvent, loading: actionLoading } = useEventActions(fetchEvent);

  if (!event) return <div className="text-center mt-20">Loading...</div>;

  const isOrganizer = user?.id === event.organizer.id;
  const isParticipant =
    user && event.participants.some((p: any) => p.id === user?.id);
  const isFull = event.capacity && event.participants.length >= event.capacity;

  const handleJoinLeave = async () => {
    if (isParticipant) {
      await leaveEvent(id as string);
    } else {
      await joinEvent(id as string);
    }
  };

  const handleDelete = async () => {
    await deleteEvent(id as string);
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            {isOrganizer && (
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate(`/events/${event.id}/edit`)}
                  variant="secondary"
                  className="p-2 !text-gray-500 hover:!text-indigo-600"
                >
                  <Edit className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="secondary"
                  className="p-2 !text-gray-500 hover:!text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
          <p className="text-gray-600 whitespace-pre-wrap text-lg mb-8">
            {event.description}
          </p>

          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {event.tags.map((tag: any) => (
                <TagChip key={tag.id} name={tag.name} size="md" />
              ))}
            </div>
          )}

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
            <Button
              onClick={handleJoinLeave}
              disabled={isFull && !isParticipant || actionLoading}
              variant={isParticipant ? "danger-light" : isFull ? "secondary" : "success"}
              fullWidth
              size="lg"
              className="mb-6 font-medium shadow-none"
            >
              {isParticipant
                ? "Leave Event"
                : isFull
                  ? "Event Full"
                  : "Join Event"}
            </Button>
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

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};
