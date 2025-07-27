'use client'

import React, { useEffect } from 'react'
import { testTeamGenerator, showTeamDetails } from '@/utils/testTeamGenerator'

export default function TestPage() {
  useEffect(() => {
    // Ejecutar pruebas cuando se carga la página
    const runTests = () => {
      console.log('🚀 Iniciando pruebas del Generador de Equipos...')
      
      try {
        const results = testTeamGenerator()
        
        // Mostrar detalles de cada prueba
        showTeamDetails(results.test5v5.distribution, '5v5 con 14 jugadores')
        showTeamDetails(results.test7v7.distribution, '7v7 con 16 jugadores')
        showTeamDetails(results.test11v11.distribution, '11v11 con 22 jugadores')
        showTeamDetails(results.testImpar.distribution, '5v5 con 13 jugadores (impar)')
        
        console.log('\n🎉 Todas las pruebas completadas exitosamente!')
        console.log('📊 Resumen:')
        console.log(`- 5v5: ${results.test5v5.stats.balanceScore}/100 balance`)
        console.log(`- 7v7: ${results.test7v7.stats.balanceScore}/100 balance`)
        console.log(`- 11v11: ${results.test11v11.stats.balanceScore}/100 balance`)
        console.log(`- Impar: ${results.testImpar.stats.balanceScore}/100 balance`)
        
      } catch (error) {
        console.error('❌ Error en las pruebas:', error)
      }
    }
    
    // Ejecutar después de un pequeño delay para asegurar que todo esté cargado
    setTimeout(runTests, 1000)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🧪 Página de Pruebas</h1>
        <p className="text-gray-600">
          Ejecutando pruebas del Generador de Equipos
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pruebas del Sistema</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Pruebas Ejecutadas</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 5v5 con 14 jugadores (par)</li>
              <li>• 7v7 con 16 jugadores (par)</li>
              <li>• 11v11 con 22 jugadores (par)</li>
              <li>• 5v5 con 13 jugadores (impar)</li>
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">✅ Funcionalidades Verificadas</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Distribución automática de titulares y suplentes</li>
              <li>• Manejo de números pares e impares</li>
              <li>• Cálculo de balance entre equipos</li>
              <li>• Validaciones de distribución</li>
              <li>• Estadísticas detalladas</li>
            </ul>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">📊 Resultados</h3>
            <p className="text-sm text-yellow-800">
              Revisa la consola del navegador (F12) para ver los resultados detallados de las pruebas.
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">🔍 Cómo Verificar</h3>
          <ol className="text-sm text-gray-700 space-y-1">
            <li>1. Abre las herramientas de desarrollador (F12)</li>
            <li>2. Ve a la pestaña "Console"</li>
            <li>3. Recarga la página para ejecutar las pruebas</li>
            <li>4. Revisa los resultados detallados</li>
          </ol>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          🎯 Próximos Pasos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
          <div>
            <h4 className="font-semibold mb-2">🚀 Funcionalidades a Implementar</h4>
            <ul className="space-y-1">
              <li>• Drag & drop visual</li>
              <li>• Filtros avanzados por posición</li>
              <li>• Estadísticas detalladas</li>
              <li>• Exportación de equipos</li>
              <li>• Historial de generaciones</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🔧 Mejoras Técnicas</h4>
            <ul className="space-y-1">
              <li>• Integración con backend</li>
              <li>• Persistencia de configuraciones</li>
              <li>• Optimización de rendimiento</li>
              <li>• Tests unitarios completos</li>
              <li>• Documentación técnica</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 