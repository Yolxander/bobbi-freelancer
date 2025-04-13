interface TaskTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isWebDeveloper: boolean
  githubRepo: any
}

export default function TaskTabs({ activeTab, setActiveTab, isWebDeveloper, githubRepo }: TaskTabsProps) {
  return (
    <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
      <button
        className={`px-4 py-3 text-sm font-medium ${activeTab === "details" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        onClick={() => setActiveTab("details")}
      >
        Details
      </button>
      <button
        className={`px-4 py-3 text-sm font-medium ${activeTab === "subtasks" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        onClick={() => setActiveTab("subtasks")}
      >
        Subtasks
      </button>
      {isWebDeveloper && (
        <button
          className={`px-4 py-3 text-sm font-medium ${activeTab === "code" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("code")}
        >
          Code Snippets
        </button>
      )}
      <button
        className={`px-4 py-3 text-sm font-medium ${activeTab === "issues" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        onClick={() => setActiveTab("issues")}
      >
        Issues
      </button>
      {githubRepo && (
        <button
          className={`px-4 py-3 text-sm font-medium ${activeTab === "deployments" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("deployments")}
        >
          Deployments
        </button>
      )}
      <button
        className={`px-4 py-3 text-sm font-medium ${activeTab === "activity" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        onClick={() => setActiveTab("activity")}
      >
        Activity
      </button>
    </div>
  )
} 