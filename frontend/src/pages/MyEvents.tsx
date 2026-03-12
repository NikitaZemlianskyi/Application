import { useEffect, useState } from "react";
import { api } from "../api/axios";
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  eachDayOfInterval,
  parseISO,
} from "date-fns";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "../components/ui/Button";

export const MyEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await api.get("/users/me/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch user events");
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  const handlePrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.dateTime);
      return isSameDay(eventDate, day);
    });
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {weekDays.map((dayName) => (
            <div key={dayName} className="py-3 text-center text-sm font-semibold text-gray-800">
              {dayName}
            </div>
          ))}
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelected = isSameDay(day, new Date()); // Highlighting today
            const dayEvents = getEventsForDay(day);

            return (
              <div
                key={day.toString()}
                className={`min-h-[120px] p-2 border-r border-b border-gray-200 relative transition-all ${
                  isCurrentMonth ? "bg-white" : "bg-gray-50/50"
                } ${isSelected ? "outline outline-[2px] outline-indigo-500 -outline-offset-[1px] z-10" : "hover:bg-gray-50/50"}`}
              >
                <div className={`text-sm font-medium ${isSelected ? "text-indigo-500" : "text-gray-700"} ${!isCurrentMonth ? "text-gray-400" : ""}`}>
                  {format(day, dateFormat)}
                </div>
                <div className="mt-2 flex flex-col gap-1">
                  {dayEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="block px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-500 rounded hover:bg-indigo-100 truncate"
                    >
                      {format(parseISO(event.dateTime), "HH:mm")} - {event.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="grid grid-cols-7 gap-4">
        {days.map((day, i) => {
          const isToday = isSameDay(day, new Date());
          const dayEvents = getEventsForDay(day);
          
          return (
            <div
              key={day.toString()}
              className={`bg-white rounded-xl shadow-sm min-h-[220px] flex flex-col overflow-hidden transition-all ${
                isToday ? "border-2 border-indigo-400 p-[15px]" : "border border-gray-200 p-4"
              }`}
            >
              <div className={`text-sm font-bold mb-1 ${isToday ? "text-gray-900" : "text-gray-700"}`}>
                {weekDays[i]}
              </div>
              <div className={`text-sm mb-4 font-medium ${isToday ? "text-indigo-500" : "text-gray-500"}`}>
                {format(day, "d")}
              </div>
              
              <div className="flex-1 flex flex-col gap-2">
                {dayEvents.length === 0 ? (
                  <div className="text-xs text-gray-400 mt-2">No events</div>
                ) : (
                  dayEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="block p-2 text-xs font-medium bg-indigo-50 text-indigo-500 rounded hover:bg-indigo-100"
                    >
                      <div className="mb-0.5">{format(parseISO(event.dateTime), "HH:mm")}</div>
                      <div className="truncate">{event.title}</div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading)
    return <div className="text-center mt-10">Loading calendar...</div>;

  return (
    <div className="w-full h-full pb-10">
      {/* Header section matching screenshot */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">My Events</h1>
          <p className="text-gray-500 text-sm">View and manage your event calendar</p>
        </div>
        <Link
          to="/events/create"
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors cursor-pointer text-sm"
        >
          <Plus size={16} />
          Create Event
        </Link>
      </div>

      {/* Controls section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="p-1.5"
          >
            <ChevronLeft size={18} />
          </Button>
          <h2 className="text-xl font-bold text-gray-900 min-w-[150px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button
            onClick={handleNext}
            variant="outline"
            className="p-1.5"
          >
            <ChevronRight size={18} />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode("month")}
            variant={viewMode === "month" ? "primary" : "outline"}
            size="sm"
          >
            Month
          </Button>
          <Button
            onClick={() => setViewMode("week")}
            variant={viewMode === "week" ? "primary" : "outline"}
            size="sm"
          >
            Week
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "month" ? renderMonthView() : renderWeekView()}
    </div>
  );
};
