"use client"

import { useState } from "react"
import { PenLine } from "lucide-react"

interface Signature {
  name: string
  title: string
  date: string
}

interface SignatureBlockProps {
  value: Signature
  onChange: (value: Signature) => void
  readOnly?: boolean
}

export default function SignatureBlock({ value, onChange, readOnly = false }: SignatureBlockProps) {
  const [name, setName] = useState(value.name)
  const [title, setTitle] = useState(value.title)
  const [date, setDate] = useState(value.date)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    onChange({ name: newName, title, date })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    onChange({ name, title: newTitle, date })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setDate(newDate)
    onChange({ name, title, date: newDate })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <PenLine className="w-4 h-4 text-gray-500" />
        <h3 className="text-lg text-gray-700 font-medium">Signature</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            className="bg-gray-50 text-gray-700 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            value={name}
            onChange={handleNameChange}
            readOnly={readOnly}
            placeholder="Enter name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="bg-gray-50 text-gray-700 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            value={title}
            onChange={handleTitleChange}
            readOnly={readOnly}
            placeholder="Enter title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            className="bg-gray-50 text-gray-700 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            value={date}
            onChange={handleDateChange}
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  )
} 