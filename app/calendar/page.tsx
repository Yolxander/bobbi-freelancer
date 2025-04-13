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
  X,
} from "lucide-react"
import Sidebar from "@/components/sidebar"

interface Event {
  id: number
  title: string
  client: string
  project: string
  date: Date
  startTime: string
  endTime: string
  location: string
  attendees: number
  color: string
}

// Event Modal Component
function EventModal({ isOpen, onClose, onSave, selectedDate }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (event: Omit<Event, "id">) => void;
  selectedDate: Date;
}) {
  const [title, setTitle] = useState("")
  const [client, setClient] = useState("")
  const [project, setProject] = useState("")
  const [date, setDate] = useState(selectedDate)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [attendees, setAttendees] = useState(1)
  const [color, setColor] = useState("bg-blue-100 text-blue-700")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)

  // Sample data for clients and projects
  const clients = [
    "Acme Inc.",
    "TechStart",
    "GreenGrow",
    "BlueSky Media",
    "Innovate Corp",
    "Future Systems"
  ]

  const projects = [
    "Website Redesign",
    "Mobile App",
    "Brand Identity",
    "Social Media Campaign",
    "Product Launch",
    "Customer Portal"
  ]

  const locations = [
    "Video Call",
    "Phone Call",
    "Office",
    "Client Office",
    "Conference Room",
    "Coffee Shop",
    "Restaurant",
    "Other"
  ]

  const colorOptions = [
    { name: "Blue", value: "bg-blue-100 text-blue-700" },
    { name: "Green", value: "bg-green-100 text-green-700" },
    { name: "Purple", value: "bg-purple-100 text-purple-700" },
    { name: "Yellow", value: "bg-yellow-100 text-yellow-700" },
    { name: "Red", value: "bg-red-100 text-red-700" },
    { name: "Gray", value: "bg-gray-100 text-gray-700" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      client,
      project,
      date,
      startTime,
      endTime,
      location,
      attendees,
      color,
    })
    onClose()
  }

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  // Format time for display
  const formatTime = (time: string): string => {
    if (!time) return "--:--"
    return time
  }

  // Generate time options
  const generateTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0')
        const formattedMinute = minute.toString().padStart(2, '0')
        times.push(`${formattedHour}:${formattedMinute}`)
      }
    }
    return times
  }

  const timeOptions = generateTimeOptions()

  // Calendar navigation
  const [calendarDate, setCalendarDate] = useState(new Date())
  
  const goToPreviousMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCalendarDate(new Date())
  }

  // Generate days for the calendar
  const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay()
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Check if a date is today
  const isToday = (day: number): boolean => {
    const today = new Date()
    return (
      day === today.getDate() &&
      calendarDate.getMonth() === today.getMonth() &&
      calendarDate.getFullYear() === today.getFullYear()
    )
  }

  // Check if a date is selected
  const isSelected = (day: number): boolean => {
    return (
      day === date.getDate() &&
      calendarDate.getMonth() === date.getMonth() &&
      calendarDate.getFullYear() === date.getFullYear()
    )
  }

  // Select a date from the calendar
  const selectDate = (day: number) => {
    setDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day))
    setShowDatePicker(false)
  }

  // Select a time
  const selectTime = (time: string, isStart: boolean) => {
    if (isStart) {
      setStartTime(time)
      setShowStartTimePicker(false)
    } else {
      setEndTime(time)
      setShowEndTimePicker(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-900">Add New Event</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                required
              >
                <option value="">Select a client</option>
                {clients.map((clientName) => (
                  <option key={clientName} value={clientName}>
                    {clientName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                required
              >
                <option value="">Select a project</option>
                {projects.map((projectName) => (
                  <option key={projectName} value={projectName}>
                    {projectName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="relative">
                <input
                  type="text"
                  value={formatDate(date)}
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
                  required
                />
                {showDatePicker && (
                  <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64">
                    <div className="flex justify-between items-center mb-2">
                      <button 
                        type="button" 
                        onClick={goToPreviousMonth}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-500" />
                      </button>
                      <span className="text-sm font-medium text-gray-700">
                        {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <button 
                        type="button" 
                        onClick={goToNextMonth}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {dayNames.map((day, index) => (
                        <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                        <div key={`empty-${index}`} className="h-8"></div>
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => selectDate(day)}
                            className={`h-8 w-8 flex items-center justify-center rounded-full text-sm ${
                              isSelected(day) 
                                ? "bg-blue-500 text-white" 
                                : isToday(day) 
                                  ? "bg-blue-100 text-blue-700" 
                                  : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>
                    <div className="mt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={goToToday}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Today
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatTime(startTime)}
                    onClick={() => setShowStartTimePicker(!showStartTimePicker)}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
                    required
                  />
                  {showStartTimePicker && (
                    <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-48 max-h-60 overflow-y-auto">
                      <div className="grid grid-cols-1 gap-1">
                        {timeOptions.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => selectTime(time, true)}
                            className={`p-2 rounded text-sm ${
                              startTime === time 
                                ? "bg-blue-100 text-blue-700" 
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatTime(endTime)}
                    onClick={() => setShowEndTimePicker(!showEndTimePicker)}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
                    required
                  />
                  {showEndTimePicker && (
                    <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-48 max-h-60 overflow-y-auto">
                      <div className="grid grid-cols-1 gap-1">
                        {timeOptions.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => selectTime(time, false)}
                            className={`p-2 rounded text-sm ${
                              endTime === time 
                                ? "bg-blue-100 text-blue-700" 
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                required
              >
                <option value="">Select a location</option>
                {locations.map((locationName) => (
                  <option key={locationName} value={locationName}>
                    {locationName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
              <input
                type="number"
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value))}
                min="1"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`p-2 rounded-lg border ${
                    color === option.value ? "ring-2 ring-blue-500" : "border-gray-200"
                  }`}
                >
                  <div className={`w-full h-6 ${option.value.split(" ")[0]} rounded`}></div>
                  <span className="text-gray-700 text-xs mt-1 block text-center">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([
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
  ])

  // Generate days for the current month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  // Get events for a specific day
  const getEventsForDay = (day: number): Event[] => {
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
  const formatMonth = (date: Date): string => {
    return date.toLocaleString("default", { month: "long", year: "numeric" })
  }

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Check if a date is today
  const isToday = (day: number): boolean => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  // Check if a date is selected
  const isSelected = (day: number): boolean => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    )
  }

  // Handle adding a new event
  const handleAddEvent = (newEvent: Omit<Event, "id">) => {
    const newId = Math.max(...events.map(event => event.id), 0) + 1
    setEvents([...events, { ...newEvent, id: newId }])
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
              <button 
                className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2"
                onClick={() => setIsModalOpen(true)}
              >
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
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
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

      {/* Event Modal */}
      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddEvent}
        selectedDate={selectedDate}
      />
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
