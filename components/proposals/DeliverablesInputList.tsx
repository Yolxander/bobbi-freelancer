"use client"

import { useState } from "react"
import { Plus, Save, Trash2 } from "lucide-react"

interface DeliverablesInputListProps {
  value: string[]
  onChange: (value: string[]) => void
  readOnly?: boolean
}

export default function DeliverablesInputList({
  value,
  onChange,
  readOnly = false,
}: DeliverablesInputListProps) {
  const [newItem, setNewItem] = useState("")

  const handleAddItem = () => {
    if (newItem.trim() && !readOnly) {
      onChange([...value, newItem.trim()])
      setNewItem("")
    }
  }

  const handleRemoveItem = (index: number) => {
    if (!readOnly) {
      const newItems = [...value]
      newItems.splice(index, 1)
      onChange(newItems)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddItem()
    }
  }

  return (
    <div className="space-y-3">
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-2">
            {readOnly ? (
              <span className="text-gray-900">{item}</span>
            ) : (
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newItems = [...value]
                  newItems[index] = e.target.value
                  onChange(newItems)
                }}
                className="w-full bg-transparent focus:outline-none text-gray-900"
                placeholder="Enter deliverable"
              />
            )}
          </div>
          {!readOnly && (
            <button
              onClick={() => handleRemoveItem(index)}
              className="p-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}

      {!readOnly && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-white border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-900 transition-colors"
            placeholder="Add new deliverable"
          />
          <button
            onClick={handleAddItem}
            className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
} 