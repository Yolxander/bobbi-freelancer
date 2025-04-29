import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface Milestone {
  id: string
  title: string
  description: string
  due_date: string
  tasks: Task[]
  status: 'pending' | 'in-progress' | 'completed'
}

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date: string
  completed: boolean
}

interface MilestonesInputProps {
  value: Milestone[]
  onChange: (value: Milestone[]) => void
}

export default function MilestonesInput({ value, onChange }: MilestonesInputProps) {
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({})

  const handleAddMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: '',
      description: '',
      due_date: new Date().toISOString().split('T')[0],
      tasks: [],
      status: 'pending'
    }
    onChange([...value, newMilestone])
  }

  const handleUpdateMilestone = (id: string, updates: Partial<Milestone>) => {
    onChange(value.map(milestone => 
      milestone.id === id ? { ...milestone, ...updates } : milestone
    ))
  }

  const handleDeleteMilestone = (id: string) => {
    onChange(value.filter(milestone => milestone.id !== id))
  }

  const handleAddTask = (milestoneId: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      due_date: new Date().toISOString().split('T')[0],
      completed: false
    }
    onChange(value.map(milestone => 
      milestone.id === milestoneId 
        ? { ...milestone, tasks: [...milestone.tasks, newTask] }
        : milestone
    ))
  }

  const handleUpdateTask = (milestoneId: string, taskId: string, updates: Partial<Task>) => {
    onChange(value.map(milestone => 
      milestone.id === milestoneId
        ? {
            ...milestone,
            tasks: milestone.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            )
          }
        : milestone
    ))
  }

  const handleDeleteTask = (milestoneId: string, taskId: string) => {
    onChange(value.map(milestone => 
      milestone.id === milestoneId
        ? {
            ...milestone,
            tasks: milestone.tasks.filter(task => task.id !== taskId)
          }
        : milestone
    ))
  }

  const toggleMilestone = (id: string) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div className="space-y-4">
      {value.map((milestone) => (
        <div key={milestone.id} className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleMilestone(milestone.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                {expandedMilestones[milestone.id] ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              <h3 className="text-lg font-semibold text-gray-900">{milestone.title || 'Untitled Milestone'}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={milestone.status}
                onValueChange={(value) => handleUpdateMilestone(milestone.id, { status: value as Milestone['status'] })}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteMilestone(milestone.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {expandedMilestones[milestone.id] && (
            <div className="space-y-4 pl-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`milestone-title-${milestone.id}`}>Title</Label>
                  <Input
                    id={`milestone-title-${milestone.id}`}
                    value={milestone.title}
                    onChange={(e) => handleUpdateMilestone(milestone.id, { title: e.target.value })}
                    placeholder="Enter milestone title"
                  />
                </div>
                <div>
                  <Label htmlFor={`milestone-due-date-${milestone.id}`}>Due Date</Label>
                  <DatePicker
                    selected={milestone.due_date ? new Date(milestone.due_date) : null}
                    onChange={(date) => handleUpdateMilestone(milestone.id, { due_date: date?.toISOString().split('T')[0] || '' })}
                    className="w-full px-3 py-2 border rounded-md"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`milestone-description-${milestone.id}`}>Description</Label>
                <Textarea
                  id={`milestone-description-${milestone.id}`}
                  value={milestone.description}
                  onChange={(e) => handleUpdateMilestone(milestone.id, { description: e.target.value })}
                  placeholder="Enter milestone description"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">Tasks</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTask(milestone.id)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </Button>
                </div>

                {milestone.tasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Input
                        value={task.title}
                        onChange={(e) => handleUpdateTask(milestone.id, task.id, { title: e.target.value })}
                        placeholder="Task title"
                        className="font-medium"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(milestone.id, task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={task.status}
                          onValueChange={(value) => handleUpdateTask(milestone.id, task.id, { status: value as Task['status'] })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select
                          value={task.priority}
                          onValueChange={(value) => handleUpdateTask(milestone.id, task.id, { priority: value as Task['priority'] })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Description</Label>
                      <Textarea
                        value={task.description}
                        onChange={(e) => handleUpdateTask(milestone.id, task.id, { description: e.target.value })}
                        placeholder="Enter task description"
                        rows={2}
                      />
                    </div>
                    <div className="mt-4">
                      <Label>Due Date</Label>
                      <DatePicker
                        selected={task.due_date ? new Date(task.due_date) : null}
                        onChange={(date) => handleUpdateTask(milestone.id, task.id, { due_date: date?.toISOString().split('T')[0] || '' })}
                        className="w-full px-3 py-2 border rounded-md"
                        dateFormat="yyyy-MM-dd"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        onClick={handleAddMilestone}
        className="w-full flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Milestone
      </Button>
    </div>
  )
} 