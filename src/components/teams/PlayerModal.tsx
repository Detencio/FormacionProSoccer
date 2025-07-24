'use client'

import { useState, useEffect } from 'react';
import { Player, CreatePlayerRequest, UpdatePlayerRequest } from '@/services/teamService';
import { countries } from '@/lib/countries';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePlayerRequest | UpdatePlayerRequest) => void;
  player?: Player | null;
  teamId: number;
  loading?: boolean;
}

const POSITIONS = [
  'Portero',
  'Defensa',
  'Mediocampista',
  'Delantero'
];

export default function PlayerModal({ isOpen, onClose, onSubmit, player, teamId, loading = false }: PlayerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    phone: '',
    position: '',
    age: '',
    jersey_number: '',
    photo_url: '',
    skill: 3
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [teams, setTeams] = useState<any[]>([]);

  // Cargar equipos desde localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem('teams-data')
    if (savedTeams) {
      try {
        const teamsData = JSON.parse(savedTeams)
        setTeams(teamsData)
      } catch (error) {
        console.error('Error cargando equipos:', error)
      }
    }
  }, []);

  useEffect(() => {
    if (player) {
      const playerSkill = Number(player.skill) || 3
      console.log('PlayerModal: Cargando jugador con skill:', playerSkill, 'player.skill:', player.skill)
      setFormData({
        name: player.name || '',
        email: player.email || '',
        country: player.country || '',
        phone: player.phone || '',
        position: player.position || '',
        age: player.age ? player.age.toString() : '',
        jersey_number: player.jersey_number ? player.jersey_number.toString() : '',
        photo_url: player.photo_url || '',
        skill: playerSkill
      });
      setPhotoPreview(player.photo_url || null);
    } else {
      console.log('PlayerModal: Creando nuevo jugador con skill por defecto: 3')
      setFormData({
        name: '',
        email: '',
        country: '',
        phone: '',
        position: '',
        age: '',
        jersey_number: '',
        photo_url: '',
        skill: 3
      });
      setPhotoPreview(null);
    }
  }, [player, isOpen]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoPreview(result)
        setFormData({ ...formData, photo_url: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value
    const selectedCountry = countries.find(country => country.code === countryCode)
    
    setFormData({
      ...formData,
      country: countryCode,
      phone: selectedCountry ? selectedCountry.phoneCode : ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      age: parseInt(formData.age),
      jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : undefined,
      skill: formData.skill,
      ...(player ? {} : { team_id: teamId })
    };
    onSubmit(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {player ? 'Editar Jugador en el Sistema' : 'Registrar Jugador en el Sistema'}
          </h1>
          <p className="text-blue-100 text-lg">
            {player ? 'Modifica la información del jugador' : 'Crea una cuenta de usuario para un jugador y asígnalo a un equipo'}
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ingresa el nombre completo"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="jugador@ejemplo.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    País *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleCountryChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                    disabled={loading}
                  >
                    <option value="">Selecciona un país</option>
                    {countries.map((country, index) => (
                      <option key={`country-${country.code}-${index}`} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+34 600 000 000"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Posición
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={loading}
                  >
                    <option value="">Selecciona posición</option>
                    {POSITIONS.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Edad *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    min="16"
                    max="50"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número de Camiseta
                </label>
                <input
                  type="number"
                  name="jersey_number"
                  value={formData.jersey_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  min="1"
                  max="99"
                  disabled={loading}
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Habilidad *
                </label>
                <div className="flex items-center space-x-2">
                  {(() => {
                    console.log('Rendering stars with formData.skill:', formData.skill, 'type:', typeof formData.skill)
                    return [1, 2, 3, 4, 5].map((star) => {
                      const currentSkill = Number(formData.skill) || 0
                      const isFilled = currentSkill >= star
                      console.log(`Star ${star}: formData.skill=${formData.skill}, currentSkill=${currentSkill}, isFilled=${isFilled}`)
                      return (
                        <button
                          key={`skill-star-${star}`}
                          type="button"
                          onClick={() => {
                            console.log('Clicking star:', star)
                            setFormData({...formData, skill: star})
                          }}
                          className="text-2xl transition-colors duration-200"
                          disabled={loading}
                        >
                          {isFilled ? '⭐' : '☆'}
                        </button>
                      )
                    })
                  })()}
                  <span className="text-sm text-gray-600 ml-2">{Number(formData.skill) || 0}/5</span>
                </div>
              </div>
            </div>

            {/* Asignación de Equipo */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Asignación de Equipo</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Equipo *
                </label>
                <select
                  value={teamId}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled
                >
                  {teams.map((team, index) => (
                    <option key={`team-${team.id}-${index}`} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Foto del Jugador */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Foto del Jugador</h3>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={loading}
                  />
                </div>
                {photoPreview && (
                  <div className="flex-shrink-0">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover border-2 border-blue-200 rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {player ? 'Actualizar Jugador' : 'Crear Cuenta de Jugador'}
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 