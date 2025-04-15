"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

interface BudgetItem {
  item: string
  amount: number
}

interface BudgetInputListProps {
  value: BudgetItem[]
  onChange: (value: BudgetItem[]) => void
  readOnly?: boolean
}

export default function BudgetInputList({ value, onChange, readOnly = false }: BudgetInputListProps) {
  const [items, setItems] = useState<BudgetItem[]>(value || [])

  const handleAddItem = () => {
    const newItems = [...items, { item: "", amount: 0 }]
    setItems(newItems)
    onChange(newItems)
  }

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
    onChange(newItems)
  }

  const handleItemChange = (index: number, field: keyof BudgetItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
    onChange(newItems)
  }

  const total = items.reduce((sum, item) => sum + (item.amount || 0), 0)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="Item description"
              className="bg-gray-50 text-gray-700 flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={item.item}
              onChange={(e) => handleItemChange(index, "item", e.target.value)}
              readOnly={readOnly}
            />
            <input
              type="number"
              placeholder="Amount"
              className="bg-gray-50 text-gray-700 w-32 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={item.amount}
              onChange={(e) => handleItemChange(index, "amount", parseFloat(e.target.value) || 0)}
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
          <span>Add Item</span>
        </button>
      )}

      <div className="flex justify-between border-t border-gray-200 pt-2">
        <span className="font-medium text-gray-900">Total</span>
        <span className="font-medium text-gray-900">
          ${total.toLocaleString()}
        </span>
      </div>
    </div>
  )
} 