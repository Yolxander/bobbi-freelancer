"use client"

import { useState } from "react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react"

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
}

export default function TextEditor({ value, onChange, readOnly = false }: TextEditorProps) {
  const [history, setHistory] = useState<string[]>([value])
  const [historyIndex, setHistoryIndex] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Update history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newValue)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex])
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {!readOnly && (
        <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1">
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => document.execCommand("bold", false)}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => document.execCommand("italic", false)}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => document.execCommand("insertUnorderedList", false)}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => document.execCommand("insertOrderedList", false)}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => document.execCommand("formatBlock", false, "blockquote")}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => document.execCommand("justifyLeft", false)}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => document.execCommand("justifyCenter", false)}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => document.execCommand("justifyRight", false)}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={handleUndo}
            disabled={historyIndex === 0}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      )}

      <textarea
        value={value}
        onChange={handleChange}
        className={`w-full p-4 min-h-[200px] focus:outline-none text-gray-700 ${
          readOnly ? "bg-gray-50" : "bg-white"
        }`}
        readOnly={readOnly}
        placeholder="Enter your text here..."
      />
    </div>
  )
} 