'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  faqs: FAQItem[]
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-white/10 bg-[#16213e]/50"
        >
          <button
            onClick={() => toggle(index)}
            className="flex w-full items-center justify-between px-6 py-4 text-left text-white transition-colors hover:bg-white/5"
          >
            <span className="font-medium">{faq.question}</span>
            <span className="ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-white/20 text-sm text-[#e8a020]">
              {openIndex === index ? '×' : '+'}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="px-6 pb-4 text-white/70">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
