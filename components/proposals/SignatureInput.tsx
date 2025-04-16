'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface SignatureInputProps {
  value: string
  onChange: (value: string) => void
}

export default function SignatureInput({ value, onChange }: SignatureInputProps) {
  const [signature, setSignature] = useState(() => {
    try {
      return JSON.parse(value)
    } catch {
      return {
        providerName: '',
        providerSignature: '',
        clientName: '',
        clientSignature: '',
        agreementDate: ''
      }
    }
  })

  const handleChange = (field: keyof typeof signature, newValue: string) => {
    const updatedSignature = { ...signature, [field]: newValue }
    setSignature(updatedSignature)
    onChange(JSON.stringify(updatedSignature))
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Provider Name</Label>
              <Input
                value={signature.providerName}
                onChange={(e) => handleChange('providerName', e.target.value)}
                placeholder="Enter provider name"
              />
            </div>
            <div>
              <Label>Provider Signature</Label>
              <Textarea
                value={signature.providerSignature}
                onChange={(e) => handleChange('providerSignature', e.target.value)}
                placeholder="Enter provider signature"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Client Name</Label>
              <Input
                value={signature.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                placeholder="Enter client name"
              />
            </div>
            <div>
              <Label>Client Signature</Label>
              <Textarea
                value={signature.clientSignature}
                onChange={(e) => handleChange('clientSignature', e.target.value)}
                placeholder="Enter client signature"
                className="min-h-[100px]"
              />
            </div>
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
 