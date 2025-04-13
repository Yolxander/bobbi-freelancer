"use client"

import { useState } from "react"
import Image from "next/image"
import {
  FileUp,
  Circle,
  Search,
  Paperclip,
  Send,
  Info,
  Plus,
  Phone,
  Video,
  MoreHorizontal,
  ArrowLeft,
  Smile,
} from "lucide-react"
import Link from "next/link"
import Sidebar from "./components/sidebar"

export default function MessagingPage() {
  const [activeConversation, setActiveConversation] = useState(0)

  const conversations = [
    {
      id: 0,
      client: "Acme Inc.",
      contact: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Great! Looking forward to seeing them.",
      time: "11:20 AM",
      unread: true,
      online: true,
      messages: [
        { sender: "client", content: "Can we get an update on the website redesign progress?", time: "10:34 AM" },
        {
          sender: "provider",
          content: "Yes, we're finalizing the mockups today. I'll send them over for review.",
          time: "11:15 AM",
        },
        { sender: "client", content: "Great! Looking forward to seeing them.", time: "11:20 AM" },
      ],
    },
    {
      id: 1,
      client: "TechStart",
      contact: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "When can we schedule the next meeting?",
      time: "Yesterday",
      unread: false,
      online: false,
      messages: [
        {
          sender: "provider",
          content: "I've sent over the initial wireframes for the mobile app.",
          time: "Yesterday, 2:15 PM",
        },
        {
          sender: "client",
          content: "These look great! I have a few suggestions for the user flow.",
          time: "Yesterday, 3:30 PM",
        },
        { sender: "client", content: "When can we schedule the next meeting?", time: "Yesterday, 3:32 PM" },
      ],
    },
    {
      id: 2,
      client: "GreenGrow",
      contact: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "The new logo designs look amazing!",
      time: "Monday",
      unread: false,
      online: true,
      messages: [
        { sender: "provider", content: "Here are the three logo options we discussed.", time: "Monday, 10:00 AM" },
        { sender: "client", content: "The new logo designs look amazing!", time: "Monday, 11:45 AM" },
      ],
    },
    {
      id: 3,
      client: "BlueSky Media",
      contact: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Can you provide a timeline for the next phase?",
      time: "Mar 15",
      unread: false,
      online: false,
      messages: [
        { sender: "client", content: "How's the social media campaign coming along?", time: "Mar 15, 9:20 AM" },
        {
          sender: "provider",
          content: "We're on track. The first posts will go live next week.",
          time: "Mar 15, 10:05 AM",
        },
        { sender: "client", content: "Can you provide a timeline for the next phase?", time: "Mar 15, 10:30 AM" },
      ],
    },
  ]

  const activeClient = conversations[activeConversation]

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                <Plus className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full bg-gray-100 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none text-gray-700"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation, index) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${activeConversation === index ? "bg-gray-50" : ""}`}
                onClick={() => setActiveConversation(index)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={conversation.avatar || "/placeholder.svg"}
                        alt={conversation.contact}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate text-gray-900">{conversation.client}</h3>
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      {conversation.unread && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation View */}
        <div className="flex-1 flex flex-col">
          {/* Conversation Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="md:hidden p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={activeClient.avatar || "/placeholder.svg"}
                    alt={activeClient.contact}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                {activeClient.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{activeClient.client}</h3>
                <p className="text-xs text-gray-500">{activeClient.online ? "Online" : "Offline"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Phone className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Video className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Info className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Client Info Panel */}
          <div className="flex-1 flex">
            {/* Messages */}
            <div className="flex-1 flex flex-col">
              {/* Message List */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {activeClient.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === "provider" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "provider" ? "bg-blue-100 text-gray-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Paperclip className="w-5 h-5 text-gray-500" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none text-gray-700"
                  />
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Smile className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 bg-blue-500 text-white rounded-full">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Client Details Sidebar */}
            <div className="w-80 border-l border-gray-100 p-4 hidden lg:block">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
                  <Image
                    src={activeClient.avatar || "/placeholder.svg"}
                    alt={activeClient.contact}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg text-gray-900">{activeClient.contact}</h3>
                <p className="text-sm text-gray-500">{activeClient.client}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                  <span className="text-xs text-gray-500">{activeClient.online ? "Online" : "Offline"}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <button className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-medium mr-2 text-gray-700">Contact</button>
                <button className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">Projects</button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">CLIENT INFORMATION</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="mb-2">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">
                        {activeClient.contact.toLowerCase().replace(" ", ".")}@
                        {activeClient.client.toLowerCase().replace(" ", "")}.com
                      </p>
                    </div>
                    <div className="mb-2">
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">(555) 123-4567</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Company</p>
                      <p className="text-sm text-gray-900">{activeClient.client}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">ACTIVE PROJECTS</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-900">Website Redesign</p>
                      <div className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">In Progress</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-900">Brand Identity</p>
                      <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded">Review</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">SHARED FILES</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <FileUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate text-gray-900">website-mockup-v2.pdf</p>
                        <p className="text-xs text-gray-500">2.4 MB • Yesterday</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <FileUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate text-gray-900">logo-options.zip</p>
                        <p className="text-xs text-gray-500">4.7 MB • Mar 15</p>
                      </div>
                    </div>
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

function Logo() {
  return (
    <Link href="/">
      <div className="flex flex-col cursor-pointer">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-black rounded-sm"></div>
          <div className="w-5 h-5 bg-black rounded-sm"></div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="w-5 h-5 bg-black rounded-sm"></div>
          <div className="w-5 h-5 bg-black rounded-sm"></div>
        </div>
      </div>
    </Link>
  )
}
