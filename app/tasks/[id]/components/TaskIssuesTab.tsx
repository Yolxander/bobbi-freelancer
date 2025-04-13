"use client"

import { useState } from "react"
import { Plus, AlertCircle, Edit, Trash } from "lucide-react"
import { IssueData, createIssue, updateIssue, deleteIssue } from "@/app/actions/issue-actions"

interface TaskIssuesTabProps {
  taskId: string
  issues: any[]
  onIssuesChange: () => void
}

export default function TaskIssuesTab({ taskId, issues, onIssuesChange }: TaskIssuesTabProps) {
  const [isAddingIssue, setIsAddingIssue] = useState(false)
  const [isEditingIssue, setIsEditingIssue] = useState(false)
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null)
  const [newIssue, setNewIssue] = useState<IssueData>({
    task_id: taskId,
    title: "",
    description: "",
    status: "open",
    fix: "",
    code_snippet: "",
  })

  const handleSaveIssue = async () => {
    if (!newIssue.title) return

    if (isEditingIssue && editingIssueId) {
      const result = await updateIssue(editingIssueId, newIssue)
      if (result.success) {
        setIsEditingIssue(false)
        setEditingIssueId(null)
        setNewIssue({
          task_id: taskId,
          title: "",
          description: "",
          status: "open",
          fix: "",
          code_snippet: "",
        })
        onIssuesChange()
      }
    } else {
      const result = await createIssue(newIssue)
      if (result.success) {
        setIsAddingIssue(false)
        setNewIssue({
          task_id: taskId,
          title: "",
          description: "",
          status: "open",
          fix: "",
          code_snippet: "",
        })
        onIssuesChange()
      }
    }
  }

  const handleEditIssue = (issue: any) => {
    setIsAddingIssue(true)
    setIsEditingIssue(true)
    setEditingIssueId(issue.id)
    setNewIssue({
      task_id: taskId,
      title: issue.title,
      description: issue.description || "",
      status: issue.status,
      fix: issue.fix || "",
      code_snippet: issue.code_snippet || "",
    })
  }

  const handleDeleteIssue = async (issueId: string) => {
    if (confirm("Are you sure you want to delete this issue?")) {
      const result = await deleteIssue(issueId, taskId)
      if (result.success) {
        onIssuesChange()
      }
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900 text-lg font-semibold">Known Issues & Fixes</h2>
        <button
          className="flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
          onClick={() => {
            setIsAddingIssue(true)
            setIsEditingIssue(false)
            setEditingIssueId(null)
            setNewIssue({
              task_id: taskId,
              title: "",
              description: "",
              status: "open",
              fix: "",
              code_snippet: "",
            })
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Issue</span>
        </button>
      </div>

      {isAddingIssue && (
        <div className="flex flex-col gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
            <input
              type="text"
              value={newIssue.title}
              onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
              placeholder="Enter issue title..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={newIssue.status}
              onChange={(e) => setNewIssue({ ...newIssue, status: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-900"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newIssue.description}
              onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
              placeholder="Describe the issue..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-900 min-h-[80px] resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fix Solution</label>
            <textarea
              value={newIssue.fix}
              onChange={(e) => setNewIssue({ ...newIssue, fix: e.target.value })}
              placeholder="Describe how to fix the issue..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-900 min-h-[80px] resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fix Code</label>
            <textarea
              value={newIssue.code_snippet}
              onChange={(e) => setNewIssue({ ...newIssue, code_snippet: e.target.value })}
              placeholder="Enter the code that fixes the issue..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-900 min-h-[120px] resize-y font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setIsAddingIssue(false)
                setNewIssue({
                  task_id: taskId,
                  title: "",
                  description: "",
                  status: "open",
                  fix: "",
                  code_snippet: "",
                })
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveIssue}
              className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm hover:bg-gray-800 transition-colors"
            >
              Save Issue
            </button>
          </div>
        </div>
      )}

      {issues.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No issues reported</h3>
          <p className="text-gray-500 mb-4">Track bugs and their fixes for this task</p>
          <button
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            onClick={() => setIsAddingIssue(true)}
          >
            Report First Issue
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      issue.status === "open"
                        ? "bg-red-500"
                        : issue.status === "in-progress"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  ></span>
                  <h3 className="font-medium">{issue.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      issue.status === "open"
                        ? "bg-red-100 text-red-700"
                        : issue.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {issue.status === "open"
                      ? "Open"
                      : issue.status === "in-progress"
                        ? "In Progress"
                        : "Fixed"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleEditIssue(issue)}
                    className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteIssue(issue.id)}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{issue.description}</p>
                </div>

                {issue.status === "fixed" && issue.fix && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Fix Solution</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{issue.fix}</p>
                  </div>
                )}

                {issue.status === "fixed" && issue.code_snippet && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Fix Code</h4>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs">
                      <code>{issue.code_snippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 