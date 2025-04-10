// This file now mocks the Supabase client for development purposes
// In production, this would connect to a real Supabase instance

// Mock client that returns dummy data
const createMockClient = () => {
  return {
    auth: {
      getUser: async () => ({ data: { user: { id: "provider-1" } }, error: null }),
      signOut: async () => ({ error: null }),
      admin: {
        getUserById: async (id) => ({
          data: {
            user: {
              id,
              email: "user@example.com",
              user_metadata: { full_name: "Test User" },
            },
          },
          error: null,
        }),
      },
    },
    from: (table) => ({
      select: (query = "*") => ({
        eq: (column, value) => ({
          order: (column, { ascending = true } = {}) => ({
            limit: (limit) => ({
              single: async () => ({ data: null, error: null }),
              maybeSingle: async () => ({ data: null, error: null }),
              execute: async () => ({ data: [], error: null }),
            }),
            execute: async () => ({ data: [], error: null }),
          }),
          limit: (limit) => ({
            single: async () => ({ data: null, error: null }),
            maybeSingle: async () => ({ data: null, error: null }),
            execute: async () => ({ data: [], error: null }),
          }),
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
          execute: async () => ({ data: [], error: null }),
        }),
        order: (column, { ascending = true } = {}) => ({
          execute: async () => ({ data: [], error: null }),
        }),
        limit: (limit) => ({
          execute: async () => ({ data: [], error: null }),
        }),
        execute: async () => ({ data: [], error: null }),
      }),
      insert: (data) => ({
        select: () => ({
          single: async () => ({ data: { ...data, id: `mock-${Date.now()}` }, error: null }),
          execute: async () => ({ data: [{ ...data, id: `mock-${Date.now()}` }], error: null }),
        }),
        execute: async () => ({ data: [{ ...data, id: `mock-${Date.now()}` }], error: null }),
      }),
      update: (data) => ({
        eq: (column, value) => ({
          execute: async () => ({ data: null, error: null }),
        }),
      }),
      delete: () => ({
        eq: (column, value) => ({
          execute: async () => ({ data: null, error: null }),
        }),
      }),
    }),
  }
}

// Export mock functions that match the original API
export function getSupabaseBrowserClient() {
  return createMockClient()
}

export function createAdminClient() {
  return createMockClient()
}

export function createServerClient(cookieStore) {
  return createMockClient()
}

export const createClient = () => createMockClient()
