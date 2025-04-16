import Sidebar from "@/components/sidebar"

export default function ClientsLoading() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Search Skeleton */}
          <div className="mb-6">
            <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
          </div>

          {/* Clients Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div>
                      <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
