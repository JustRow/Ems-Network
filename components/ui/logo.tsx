'use client'

import React from 'react'

type Size = 'xs' | 'sm' | 'md' | 'lg'

export function Logo({
  size = 'md',
  rounded = false,
  className = ''
}: {
  size?: Size
  rounded?: boolean
  className?: string
}) {
  const sizeMap: Record<Size, string> = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  }

  const classes = `${sizeMap[size]} ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`.trim()

  return (
    <img
      src="/PHOTO-2026-06-09-22-06-58.jpg"
      alt="EMS Network"
      className={classes}
    />
  )
}
