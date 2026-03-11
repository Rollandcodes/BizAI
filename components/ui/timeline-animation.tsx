'use client'

import React, { ReactNode, useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

interface TimelineContentProps {
  children: ReactNode
  as?: keyof React.JSX.IntrinsicElements
  animationNum?: number
  timelineRef: React.RefObject<HTMLElement | null>
  customVariants?: Record<string, any>
  className?: string
}

export function TimelineContent({
  children,
  as: Component = 'div',
  animationNum = 0,
  timelineRef,
  customVariants,
  className = '',
  ...props
}: TimelineContentProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const variants = customVariants || {
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: animationNum * 0.2 },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
      {...props}
    >
      {Component === 'div' ? (
        <div>{children}</div>
      ) : Component === 'p' ? (
        <p>{children}</p>
      ) : (
        children
      )}
    </motion.div>
  )
}
