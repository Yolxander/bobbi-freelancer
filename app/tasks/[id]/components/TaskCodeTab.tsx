import { useState } from "react"
import { Code, Plus, Save, X, FileCode } from "lucide-react"

interface TaskCodeTabProps {
  codeSnippets: any[]
  onAddCodeSnippet: (e: React.FormEvent) => void
  onSaveCodeSnippet: (snippetId: string) => void
  onDeleteCodeSnippet: (snippetId: string) => void
  isEditorOpen: boolean
  setIsEditorOpen: (isOpen: boolean) => void
  newCodeSnippet: string
  setNewCodeSnippet: (code: string) => void
  editingSnippetId: string | null
  setEditingSnippetId: (id: string | null) => void
  editedSnippetContent: string
  setEditedSnippetContent: (content: string) => void
}

export default function TaskCodeTab({
  codeSnippets,
  onAddCodeSnippet,
  onSaveCodeSnippet,
  onDeleteCodeSnippet,
  isEditorOpen,
  setIsEditorOpen,
  newCodeSnippet,
  setNewCodeSnippet,
  editingSnippetId,
  setEditingSnippetId,
  editedSnippetContent,
  setEditedSnippetContent,
}: TaskCodeTabProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Code Snippets</h2>
        <button
          className="flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
          onClick={() => setIsEditorOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Add Code Snippet</span>
        </button>
      </div>

      {isEditorOpen && (
        <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">New Code Snippet</h3>
            <button
              onClick={() => setIsEditorOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={newCodeSnippet}
            onChange={(e) => setNewCodeSnippet(e.target.value)}
            placeholder="Enter your code here..."
            className="w-full h-48 font-mono text-sm border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-900 text-gray-900"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={onAddCodeSnippet}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
            >
              Save Snippet
            </button>
          </div>
        </div>
      )}

      {codeSnippets.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No code snippets yet</h3>
          <p className="text-gray-500 mb-4">Add code snippets to share with your team</p>
          <button
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            onClick={() => setIsEditorOpen(true)}
          >
            Add Code Snippet
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {codeSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {snippet.filename || "Untitled"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {editingSnippetId === snippet.id ? (
                    <>
                      <button
                        onClick={() => onSaveCodeSnippet(snippet.id)}
                        className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-1"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingSnippetId(null)}
                        className="p-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingSnippetId(snippet.id)
                          setEditedSnippetContent(snippet.content)
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteCodeSnippet(snippet.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="p-4">
                {editingSnippetId === snippet.id ? (
                  <textarea
                    value={editedSnippetContent}
                    onChange={(e) => setEditedSnippetContent(e.target.value)}
                    className="w-full h-48 font-mono text-sm border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-900 text-gray-900"
                  />
                ) : (
                  <pre className="font-mono text-sm text-gray-900 whitespace-pre-wrap">
                    {snippet.content}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 