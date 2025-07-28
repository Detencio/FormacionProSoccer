import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'ProSoccer - Plataforma de Fútbol Amateur',
  description:
    'Plataforma digital integral para la organización de partidos de fútbol amateur, gestión de equipos y camaradería deportiva.',
  keywords: 'fútbol, amateur, equipos, partidos, deporte, organización',
  authors: [{ name: 'ProSoccer Team' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.PNG',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
