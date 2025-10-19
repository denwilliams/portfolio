import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dennis Williams - Interactive Portfolio',
  description: 'An interactive portfolio featuring AI-powered chat interface to learn about Dennis Williams\' professional background and expertise.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
