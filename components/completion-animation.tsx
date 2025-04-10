"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Award, PartyPopper } from "lucide-react"
import confetti from "canvas-confetti"

interface CompletionAnimationProps {
  type: "task" | "project"
  show: boolean
  onComplete?: () => void
}

export function CompletionAnimation({ type, show, onComplete }: CompletionAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const confettiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (show) {
      setIsVisible(true)

      // For project completion, trigger confetti
      if (type === "project" && confettiRef.current) {
        const rect = confettiRef.current.getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top + rect.height / 2

        // First burst
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: x / window.innerWidth, y: y / window.innerHeight },
          colors: ["#4CAF50", "#2196F3", "#FFC107", "#E91E63", "#9C27B0"],
        })

        // Second burst with slight delay
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: x / window.innerWidth, y: y / window.innerHeight },
            colors: ["#4CAF50", "#2196F3", "#FFC107", "#E91E63", "#9C27B0"],
          })

          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: x / window.innerWidth, y: y / window.innerHeight },
            colors: ["#4CAF50", "#2196F3", "#FFC107", "#E91E63", "#9C27B0"],
          })
        }, 300)
      }

      // Hide after animation completes
      const timer = setTimeout(
        () => {
          setIsVisible(false)
          if (onComplete) onComplete()
        },
        type === "project" ? 4000 : 2000,
      )

      return () => clearTimeout(timer)
    }
  }, [show, type, onComplete])

  if (type === "project") {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={confettiRef}
              className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center max-w-md text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.2, type: "spring", damping: 10, stiffness: 200 }}
                className="mb-4"
              >
                <div className="relative">
                  <PartyPopper className="w-20 h-20 text-yellow-500" />
                  <motion.div
                    className="absolute inset-0 bg-yellow-400 rounded-full opacity-30"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 0] }}
                    transition={{ repeat: 2, duration: 1, delay: 0.5 }}
                  />
                </div>
              </motion.div>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <h2 className="text-2xl font-bold mb-2">Project Completed!</h2>
                <p className="text-gray-600 mb-4">Congratulations! You've successfully completed this project.</p>
              </motion.div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }}>
                <Award className="w-12 h-12 text-blue-600" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Task completion animation (smaller)
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <motion.div
            className="bg-green-50 text-green-700 rounded-full px-4 py-3 shadow-lg flex items-center gap-2"
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="relative"
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
              <motion.div
                className="absolute inset-0 bg-green-400 rounded-full opacity-30"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 0] }}
                transition={{ duration: 1 }}
              />
            </motion.div>
            <motion.p
              className="font-medium"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Task completed!
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
