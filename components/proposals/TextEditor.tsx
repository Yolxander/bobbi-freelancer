"use client"

import { useState, useEffect, useRef } from "react"
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
  const editorRef = useRef<HTMLDivElement>(null)
  const [history, setHistory] = useState<string[]>([value])
  const [historyIndex, setHistoryIndex] = useState(0)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML
      onChange(newValue)

      // Update history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newValue)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      document.execCommand("insertLineBreak")
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
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
            onClick={() => execCommand("bold")}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => execCommand("italic")}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => execCommand("insertUnorderedList")}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => execCommand("insertOrderedList")}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => execCommand("formatBlock", "blockquote")}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => execCommand("justifyLeft")}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => execCommand("justifyCenter")}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            onClick={() => execCommand("justifyRight")}
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

      <div
        ref={editorRef}
        className={`p-4 min-h-[200px] focus:outline-none ${
          readOnly ? "bg-gray-50" : "bg-white"
        }`}
        contentEditable={!readOnly}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  )
} 