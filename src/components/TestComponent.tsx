'use client'

export default function TestComponent() {
  return (
    <div className="p-8 text-center">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-600">
          ¡Formación ProSoccer está funcionando!
        </h2>
        <p className="text-gray-600">
          El proyecto se ha inicializado correctamente con Next.js 14 y Tailwind CSS.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Comenzar Desarrollo
        </button>
      </div>
    </div>
  )
} 