'use client'

import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Efecto de luz de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-green-600/10 pointer-events-none"></div>
      
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Efecto de luz superior */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-600/20 via-transparent to-transparent pointer-events-none"></div>
        
        <Header />
        <main className="flex-1 overflow-auto relative">
          {/* Contenedor principal con diseño FIFA 26 */}
          <div className="min-h-full p-6 relative">
            {/* Efecto de luz inferior */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-600/20 via-transparent to-transparent pointer-events-none"></div>
            
            {/* Contenido con backdrop blur y efectos */}
            <div className="relative z-0">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 