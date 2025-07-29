'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Si el usuario está autenticado, redirigir al dashboard
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      // Si no está autenticado, redirigir al login
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Página de carga mientras se redirige
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Cargando ProSoccer...</p>
      </div>
    </div>
  );
}
