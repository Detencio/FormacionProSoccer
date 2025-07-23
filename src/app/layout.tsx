import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import type { Metadata } from 'next'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6F3FF',
      100: '#B3D9FF',
      200: '#80BFFF',
      300: '#4DA6FF',
      400: '#1A8CFF',
      500: '#0073E6',
      600: '#005AB3',
      700: '#004080',
      800: '#00264D',
      900: '#000D1A',
    },
    success: {
      50: '#E6FFF0',
      100: '#B3FFD6',
      200: '#80FFBC',
      300: '#4DFFA2',
      400: '#1AFF88',
      500: '#00E66E',
      600: '#00B356',
      700: '#00803E',
      800: '#004D26',
      900: '#001A0E',
    },
    warning: {
      50: '#FFF8E6',
      100: '#FFEBB3',
      200: '#FFDE80',
      300: '#FFD14D',
      400: '#FFC41A',
      500: '#E6B000',
      600: '#B38C00',
      700: '#806800',
      800: '#4D4000',
      900: '#1A1800',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.900',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

export const metadata: Metadata = {
  title: 'Formación ProSoccer - Plataforma de Fútbol Amateur',
  description: 'Plataforma digital integral para la organización de partidos de fútbol amateur, gestión de equipos y camaradería deportiva.',
  keywords: 'fútbol, amateur, equipos, partidos, deporte, organización',
  authors: [{ name: 'Formación ProSoccer Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <main style={{ flex: 1 }}>
                {children}
              </main>
              <Footer />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </ChakraProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
} 