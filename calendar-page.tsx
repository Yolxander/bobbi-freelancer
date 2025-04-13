"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Clock,
  MapPin,
  Users,
  Filter,
} from "lucide-react"
import Sidebar from "./components/sidebar"

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Generate days for the current month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  // Calendar data
  const events = [
    {
      id: 1,
      title: "Client Meeting",
      client: "Acme Inc.",
      project: "Website Redesign",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      location: "Video Call",
      attendees: 3,
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: 2,
      title: "Project Review",
      client: "TechStart",
      project: "Mobile App",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      startTime: "2:00 PM",
      endTime: "3:00 PM",
      location: "Office",
      attendees: 5,
      color: "bg-green-100 text-green-700",
    },
    {
      id: 3,
      title: "Design Presentation",
      client: "GreenGrow",
      project: "Brand Identity",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      location: "Client Office",
      attendees: 4,
      color: "bg-purple-100 text-purple-700",
    },
    {
      id: 4,
      title: "Team Sync",
      client: "Internal",
      project: "All Projects",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
      startTime: "9:00 AM",
      endTime: "9:30 AM",
      location: "Office",
      attendees: 8,
      color: "bg-gray-100 text-gray-700",
    },
    {
      id: 5,
      title: "Client Onboarding",
      client: "BlueSky Media",
      project: "Social Media Campaign",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
      startTime: "1:00 PM",
      endTime: "2:30 PM",
      location: "Video Call",
      attendees: 3,
      color: "bg-yellow-100 text-yellow-700",
    },
  ]

  // Get events for a specific day
  const getEventsForDay = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  // Get events for today
  const todayEvents = getEventsForDay(new Date().getDate())

  // Get events for selected date
  const selectedDateEvents = getEventsForDay(selectedDate.getDate())

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  // Format date for display
  const formatMonth = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" })
  }

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Check if a date is today
  const isToday = (day) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  // Check if a date is selected
  const isSelected = (day) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-64 bg-gray-100 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none text-gray-700"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Filter className="w-5 h-5 text-gray-500" />
              </button>
              <button className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New Event</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-100" onClick={goToPreviousMonth}>
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <h2 className="text-lg font-medium text-gray-900">{formatMonth(currentDate)}</h2>
              <button className="p-2 rounded-lg hover:bg-gray-100" onClick={goToNextMonth}>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
              <button className="ml-2 px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700" onClick={goToToday}>
                Today
              </button>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-1 rounded-md text-sm ${viewMode === "month" ? "bg-white shadow-sm text-gray-900" : "text-gray-600"}`}
                onClick={() => setViewMode("month")}
              >
                Month
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm ${viewMode === "week" ? "bg-white shadow-sm text-gray-900" : "text-gray-600"}`}
                onClick={() => setViewMode("week")}
              >
                Week
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm ${viewMode === "day" ? "bg-white shadow-sm text-gray-900" : "text-gray-600"}`}
                onClick={() => setViewMode("day")}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Calendar Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map((day, index) => (
                <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 auto-rows-fr">
              {/* Empty cells for days before the first day of month */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="bg-gray-50 rounded-lg"></div>
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const dayEvents = getEventsForDay(day)

                return (
                  <div
                    key={day}
                    className={`bg-white border border-gray-100 rounded-lg p-1 min-h-[120px] cursor-pointer transition-colors ${
                      isSelected(day) ? "border-blue-500 ring-1 ring-blue-200" : ""
                    }`}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  >
                    <div className="flex justify-between items-center p-1">
                      <div
                        className={`w-7 h-7 flex items-center justify-center rounded-full text-sm ${
                          isToday(day) ? "bg-blue-500 text-white" : "text-gray-700"
                        }`}
                      >
                        {day}
                      </div>
                      {dayEvents.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {dayEvents.length} event{dayEvents.length > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                    <div className="mt-1 space-y-1 overflow-hidden max-h-[80px]">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div key={event.id} className={`${event.color} text-xs p-1 rounded truncate`}>
                          {event.startTime} - {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 p-1">+ {dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Sidebar - Event Details */}
          <div className="w-80 border-l border-gray-100 p-4 overflow-y-auto">
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </h3>
              {selectedDateEvents.length === 0 ? (
                <p className="text-gray-500 text-sm">No events scheduled</p>
              ) : (
                <p className="text-gray-500 text-sm">
                  {selectedDateEvents.length} event{selectedDateEvents.length > 1 ? "s" : ""} scheduled
                </p>
              )}
            </div>

            {/* Events for selected date */}
            <div className="space-y-3 mb-6">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div
                      className={`w-10 h-10 ${event.color.split(" ")[0]} rounded-lg flex items-center justify-center`}
                    >
                      <Calendar className="w-5 h-5" />
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <h4 className="font-medium mb-1 text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500 mb-3">
                    {event.client} - {event.project}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.startTime} - {event.endTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      {event.attendees} attendees
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Events */}
            <div>
              <h3 className="font-bold text-md mb-3 text-gray-900">Upcoming Events</h3>
              <div className="space-y-2">
                {events
                  .filter((event) => event.date >= new Date())
                  .sort((a, b) => a.date - b.date)
                  .slice(0, 3)
                  .map((event) => (
                    <div key={event.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div
                        className={`w-8 h-8 ${event.color.split(" ")[0]} rounded-lg flex items-center justify-center mr-3`}
                      >
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate text-gray-900">{event.title}</h4>
                        <p className="text-xs text-gray-500 truncate">
                          {event.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} •{" "}
                          {event.startTime}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <button className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700">View all events</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <Link href="/">
      <div className="flex flex-col cursor-pointer">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-black rounded-sm"></div>
          <div className="w-5 h-5 bg-black rounded-sm"></div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="w-5 h-5 bg-black rounded-sm"></div>
          <div className="w-5 h-5 bg-black rounded-sm"></div>
        </div>
      </div>
    </Link>
  )
}
