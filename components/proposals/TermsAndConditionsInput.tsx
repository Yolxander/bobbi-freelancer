'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface TermsAndConditionsInputProps {
  value: string
  onChange: (value: string) => void
}

export default function TermsAndConditionsInput({ value, onChange }: TermsAndConditionsInputProps) {
  const [terms, setTerms] = useState(() => {
    try {
      return JSON.parse(value)
    } catch {
      return {
        revisionLimits: '',
        intellectualProperty: '',
        confidentiality: '',
        termination: '',
        liability: '',
        governingLaw: ''
      }
    }
  })

  const handleChange = (field: keyof typeof terms, newValue: string) => {
    const updatedTerms = { ...terms, [field]: newValue }
    setTerms(updatedTerms)
    onChange(JSON.stringify(updatedTerms))
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <Label>Revision Limits</Label>
            <Textarea
              value={terms.revisionLimits}
              onChange={(e) => handleChange('revisionLimits', e.target.value)}
              placeholder="Specify the number of revisions included and any additional revision fees"
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Intellectual Property</Label>
            <Textarea
              value={terms.intellectualProperty}
              onChange={(e) => handleChange('intellectualProperty', e.target.value)}
              placeholder="Define ownership rights and usage terms for the final deliverables"
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Confidentiality</Label>
            <Textarea
              value={terms.confidentiality}
              onChange={(e) => handleChange('confidentiality', e.target.value)}
              placeholder="Outline confidentiality obligations and data protection measures"
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Termination</Label>
            <Textarea
              value={terms.termination}
              onChange={(e) => handleChange('termination', e.target.value)}
              placeholder="Specify conditions for contract termination and associated fees"
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Liability</Label>
            <Textarea
              value={terms.liability}
              onChange={(e) => handleChange('liability', e.target.value)}
              placeholder="Define liability limits and indemnification terms"
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Governing Law</Label>
            <Textarea
              value={terms.governingLaw}
              onChange={(e) => handleChange('governingLaw', e.target.value)}
              placeholder="Specify the governing law and jurisdiction for any disputes"
              className="min-h-[100px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 