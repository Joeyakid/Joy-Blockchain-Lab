import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Blockchain Simulator',
  description: 'Interactive blockchain simulator with mining and transaction validation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Navigation />
        {children}
      </body>
    </html>
  )
}
