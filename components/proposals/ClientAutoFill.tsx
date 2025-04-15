"use client"

import { useState, useEffect } from "react"
import { ChevronDown, X, Search } from "lucide-react"
import { getClients } from "@/app/actions/client-actions"
import { useAuth } from "@/lib/auth-context"

interface ClientAutoFillProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
}

export default function ClientAutoFill({ value, onChange, readOnly = false }: ClientAutoFillProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [filteredClients, setFilteredClients] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      if (!user?.providerId) return

      try {
        setIsLoading(true)
        const result = await getClients(user.providerId)
        if (result.success) {
          setClients(result.data || [])
          setFilteredClients(result.data || [])
        } else {
          setError(result.error || "Failed to load clients")
        }
      } catch (err) {
        setError("Failed to load clients")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [user?.providerId])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredClients(filtered)
    }
  }, [searchQuery, clients])

  const selectedClient = clients?.find((client) => client.id === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !readOnly && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-2 border border-gray-200 rounded-lg ${
          readOnly ? "bg-gray-50" : "hover:border-gray-300"
        }`}
      >
        <span className="text-gray-700">
          {selectedClient ? selectedClient.name : "Select a client"}
        </span>
        {!readOnly && <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>

      {!readOnly && isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading clients...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : filteredClients?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No clients found</div>
          ) : (
            <div className="py-1">
              {filteredClients?.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => {
                    onChange(client.id)
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  {client.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedClient && !readOnly && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-8 top-2 p-1 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
} 