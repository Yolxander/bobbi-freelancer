"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Plus, Edit, Trash, CheckCircle, X, Flag, Award, Zap, Lightbulb } from "lucide-react"
import {
  getTimelineEvents,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
  type TimelineEvent,
} from "@/app/actions/timeline-actions"
import { useAuth } from "@/lib/auth-context"

const EVENT_TYPES = [
  { value: "milestone", label: "Milestone", icon: Flag, color: "bg-blue-100 text-blue-600" },
  { value: "meeting", label: "Meeting", icon: Calendar, color: "bg-green-100 text-green-600" },
  { value: "deadline", label: "Deadline", icon: Clock, color: "bg-red-100 text-red-600" },
  { value: "achievement", label: "Achievement", icon: Award, color: "bg-purple-100 text-purple-600" },
  { value: "update", label: "Update", icon: Zap, color: "bg-amber-100 text-amber-600" },
  { value: "idea", label: "Idea", icon: Lightbulb, color: "bg-indigo-100 text-indigo-600" },
]

export default function ProjectTimeline({ projectId, isOwner, canEdit }) {
  const { user } = useAuth()
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<TimelineEvent | null>(null)
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    title: "",
    description: "",
    event_date: new Date().toISOString().split("T")[0],
    event_type: "milestone",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch timeline events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!projectId) return

      setLoading(true)
      try {
        const result = await getTimelineEvents(projectId)
        if (result.success) {
          setEvents(result.data)
        } else {
          setError(result.error || "Failed to load timeline events")
        }
      } catch (err) {
        console.error("Error fetching timeline events:", err)
        setError("Failed to load timeline events")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [projectId])

  // Handle adding a new event
  const handleAddEvent = async (e) => {
    e.preventDefault()
    if (!user || !projectId) return

    setIsSubmitting(true)
    try {
      const result = await createTimelineEvent({
        ...newEvent,
        project_id: projectId,
        created_by: user.id,
      } as TimelineEvent)

      if (result.success) {
        setEvents([...events, result.data])
        setShowAddModal(false)
        resetForm()
      } else {
        setError(result.error || "Failed to add event")
      }
    } catch (err) {
      console.error("Error adding timeline event:", err)
      setError("Failed to add event")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle updating an event
  const handleUpdateEvent = async (e) => {
    e.preventDefault()
    if (!currentEvent?.id) return

    setIsSubmitting(true)
    try {
      const result = await updateTimelineEvent(currentEvent.id, currentEvent)

      if (result.success) {
        setEvents(events.map((event) => (event.id === currentEvent.id ? currentEvent : event)))
        setShowEditModal(false)
      } else {
        setError(result.error || "Failed to update event")
      }
    } catch (err) {
      console.error("Error updating timeline event:", err)
      setError("Failed to update event")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle deleting an event
  const handleDeleteEvent = async (eventId) => {
    if (!eventId || !projectId) return

    if (confirm("Are you sure you want to delete this timeline event?")) {
      try {
        const result = await deleteTimelineEvent(eventId, projectId)

        if (result.success) {
          setEvents(events.filter((event) => event.id !== eventId))
        } else {
          setError(result.error || "Failed to delete event")
        }
      } catch (err) {
        console.error("Error deleting timeline event:", err)
        setError("Failed to delete event")
      }
    }
  }

  // Reset form
  const resetForm = () => {
    setNewEvent({
      title: "",
      description: "",
      event_date: new Date().toISOString().split("T")[0],
      event_type: "milestone",
    })
  }

  // Get icon for event type
  const getEventIcon = (eventType) => {
    const type = EVENT_TYPES.find((t) => t.value === eventType)
    if (!type) return Flag
    return type.icon
  }

  // Get color for event type
  const getEventColor = (eventType) => {
    const type = EVENT_TYPES.find((t) => t.value === eventType)
    if (!type) return "bg-gray-100 text-gray-600"
    return type.color
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Project Timeline</h2>
        {(isOwner || canEdit) && (
          <button
            className="flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 text-sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        )}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

      {events.length > 0 ? (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline events */}
          <div className="space-y-8">
            {events.map((event) => {
              const EventIcon = getEventIcon(event.event_type)
              const eventColor = getEventColor(event.event_type)

              return (
                <div key={event.id} className="relative pl-14">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-4 w-5 h-5 rounded-full ${eventColor.split(" ")[0]} flex items-center justify-center transform -translate-x-1/2`}
                  >
                    <EventIcon className="w-3 h-3" />
                  </div>

                  {/* Event card */}
                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${eventColor}`}>
                            {EVENT_TYPES.find((t) => t.value === event.event_type)?.label || "Event"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(event.event_date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-medium">{event.title}</h3>
                      </div>

                      {(isOwner || canEdit) && (
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1 hover:bg-gray-200 rounded-full"
                            onClick={() => {
                              setCurrentEvent(event)
                              setShowEditModal(true)
                            }}
                          >
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-200 rounded-full"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      )}
                    </div>

                    {event.description && <p className="text-sm text-gray-600 mt-2">{event.description}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No timeline events yet</h3>
          <p className="text-gray-500 mb-4">Add events to track important milestones and progress</p>
          {(isOwner || canEdit) && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
            >
              Add First Event
            </button>
          )}
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add Timeline Event</h2>
              <button
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    value={newEvent.event_type}
                    onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newEvent.event_date}
                    onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add Event</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && currentEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Timeline Event</h2>
              <button
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                onClick={() => setShowEditModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEvent}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    value={currentEvent.event_type}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, event_type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={currentEvent.title}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={currentEvent.description || ""}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={new Date(currentEvent.event_date).toISOString().split("T")[0]}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, event_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
