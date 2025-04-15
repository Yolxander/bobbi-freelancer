"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

interface DeliverablesInputListProps {
  value: string[]
  onChange: (value: string[]) => void
  readOnly?: boolean
}

export default function DeliverablesInputList({ value, onChange, readOnly = false }: DeliverablesInputListProps) {
  const [items, setItems] = useState<string[]>(value || [])

  const handleAddItem = () => {
    const newItems = [...items, ""]
    setItems(newItems)
    onChange(newItems)
  }

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
    onChange(newItems)
  }

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    setItems(newItems)
    onChange(newItems)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter deliverable"
              className="bg-gray-50 text-gray-700 flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              readOnly={readOnly}
            />
            {!readOnly && (
              <button
                onClick={() => handleRemoveItem(index)}
                className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Deliverable</span>
        </button>
      )}
    </div>
  )
} 