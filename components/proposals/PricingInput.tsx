'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PricingInputProps {
  value: string
  onChange: (value: string) => void
}

interface PricingData {
  amount: string
  currency: string
  type: string
}

export default function PricingInput({ value, onChange }: PricingInputProps) {
  const [pricing, setPricing] = useState<PricingData>(() => {
    try {
      return JSON.parse(value)
    } catch {
      return { amount: '', currency: 'USD', type: 'fixed' }
    }
  })

  useEffect(() => {
    try {
      setPricing(JSON.parse(value))
    } catch {
      setPricing({ amount: '', currency: 'USD', type: 'fixed' })
    }
  }, [value])

  const handleChange = (field: keyof PricingData, newValue: string) => {
    const updatedPricing = { ...pricing, [field]: newValue }
    setPricing(updatedPricing)
    onChange(JSON.stringify(updatedPricing))
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={pricing.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Select
                value={pricing.currency}
                onValueChange={(value) => handleChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Pricing Type</Label>
            <Select
              value={pricing.type}
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pricing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Price</SelectItem>
                <SelectItem value="hourly">Hourly Rate</SelectItem>
                <SelectItem value="monthly">Monthly Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 