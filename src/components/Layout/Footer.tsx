'use client'

import { FaFutbol, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          {/* Logo and Description */}
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center">
              <FaFutbol size={20} className="text-brand-600 mr-2" />
              <span className="font-bold text-lg text-brand-600">
                ProSoccer
              </span>
            </div>
            <p className="text-sm max-w-xs">
              Gestión deportiva y Generador de equipos. 
              Plataforma digital integral para la organización de equipos de fútbol.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6">
            <div className="flex flex-col space-y-2">
              <span className="font-bold text-sm">Producto</span>
              <a href="/features" className="text-sm hover:text-brand-500 transition-colors">
                Características
              </a>
              <a href="/pricing" className="text-sm hover:text-brand-500 transition-colors">
                Precios
              </a>
              <a href="/demo" className="text-sm hover:text-brand-500 transition-colors">
                Demo
              </a>
            </div>

            <div className="flex flex-col space-y-2">
              <span className="font-bold text-sm">Soporte</span>
              <a href="/help" className="text-sm hover:text-brand-500 transition-colors">
                Ayuda
              </a>
              <a href="/contact" className="text-sm hover:text-brand-500 transition-colors">
                Contacto
              </a>
              <a href="/docs" className="text-sm hover:text-brand-500 transition-colors">
                Documentación
              </a>
            </div>

            <div className="flex flex-col space-y-2">
              <span className="font-bold text-sm">Legal</span>
              <a href="/privacy" className="text-sm hover:text-brand-500 transition-colors">
                Privacidad
              </a>
              <a href="/terms" className="text-sm hover:text-brand-500 transition-colors">
                Términos
              </a>
              <a href="/cookies" className="text-sm hover:text-brand-500 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              © 2025 ProSoccer. Todos los derechos reservados.
            </p>
            
            <div className="flex space-x-4">
              <a href="https://github.com/Detencio" target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                <FaGithub size={18} />
              </a>
              <a href="https://twitter.com/formacionpro" target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="https://linkedin.com/company/formacionpro" target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 