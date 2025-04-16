"use client"

import { useState, useEffect } from "react"
import { PenLine } from "lucide-react"

interface Signature {
  provider: string
  client: string
}

interface SignatureBlockProps {
  value?: string | Signature | null
  onChange: (value: Signature) => void
  readOnly?: boolean
}

export default function SignatureBlock({ value, onChange, readOnly = false }: SignatureBlockProps) {
  const [signature, setSignature] = useState<Signature>({ provider: "", client: "" })

  useEffect(() => {
    if (!value) {
      setSignature({ provider: "", client: "" })
      return
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        setSignature({
          provider: parsed?.provider || "",
          client: parsed?.client || ""
        })
      } catch (e) {
        setSignature({ provider: "", client: "" })
      }
    } else {
      setSignature({
        provider: value?.provider || "",
        client: value?.client || ""
      })
    }
  }, [value])

  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSignature = { ...signature, provider: e.target.value }
    setSignature(newSignature)
    onChange(newSignature)
  }

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSignature = { ...signature, client: e.target.value }
    setSignature(newSignature)
    onChange(newSignature)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <PenLine className="w-4 h-4 text-gray-500" />
        <h3 className="text-lg text-gray-700 font-medium">Signature</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
          <input
            type="text"
            className="bg-gray-50 text-gray-700 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            value={signature.provider}
            onChange={handleProviderChange}
            readOnly={readOnly}
            placeholder="Enter provider name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
          <input
            type="text"
            className="bg-gray-50 text-gray-700 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            value={signature.client}
            onChange={handleClientChange}
            readOnly={readOnly}
            placeholder="Enter client name"
          />
        </div>
      </div>
    </div>
  )
} 