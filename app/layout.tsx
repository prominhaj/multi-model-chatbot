import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Multi Model Chatbot',
  keywords: ['chatbot', 'multi model', 'AI', 'artificial intelligence', 'Stack Provider'],
  authors: [{ name: 'Stack Provider', url: 'https://stackprovider.com' }],
  description: 'A multi model chatbot application that integrates various AI models for enhanced conversational capabilities.',
  generator: 'Next.js',
  applicationName: 'Multi Model Chatbot',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
