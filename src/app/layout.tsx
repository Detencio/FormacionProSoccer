import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Metadata } from 'next'

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
            {children}
          </ChakraProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
} 