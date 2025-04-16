import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"

interface PaymentScheduleInputProps {
  value: Record<string, number>
  onChange: (value: Record<string, number>) => void
}

export default function PaymentScheduleInput({ value, onChange }: PaymentScheduleInputProps) {
  const [newMilestone, setNewMilestone] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [milestones, setMilestones] = useState<Record<string, number>>(value || {})

  // Update local state when value prop changes
  useEffect(() => {
    setMilestones(value || {})
  }, [value])

  const handleAddMilestone = () => {
    if (newMilestone && newAmount) {
      const amount = parseFloat(newAmount)
      if (!isNaN(amount)) {
        const updatedMilestones = {
          ...milestones,
          [newMilestone]: amount
        }
        setMilestones(updatedMilestones)
        onChange(updatedMilestones)
        setNewMilestone("")
        setNewAmount("")
      }
    }
  }

  const handleRemoveMilestone = (milestone: string) => {
    const newValue = { ...milestones }
    delete newValue[milestone]
    setMilestones(newValue)
    onChange(newValue)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Milestone name"
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newMilestone}
          onChange={(e) => setNewMilestone(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          className="w-32 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
        />
        <button
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          onClick={handleAddMilestone}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        {Object.entries(milestones).map(([milestone, amount]) => (
          <div key={milestone} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
            <span className="font-medium">{milestone}</span>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">${amount.toFixed(2)}</span>
              <button
                className="text-gray-400 hover:text-red-500 transition-colors"
                onClick={() => handleRemoveMilestone(milestone)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 