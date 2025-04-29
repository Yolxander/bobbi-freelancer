'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface SignatureInputProps {
  value: {
    providerName: string
    agreementDate: string
  }
  onChange: (value: { providerName: string; agreementDate: string }) => void
}

export default function SignatureInput({ value, onChange }: SignatureInputProps) {
  const [signature, setSignature] = useState(value)

  const handleChange = (field: keyof typeof signature, newValue: string) => {
    const updatedSignature = { ...signature, [field]: newValue }
    setSignature(updatedSignature)
    onChange(updatedSignature)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <Label>Provider Name</Label>
            <Input
              value={signature.providerName}
              onChange={(e) => handleChange('providerName', e.target.value)}
              placeholder="Enter provider name"
            />
          </div>

          <div>
            <Label>Date of Agreement</Label>
            <Input
              type="date"
              value={signature.agreementDate}
              onChange={(e) => handleChange('agreementDate', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
 