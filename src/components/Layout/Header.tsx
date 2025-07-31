'use client';

import { useAuthStore } from '@/store/authStore';
import { useState, useEffect, useRef } from 'react';
import PaymentNotifications from '@/components/PaymentNotifications';
import Image from 'next/image';
import { createPortal } from 'react-dom';

export default function Header() {
  const { user, clearUser } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    // Agregar event listener de forma segura
    try {
      document.addEventListener('mousedown', handleClickOutside);
    } catch (error) {
      console.warn('Error adding event listener:', error);
    }
    
    return () => {
      // Remover event listener de forma segura
      try {
        document.removeEventListener('mousedown', handleClickOutside);
      } catch (error) {
        console.warn('Error removing event listener:', error);
      }
    };
  }, []);

  if (!user) return null;

  return (
    <header className='bg-gradient-to-r from-gray-800 via-gray-900 to-black border-b border-gray-700 px-6 py-4 backdrop-blur-sm relative'>
      {/* Efecto de luz superior */}
      <div className='absolute inset-0 bg-gradient-to-b from-blue-600/20 via-transparent to-transparent pointer-events-none'></div>

      <div className='flex items-center justify-between relative z-10'>
        {/* Logo y título con diseño FIFA 26 */}
        <div className='flex items-center space-x-4'>
          <div className='w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-2xl border border-blue-500/30 overflow-hidden'>
            <Image
              src='/logo.PNG'
              alt='ProSoccer Logo'
              width={48}
              height={48}
              className='object-cover rounded-lg'
              priority
            />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent'>
              ProSoccer
            </h1>
            <p className='text-sm text-gray-300 font-medium'>Gestión deportiva y Generador de equipos</p>
          </div>
        </div>

        {/* Información del usuario y logout con diseño FIFA 26 */}
        <div className='flex items-center space-x-6'>
          {/* Notificaciones de pagos */}
          <PaymentNotifications />

          {/* Perfil del usuario */}
          <div className='relative z-[999999]' ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className='flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-600/50 backdrop-blur-sm'
            >
              <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-400/30'>
                <span className='text-base font-bold text-white'>
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className='hidden md:block text-left'>
                <p className='text-sm font-semibold text-white truncate max-w-[200px]'>
                  {user.email}
                </p>
                <p className='text-xs text-gray-300 capitalize font-medium'>{user.role}</p>
              </div>
              <svg
                className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>

            {/* Menú desplegable mejorado */}
            {showUserMenu && typeof window !== 'undefined' && createPortal(
              <div className='fixed right-4 top-20 w-60 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-600/50 py-3 z-[999999] backdrop-blur-sm'>
                {/* Header del menú */}
                <div className='px-4 py-3 border-b border-gray-600/50'>
                  <p className='text-sm font-semibold text-white'>{user.email}</p>
                  <p className='text-xs text-gray-300 capitalize font-medium'>{user.role}</p>
                </div>

                {/* Opciones del menú */}
                <div className='py-2'>
                  <button className='w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-green-600/20 transition-all duration-300 flex items-center space-x-3 rounded-lg mx-2'>
                    <svg
                      className='w-5 h-5 text-blue-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                      />
                    </svg>
                    <span>Mi Perfil</span>
                  </button>

                  <button className='w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-green-600/20 transition-all duration-300 flex items-center space-x-3 rounded-lg mx-2'>
                    <svg
                      className='w-5 h-5 text-green-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                    <span>Configuración</span>
                  </button>
                </div>

                {/* Cerrar sesión */}
                <div className='border-t border-gray-600/50 pt-2'>
                  <button
                    onClick={clearUser}
                    className='w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/20 transition-all duration-300 flex items-center space-x-3 rounded-lg mx-2'
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                      />
                    </svg>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
