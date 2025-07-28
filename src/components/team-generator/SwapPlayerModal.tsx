import React from 'react'
import { Player } from '@/types'

interface SwapPlayerModalProps {
  isOpen: boolean
  substitute: Player | null
  availableStarters: Player[]
  onConfirm: (substituteId: number, starterId: number) => void
  onCancel: () => void
}

const SwapPlayerModal: React.FC<SwapPlayerModalProps> = ({
  isOpen,
  substitute,
  availableStarters,
  onConfirm,
  onCancel
}) => {
  if (!isOpen || !substitute) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Intercambiar Jugador</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Selecciona un titular para intercambiar con:
          </p>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <span className="font-semibold text-blue-800">
              {substitute.name} ({substitute.position_specific?.abbreviation || substitute.position_zone?.abbreviation})
            </span>
            <p className="text-sm text-blue-600 mt-1">Suplente → Titular</p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Titulares Disponibles:</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableStarters.length > 0 ? (
              availableStarters.map((starter) => (
                <button
                  key={starter.id}
                  onClick={() => onConfirm(substitute.id, starter.id)}
                  className="w-full p-3 text-left bg-gray-50 hover:bg-green-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{starter.name}</span>
                      <p className="text-sm text-gray-600">
                        {starter.position_specific?.abbreviation || starter.position_zone?.abbreviation}
                      </p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Titular → Suplente</span>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No hay titulares disponibles para intercambiar
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default SwapPlayerModal 