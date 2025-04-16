'use client'

import { useState, useEffect } from 'react'
import DateRangePicker from './DateRangePicker'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface TimelineInputProps {
  startDate: string
  endDate: string
  onChange: (value: { start: string; end: string }) => void
}

export default function TimelineInput({ startDate, endDate, onChange }: TimelineInputProps) {
  const [start, setStart] = useState(startDate)
  const [end, setEnd] = useState(endDate)

  useEffect(() => {
    setStart(startDate)
    setEnd(endDate)
  }, [startDate, endDate])

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label>Project Timeline</Label>
            <DateRangePicker
              value={{ start, end }}
              onChange={onChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 