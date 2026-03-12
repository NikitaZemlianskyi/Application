import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { Search } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { EventCard } from '../components/events/EventCard';
import { useEventActions } from '../hooks/useEventActions';

export const Home = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const { joinEvent, leaveEvent } = useEventActions(fetchEvents);

  const handleJoin = async (eventId: string) => {
    await joinEvent(eventId);
  };

  const handleLeave = async (eventId: string) => {
    await leaveEvent(eventId);
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Events</h1>
        <p className="text-gray-500 mb-6">Find and join exciting events happening around you</p>
        
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white shadow-sm"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard 
            key={event.id}
            event={event} 
            user={user} 
            onJoin={handleJoin} 
            onLeave={handleLeave} 
          />
        ))}
      </div>
    </div>
  );
};