import React from 'react'

interface LogoProps {
  width?: number
  height?: number
}

export default function Logo({ width = 200, height = 200 }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="200" height="200" rx="20" fill="#F0F4F8" />
      
      {/* Magnifying glass handle */}
      <path
        d="M125 125L170 170"
        stroke="#2B6CB0"
        strokeWidth="12"
        strokeLinecap="round"
      />
      
      {/* Magnifying glass body */}
      <circle cx="85" cy="85" r="55" fill="#4299E1" />
      <circle cx="85" cy="85" r="45" fill="#FFFFFF" />
      
      {/* Worker silhouette */}
      <path
        d="M70 70C70 62.268 76.268 56 84 56C91.732 56 98 62.268 98 70C98 77.732 91.732 84 84 84C76.268 84 70 77.732 70 70Z"
        fill="#2B6CB0"
      />
      <path
        d="M60 110C60 96.1929 71.1929 85 85 85C98.8071 85 110 96.1929 110 110V115H60V110Z"
        fill="#2B6CB0"
      />
      
      {/* Tools */}
      <path
        d="M75 95L65 105M95 95L105 105"
        stroke="#ED8936"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="85" cy="100" r="3" fill="#ED8936" />
    </svg>
  )
}