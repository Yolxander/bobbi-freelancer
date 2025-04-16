'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Client {
  id: string
  name: string
  email: string
  company?: string
  created_at?: string
  updated_at?: string
}

interface ClientsContextType {
  clients: Client[]
  addClient: (client: Client) => void
  updateClient: (client: Client) => void
  deleteClient: (id: string) => void
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined)

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])

  const addClient = (client: Client) => {
    setClients([...clients, client])
  }

  const updateClient = (updatedClient: Client) => {
    setClients(clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    ))
  }

  const deleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id))
  }

  return (
    <ClientsContext.Provider value={{ clients, addClient, updateClient, deleteClient }}>
      {children}
    </ClientsContext.Provider>
  )
}

export function useClients() {
  const context = useContext(ClientsContext)
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientsProvider')
  }
  return context
} 