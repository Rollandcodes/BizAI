"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: "property" | "dental" | "consultation" | "appointment";
  clientName: string;
  time: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    date: new Date(2026, 3, 5),
    title: "Property Viewing - Kyrenia Seafront",
    type: "property",
    clientName: "Ahmed Al-Mansouri",
    time: "10:00 AM",
  },
  {
    id: "2",
    date: new Date(2026, 3, 8),
    title: "IVF Consultation",
    type: "dental",
    clientName: "Marina Venetsianou",
    time: "2:30 PM",
  },
  {
    id: "3",
    date: new Date(2026, 3, 12),
    title: "Property Investment Meeting",
    type: "property",
    clientName: "Igor Petrov",
    time: "11:00 AM",
  },
  {
    id: "4",
    date: new Date(2026, 3, 15),
    title: "Dental Consultation",
    type: "dental",
    clientName: "Sarah Johnson",
    time: "3:00 PM",
  },
  {
    id: "5",
    date: new Date(2026, 3, 18),
    title: "Residency Visa Consultation",
    type: "consultation",
    clientName: "Hassan Al-Rashid",
    time: "9:00 AM",
  },
  {
    id: "6",
    date: new Date(2026, 3, 22),
    title: "Property Tour - Limassol",
    type: "property",
    clientName: "Elena Kostarelou",
    time: "4:00 PM",
  },
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3));

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const eventsForDate = (date: Date) => {
    return mockEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const daysArray = useMemo(() => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    return days;
  }, [currentMonth]);

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const getEventColor = (type: string) => {
    switch (type) {
      case "property":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-700/50";
      case "dental":
        return "bg-blue-500/20 text-blue-300 border-blue-700/50";
      case "consultation":
        return "bg-purple-500/20 text-purple-300 border-purple-700/50";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-700/50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            Appointment Calendar
          </h1>
          <p className="text-slate-400">View and manage all upcoming consultations and viewings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-8 backdrop-blur">
            {/* Month Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">{monthName}</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date())}
                  className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-200 text-sm font-medium"
                >
                  Today
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-slate-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {daysArray.map((date, idx) => {
                const events = date ? eventsForDate(date) : [];
                const isToday = date && new Date().toDateString() === date.toDateString();

                return (
                  <div
                    key={idx}
                    className={`min-h-24 p-2 rounded-lg border transition-colors ${
                      date
                        ? isToday
                          ? "bg-lime-500/10 border-lime-600/50"
                          : events.length > 0
                          ? "bg-slate-700/40 border-slate-600/50"
                          : "bg-slate-700/20 border-slate-700/30 hover:border-slate-600/50"
                        : "bg-slate-900/20 border-transparent"
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-bold mb-2 ${isToday ? "text-lime-400" : "text-white"}`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {events.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs px-2 py-1 rounded border truncate ${getEventColor(event.type)}`}
                            >
                              {event.type === "property" && "🏠"}{" "}
                              {event.type === "dental" && "🏥"}{" "}
                              {event.type === "consultation" && "📋"}{" "}
                              {event.title.substring(0, 12)}...
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div className="text-xs text-slate-400 px-2">+{events.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur">
            <h3 className="text-lg font-bold text-white mb-6">Upcoming Events</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {mockEvents
                .filter((e) => e.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((event) => (
                  <div key={event.id} className={`rounded-lg border p-4 ${getEventColor(event.type)}`}>
                    <p className="font-semibold text-sm mb-1">{event.title}</p>
                    <p className="text-xs opacity-90">{event.clientName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-75">{event.date.toLocaleDateString()}</span>
                      <span className="text-xs font-medium">{event.time}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Event Type Legend */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">Event Types</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-xs text-slate-300">Property Viewing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-slate-300">Dental Consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-xs text-slate-300">Consultation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
