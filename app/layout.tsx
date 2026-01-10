import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'ShadowStats - Privacy-First Trading Analytics',
  description: 'Analyze your Solana trading performance without exposing your wallet',
  keywords: ['solana', 'trading', 'analytics', 'privacy', 'zero-knowledge'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): JSX.Element {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-bg-primary text-text-primary`}>
        {children}
      </body>
    </html>
  )
}
