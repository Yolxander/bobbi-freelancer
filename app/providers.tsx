'use client'

import { ProposalsProvider } from '@/lib/proposals-context'
import { ClientsProvider } from '@/lib/clients-context'
import { ProjectsProvider } from '@/lib/projects-context'
import { ToastProvider } from '@/lib/toast-context'
import { AuthProvider } from '@/lib/auth-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProposalsProvider>
        <ClientsProvider>
          <ProjectsProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ProjectsProvider>
        </ClientsProvider>
      </ProposalsProvider>
    </AuthProvider>
  )
} 