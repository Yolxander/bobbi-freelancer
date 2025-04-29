import { useState, useEffect } from "react"
import { Save, X, Calendar } from "lucide-react"

interface PaymentMilestone {
  milestone: string
  amount: number
  due_date: string
}

interface PaymentScheduleInputProps {
  value: PaymentMilestone[] | undefined
  onChange: (value: PaymentMilestone[]) => void
}

export default function PaymentScheduleInput({ value, onChange }: PaymentScheduleInputProps) {
  const [milestones, setMilestones] = useState<PaymentMilestone[]>(Array.isArray(value) ? value : [])
  const [newMilestone, setNewMilestone] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [newDueDate, setNewDueDate] = useState("")

  // Update local state when value prop changes
  useEffect(() => {
    setMilestones(Array.isArray(value) ? value : [])
  }, [value])

  const handleAddMilestone = () => {
    if (newMilestone && newAmount && newDueDate) {
      const amount = parseFloat(newAmount)
      if (!isNaN(amount)) {
        const updatedMilestones = [
          ...milestones,
          {
            milestone: newMilestone,
            amount,
            due_date: newDueDate
          }
        ]
        setMilestones(updatedMilestones)
        onChange(updatedMilestones)
        // Reset all input fields
        setNewMilestone("")
        setNewAmount("")
        setNewDueDate("")
      }
    }
  }

  const handleRemoveMilestone = (index: number) => {
    const newMilestones = milestones.filter((_, i) => i !== index)
    setMilestones(newMilestones)
    onChange(newMilestones)
  }

  const total = milestones.reduce((sum, milestone) => sum + milestone.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-2">
          <input
            type="text"
            placeholder="Milestone name"
            className="w-full bg-transparent focus:outline-none text-gray-900"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border border-gray-200 rounded-lg p-2">
            <input
              type="number"
              placeholder="Amount"
              className="w-32 bg-transparent focus:outline-none text-gray-900"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
          </div>
          <div className="relative bg-white border border-gray-200 rounded-lg p-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              className="w-48 pl-8 bg-transparent focus:outline-none text-gray-900"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </div>
          <button
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
            onClick={handleAddMilestone}
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {milestones.map((milestone, index) => (
          <div key={index} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3 gap-2 hover:border-gray-300 transition-colors">
            <div className="flex-1 space-y-1">
              <span className="font-medium text-gray-900 block">{milestone.milestone}</span>
              <span className="text-sm text-gray-500 block">
                Due: {new Date(milestone.due_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <span className="text-gray-900 font-medium">${milestone.amount.toFixed(2)}</span>
              </div>
              <button
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                onClick={() => handleRemoveMilestone(index)}
                title="Remove milestone"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between border-t border-gray-200 pt-2">
        <span className="font-medium text-gray-900">Total</span>
        <span className="font-medium text-gray-900">
          ${total.toLocaleString()}
        </span>
      </div>
    </div>
  )
} 