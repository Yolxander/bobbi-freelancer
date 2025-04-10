import Sidebar from "@/components/sidebar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ClientDetailLoading() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href="/clients" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to Clients</span>
            </Link>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div>
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-10 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-10 w-36 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Client Details Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-6">
                  <div>
                    <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                    <div className="bg-gray-100 rounded-xl p-4 space-y-3">
                      <div className="h-5 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="h-5 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="h-5 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </div>

                  <div>
                    <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                    <div className="bg-gray-100 rounded-xl p-4">
                      <div className="h-20 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="h-6 w-24 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="bg-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                          <div>
                            <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse mb-1"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
