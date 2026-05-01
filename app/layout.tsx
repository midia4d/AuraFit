import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n/language-context'
import { RegisterServiceWorker } from './register-sw'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  title: 'AuraFit — Seu App Fitness Definitivo',
  description:
    'Treinos, dietas, gamificação e evolução em tempo real. Alcance sua melhor versão com AuraFit.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/icon-192x192.png',
  },
  openGraph: {
    title: 'AuraFit — Seu App Fitness Definitivo',
    description:
      'Treinos, dietas, gamificação e evolução. Alcance sua melhor versão com AuraFit.',
    images: ['/og-image.png'],
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AuraFit',
  },
}

export const viewport = {
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" async></script>
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <LanguageProvider>
          <RegisterServiceWorker />
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#111',
                border: '1px solid #374151',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
              },
              classNames: {
                success: 'border-[#39FF14]/40',
                error: 'border-red-500/40',
                warning: 'border-yellow-500/40',
              },
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  )
}
