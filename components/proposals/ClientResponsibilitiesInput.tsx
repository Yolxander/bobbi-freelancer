'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface ClientResponsibilitiesInputProps {
  value: string
  onChange: (value: string) => void
}

export default function ClientResponsibilitiesInput({ value, onChange }: ClientResponsibilitiesInputProps) {
  const [responsibilities, setResponsibilities] = useState(() => {
    try {
      return JSON.parse(value)
    } catch {
      return {
        assets: '',
        feedback: '',
        pointOfContact: ''
      }
    }
  })

  const handleChange = (field: keyof typeof responsibilities, newValue: string) => {
    const updatedResponsibilities = { ...responsibilities, [field]: newValue }
    setResponsibilities(updatedResponsibilities)
    onChange(JSON.stringify(updatedResponsibilities))
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <Label>Required Assets</Label>
            <Textarea
              value={responsibilities.assets}
              onChange={(e) => handleChange('assets', e.target.value)}
              placeholder="List all required assets from the client (logos, copy, login credentials, etc.) and when they are needed"
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Feedback and Approvals</Label>
            <Textarea
              value={responsibilities.feedback}
              onChange={(e) => handleChange('feedback', e.target.value)}
              placeholder="Specify the expected timeline for feedback and approvals"
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Point of Contact</Label>
            <Textarea
              value={responsibilities.pointOfContact}
              onChange={(e) => handleChange('pointOfContact', e.target.value)}
              placeholder="Specify the main point of contact and their responsibilities"
              className="min-h-[100px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 