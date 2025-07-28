'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  submenu?: {
    name: string;
    href: string;
    description: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
        />
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z'
        />
      </svg>
    ),
    description: 'Panel principal y estadísticas',
  },
  {
    name: 'Equipos',
    href: '/teams',
    icon: (
      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
        />
      </svg>
    ),
    description: 'Gestión de equipos y jugadores',
  },
  {
    name: 'Partidos',
    href: '/matches',
    icon: (
      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
        />
      </svg>
    ),
    description: 'Programación y resultados',
  },
  {
    name: 'Pagos',
    href: '/payments',
    icon: (
      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
        />
      </svg>
    ),
    description: 'Gestión de cuotas y pagos',
    submenu: [
      {
        name: 'Todos los Pagos',
        href: '/payments',
        description: 'Ver y gestionar todos los pagos',
      },
      {
        name: 'Gestión de Pagos',
        href: '/payments/manage',
        description: 'Cambiar estados y editar pagos',
      },
      {
        name: 'Cuotas Mensuales',
        href: '/payments/monthly',
        description: 'Generar cuotas mensuales automáticas',
      },
      {
        name: 'Reportes',
        href: '/payments/reports',
        description: 'Reportes y estadísticas de pagos',
      },
    ],
  },
  {
    name: 'Gastos',
    href: '/expenses',
    icon: (
      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
        />
      </svg>
    ),
    description: 'Gestión de gastos del club',
  },
  {
    name: 'Generador de Equipos',
    href: '/team-generator',
    icon: (
      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
        />
      </svg>
    ),
    description: 'Selección aleatoria equilibrada',
  },
  {
    name: 'Registrar Jugador',
    href: '/register-player',
    icon: (
      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
        />
      </svg>
    ),
    description: 'Crear cuenta de usuario para jugador',
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleSubmenu = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName) ? prev.filter(name => name !== itemName) : [...prev, itemName]
    );
  };

  // Función para navegar con logging
  const handleNavigation = (href: string, itemName: string) => {
    console.log(`[Sidebar] Attempting to navigate to: ${href} (${itemName})`);
    console.log(`[Sidebar] Current pathname: ${pathname}`);

    // Forzar la navegación
    router.push(href);

    // Verificar después de un breve delay
    setTimeout(() => {
      // Pathname after navigation
    }, 100);
  };

  // Debug: Log cuando cambia el pathname
  useEffect(() => {
    // Pathname changed
  }, [pathname]);

  return (
    <div
      className={`bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } min-h-screen flex flex-col shadow-2xl border-r border-gray-700 relative z-[9999]`}
    >
      {/* Header con diseño FIFA 26 */}
      <div className='p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-green-600'>
        <div className='flex items-center justify-between'>
          {!isCollapsed && (
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden'>
                <Image
                  src='/logo.PNG'
                  alt='FormaciónPro Soccer Logo'
                  width={40}
                  height={40}
                  className='object-cover rounded-lg'
                  priority
                />
              </div>
              <div>
                <h1 className='font-bold text-xl text-white'>FormaciónPro</h1>
                <p className='text-sm text-blue-100 font-medium'>Soccer</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Menu con diseño FIFA 26 */}
      <nav className='flex-1 p-4 space-y-3'>
        {menuItems.map(item => (
          <div key={item.href}>
            {item.submenu ? (
              // Item con submenú
              <div>
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className={`group w-full flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-xl'
                      : 'text-gray-200 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 ${isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
                  >
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <>
                      <div className='flex-1 min-w-0 text-left'>
                        <p className='text-sm font-semibold truncate'>{item.name}</p>
                        <p className='text-xs text-gray-300 truncate'>{item.description}</p>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${expandedItems.includes(item.name) ? 'rotate-180' : ''}`}
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
                    </>
                  )}
                </button>

                {/* Submenú con diseño FIFA 26 */}
                {!isCollapsed && expandedItems.includes(item.name) && (
                  <div className='ml-6 mt-3 space-y-2'>
                    {item.submenu.map(subItem => (
                      <button
                        key={subItem.href}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNavigation(subItem.href, subItem.name);
                        }}
                        className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                          isActive(subItem.href)
                            ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-500 hover:text-white'
                        }`}
                      >
                        <p className='text-sm font-medium'>{subItem.name}</p>
                        <p className='text-xs text-gray-400'>{subItem.description}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Item sin submenú
              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNavigation(item.href, item.name);
                }}
                className={`group w-full flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-xl'
                    : 'text-gray-200 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white'
                }`}
              >
                <div
                  className={`flex-shrink-0 ${isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
                >
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <div className='flex-1 min-w-0 text-left'>
                    <p className='text-sm font-semibold truncate'>{item.name}</p>
                    <p className='text-xs text-gray-300 truncate'>{item.description}</p>
                  </div>
                )}
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Footer con diseño FIFA 26 */}
      <div className='p-6 border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900'>
        {!isCollapsed && (
          <div className='space-y-3'>
            <div className='text-center'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center'>
                <svg
                  className='w-5 h-5 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
              </div>
              <div className='text-xs text-gray-300'>
                <p className='font-semibold'>© 2024 FormaciónPro</p>
                <p className='text-gray-400'>Soccer Management</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
