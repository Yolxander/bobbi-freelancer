'use client'

import { useState } from 'react'

const testimonials = [
  {
    id: 1,
    name: 'TAYLOR BALLAM',
    role: 'MODO STUDIOS',
    quote: 'We explored the best of Tokyo, Kyoto, and Osaka, all without the usual travel stress. Truly a trip of a lifetime!',
  },
  {
    id: 2,
    name: 'ESTHER HOWARD',
    role: 'Creative Director',
    quote: 'The attention to detail and creative approach brought our vision to life perfectly.',
  },
  // Add more testimonials as needed
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-20">
          <h2 className="text-5xl font-medium max-w-xl">
            Client about
            <br />
            our work
          </h2>
          <span className="text-lg">
            From Concept To
            <br />
            Completion
          </span>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Navigation Arrow - Previous */}
          <button
            onClick={prevTestimonial}
            className="col-span-1 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Main Testimonial Card */}
          <div className="col-span-4 relative">
            <div className="aspect-[3/4] relative rounded-3xl overflow-hidden bg-[#2BD7D7] p-8 flex flex-col justify-end">
              <div className="absolute top-8 left-8 text-6xl font-bold opacity-20">
                {String(currentIndex + 1).padStart(2, '0')}
              </div>
              <div className="relative z-10">
                <h3 className="font-medium text-2xl">-{testimonials[currentIndex].name}</h3>
                <p className="text-black/70">{testimonials[currentIndex].role}</p>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="col-span-5 px-12">
            <div className="text-[120px] text-gray-200 leading-none mb-[-40px]">"</div>
            <blockquote className="text-3xl font-medium leading-relaxed">
              {testimonials[currentIndex].quote}
            </blockquote>
          </div>

          {/* Navigation */}
          <div className="col-span-1 flex items-center">
            <span className="text-2xl font-medium">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Navigation Arrow - Next */}
          <button
            onClick={nextTestimonial}
            className="col-span-1 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
} 