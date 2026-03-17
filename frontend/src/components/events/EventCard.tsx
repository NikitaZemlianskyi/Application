import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Users, CalendarDays, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { TagChip } from '../ui/TagChip';

interface EventCardProps {
  event: any;
  user: any;
  onJoin: (eventId: string) => void;
  onLeave: (eventId: string) => void;
}

export const EventCard = ({ event, user, onJoin, onLeave }: EventCardProps) => {
  const isParticipant = user && event.participants.some((p: any) => p.id === user.id);
  const isOrganizer = user && event.organizer.id === user.id;
  const isFull = event.capacity !== null && event.participants.length >= event.capacity;

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden hover:shadow-lg transition flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/events/${event.id}`}>
            <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">{event.title}</h3>
          </Link>
          {isFull && !isParticipant && (
            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-medium ml-2">Full</span>
          )}
        </div>
        
        <p className="text-gray-500 text-sm mb-6 line-clamp-2">{event.description}</p>
        
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            {event.tags.slice(0, 3).map((tag: any) => (
              <TagChip key={tag.id} name={tag.name} />
            ))}
            {event.tags.length > 3 && (
              <span className="text-xs text-gray-500 flex items-center font-medium">+{event.tags.length - 3} more</span>
            )}
          </div>
        )}
        
        <div className="space-y-2.5 text-sm text-gray-500 mb-6 font-medium mt-auto">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            {format(new Date(event.dateTime), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            {format(new Date(event.dateTime), 'HH:mm')}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            {event.location}
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            {event.participants.length} {event.capacity ? `/ ${event.capacity} participants` : 'joined'}
          </div>
        </div>

        <div className="pt-2">
          {!user ? (
            <Link to={`/events/${event.id}`} className="block w-full text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition font-medium">
              Details
            </Link>
          ) : isOrganizer ? (
            <Link to={`/events/${event.id}`} className="block w-full text-center bg-indigo-50 text-indigo-600 py-2.5 rounded-lg hover:bg-indigo-100 transition font-medium">
              Manage Event
            </Link>
          ) : isParticipant ? (
            <Button 
              fullWidth 
              variant="danger-light" 
              onClick={() => onLeave(event.id)}
              className="py-2.5 rounded-lg"
            >
              Leave Event
            </Button>
          ) : (
            <Button 
              fullWidth 
              disabled={isFull}
              variant={isFull ? "secondary" : "success"}
              onClick={() => onJoin(event.id)}
              className="py-2.5 rounded-lg"
            >
              {isFull ? 'Full' : 'Join Event'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
