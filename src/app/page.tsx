'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { FaFutbol } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [isAuthenticated, loading, router])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Página de landing para usuarios no autenticados
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-500 to-brand-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-8 text-center">
            <FaFutbol size={64} className="text-white" />
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Formación ProSoccer
            </h1>
            <p className="text-xl max-w-2xl">
              La plataforma digital integral para el fútbol amateur. 
              Organiza partidos, gestiona equipos y fortalece la camaradería 
              deportiva de manera sencilla y profesional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-600">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-16">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-600">
                Todo lo que necesitas para tu equipo
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Una plataforma completa diseñada específicamente para el fútbol amateur, 
                con todas las herramientas necesarias para organizar tu equipo.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-8">
              <div className="p-6 bg-white rounded-lg shadow-md text-center w-full max-w-md">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-brand-100 rounded-full text-brand-600">
                    <FaFutbol size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Organización de Partidos
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Crea y gestiona partidos de manera sencilla e intuitiva
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-600">
              ¿Listo para transformar tu equipo?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Únete a cientos de equipos que ya están usando Formación ProSoccer 
              para organizar sus partidos y fortalecer la camaradería.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                Crear Mi Cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 