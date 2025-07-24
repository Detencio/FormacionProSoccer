import { FaCheckCircle, FaTrophy } from 'react-icons/fa'

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efectos de luz de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-green-600/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-600/20 to-yellow-600/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Card con diseño FIFA 26 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600/30 p-12 relative overflow-hidden">
          {/* Efecto de luz en la tarjeta */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <FaCheckCircle size={48} className="text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-4">
              ¡Funciona!
            </h1>
            
            <p className="text-gray-300 text-xl font-medium mb-8">
              La aplicación está funcionando correctamente.
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-bold">SISTEMA ONLINE</span>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 