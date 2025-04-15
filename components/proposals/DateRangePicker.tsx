"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"

interface DateRange {
  start: string
  end: string
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (value: DateRange) => void
  readOnly?: boolean
}

export default function DateRangePicker({ value, onChange, readOnly = false }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState(value.start)
  const [endDate, setEndDate] = useState(value.end)

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    setStartDate(newStartDate)
    onChange({ start: newStartDate, end: endDate })
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value
    setEndDate(newEndDate)
    onChange({ start: startDate, end: newEndDate })
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-500" />
        <input
          type="date"
          className="bg-gray-50 text-gray-700 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          value={startDate}
          onChange={handleStartDateChange}
          readOnly={readOnly}
        />
      </div>
      <span className="text-gray-500">to</span>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-500" />
        <input
          type="date"
          className="bg-gray-50 text-gray-700 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          value={endDate}
          onChange={handleEndDateChange}
          readOnly={readOnly}
        />
      </div>
    </div>
  )
} 