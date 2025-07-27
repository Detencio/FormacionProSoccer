'use client'

import { useState, useEffect } from 'react';
import { Player, CreatePlayerRequest, UpdatePlayerRequest, teamService } from '@/services/teamService';
import { countries } from '@/lib/countries';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePlayerRequest | UpdatePlayerRequest) => void;
  player?: Player | null;
  teamId: number;
  loading?: boolean;
}

const POSITION_ZONES = [
  { id: 4, name: 'Portero', abbreviation: 'POR' },
  { id: 1, name: 'Defensa', abbreviation: 'DEF' },
  { id: 2, name: 'Centrocampista', abbreviation: 'MED' },
  { id: 3, name: 'Delantero', abbreviation: 'DEL' }
];

const POSITION_SPECIFICS = {
  1: [ // DEF
    { id: 1, name: 'Lateral Derecho', abbreviation: 'LD' },
    { id: 2, name: 'Lateral Izquierdo', abbreviation: 'LI' },
    { id: 3, name: 'Defensa Central', abbreviation: 'DFC' },
    { id: 4, name: 'Carrilero Izquierdo', abbreviation: 'CAI' },
    { id: 5, name: 'Carrilero Derecho', abbreviation: 'CAD' }
  ],
  2: [ // MED
    { id: 6, name: 'Mediocentro Defensivo', abbreviation: 'MCD' },
    { id: 7, name: 'Mediocentro', abbreviation: 'MC' },
    { id: 8, name: 'Mediocentro Ofensivo', abbreviation: 'MCO' },
    { id: 9, name: 'Volante por la Derecha', abbreviation: 'MD' },
    { id: 10, name: 'Volante por la Izquierda', abbreviation: 'MI' }
  ],
  3: [ // DEL
    { id: 11, name: 'Extremo Derecho', abbreviation: 'ED' },
    { id: 12, name: 'Extremo Izquierdo', abbreviation: 'EI' },
    { id: 13, name: 'Delantero Centro', abbreviation: 'DC' },
    { id: 14, name: 'Segundo Delantero', abbreviation: 'SD' }
  ],
  4: [] // POR - sin posiciones específicas
};

export default function PlayerModal({ isOpen, onClose, onSubmit, player, teamId, loading = false }: PlayerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    phone: '',
    date_of_birth: '',
    position_zone_id: 1,
    position_specific_id: undefined as number | undefined,
    jersey_number: '',
    height: '',
    weight: '',
    skill_level: 5,
    // Nuevas habilidades específicas
    rit: 70,
    tir: 70,
    pas: 70,
    reg: 70,
    defense: 70,
    fis: 70
  });
  const [teams, setTeams] = useState<any[]>([]);
  const [availableSpecifics, setAvailableSpecifics] = useState<any[]>([]);

  // Cargar equipos desde el backend
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await teamService.getTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error('Error cargando equipos:', error);
      }
    };
    loadTeams();
  }, []);

  // Actualizar posiciones específicas cuando cambia la zona
  useEffect(() => {
    const specifics = POSITION_SPECIFICS[formData.position_zone_id as keyof typeof POSITION_SPECIFICS] || [];
    setAvailableSpecifics(specifics);
    // Resetear posición específica si no está disponible en la nueva zona
    if (formData.position_specific_id && !specifics.find(s => s.id === formData.position_specific_id)) {
      setFormData(prev => ({ ...prev, position_specific_id: undefined }));
    }
  }, [formData.position_zone_id]);

  useEffect(() => {
    if (player) {
      console.log('PlayerModal: Cargando jugador:', player);
      setFormData({
        name: player.name || '',
        email: player.email || '',
        country: player.nationality || '',
        phone: player.phone || '',
        date_of_birth: player.date_of_birth ? player.date_of_birth.split('T')[0] : '',
        position_zone_id: player.position_zone_id || 1,
        position_specific_id: player.position_specific_id || undefined,
        jersey_number: player.jersey_number ? player.jersey_number.toString() : '',
        height: player.height ? player.height.toString() : '',
        weight: player.weight ? player.weight.toString() : '',
        skill_level: player.skill_level || 5,
        // Cargar habilidades específicas si existen, sino usar valores por defecto
        rit: player.rit || 70,
        tir: player.tir || 70,
        pas: player.pas || 70,
        reg: player.reg || 70,
        defense: player.defense || 70,
        fis: player.fis || 70
      });
    } else {
      console.log('PlayerModal: Creando nuevo jugador');
      setFormData({
        name: '',
        email: '',
        country: '',
        phone: '',
        date_of_birth: '',
        position_zone_id: 1,
        position_specific_id: undefined,
        jersey_number: '',
        height: '',
        weight: '',
        skill_level: 5,
        // Valores por defecto para habilidades
        rit: 70,
        tir: 70,
        pas: 70,
        reg: 70,
        defense: 70,
        fis: 70
      });
    }
  }, [player, isOpen]);

  // Calcular edad basada en fecha de nacimiento
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const selectedCountry = countries.find(country => country.code === countryCode);
    
    setFormData({
      ...formData,
      country: countryCode,
      phone: selectedCountry ? selectedCountry.phoneCode : ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : undefined,
      height: formData.height ? parseInt(formData.height) : undefined,
      weight: formData.weight ? parseInt(formData.weight) : undefined,
      skill_level: formData.skill_level,
      // Incluir habilidades específicas
      rit: formData.rit,
      tir: formData.tir,
      pas: formData.pas,
      reg: formData.reg,
      defense: formData.defense,
      fis: formData.fis,
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

  // Función para manejar cambios en habilidades específicas
  const handleSkillChange = (skillName: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [skillName]: Math.max(1, Math.min(100, value))
    }));
  };

  // Obtener color de estadística
  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    if (value >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  // Obtener color de barra de progreso
  const getBarColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {player ? 'Editar Jugador en el Sistema' : 'Registrar Jugador en el Sistema'}
          </h1>
          <p className="text-blue-100 text-lg">
            {player ? 'Modifica la información del jugador' : 'Crea una cuenta de usuario para un jugador y asígnalo a un equipo'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Información Personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="juan.perez@equipo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleCountryChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona un país</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+56 912345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.date_of_birth && (
                  <p className="text-sm text-gray-500 mt-1">
                    Edad: {calculateAge(formData.date_of_birth)} años
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Camiseta
                </label>
                <input
                  type="number"
                  name="jersey_number"
                  value={formData.jersey_number}
                  onChange={handleChange}
                  min="1"
                  max="99"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="150"
                  max="220"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="175"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="50"
                  max="120"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="70"
                />
              </div>
            </div>
          </div>

          {/* Información de Posición */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Información de Posición</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona de Posición *
                </label>
                <select
                  name="position_zone_id"
                  value={formData.position_zone_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {POSITION_ZONES.map(position => (
                    <option key={position.id} value={position.id}>
                      {position.name} ({position.abbreviation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición Específica
                </label>
                <select
                  name="position_specific_id"
                  value={formData.position_specific_id || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sin especificar</option>
                  {availableSpecifics.map(position => (
                    <option key={position.id} value={position.id}>
                      {position.name} ({position.abbreviation})
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Recomendado para fútbol 11v11
                </p>
              </div>
            </div>
          </div>

          {/* Nivel de Habilidad General */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Nivel de Habilidad General</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Habilidad *
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, skill_level: level }))}
                    className="text-2xl transition-colors duration-200 hover:scale-110"
                  >
                    {formData.skill_level >= level ? '⭐' : '☆'}
                  </button>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {formData.skill_level}/5
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formData.skill_level === 1 && 'Principiante'}
                {formData.skill_level === 2 && 'Básico'}
                {formData.skill_level === 3 && 'Intermedio'}
                {formData.skill_level === 4 && 'Avanzado'}
                {formData.skill_level === 5 && 'Experto'}
              </p>
            </div>
          </div>

          {/* Habilidades Específicas */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Habilidades Específicas</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ajusta las estadísticas específicas del jugador (1-100)
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'rit', label: 'Ritmo', color: 'from-blue-500 to-blue-600', icon: '⚡' },
                { key: 'tir', label: 'Tiro', color: 'from-green-500 to-green-600', icon: '🎯' },
                { key: 'pas', label: 'Pase', color: 'from-purple-500 to-purple-600', icon: '🎾' },
                { key: 'reg', label: 'Regate', color: 'from-yellow-500 to-yellow-600', icon: '🔄' },
                { key: 'defense', label: 'Defensa', color: 'from-red-500 to-red-600', icon: '🛡️' },
                { key: 'fis', label: 'Físico', color: 'from-orange-500 to-orange-600', icon: '💪' }
              ].map((skill) => (
                <div key={skill.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <span>{skill.icon}</span>
                      <span>{skill.label}</span>
                    </label>
                    <span className={`text-sm font-bold ${getStatColor(formData[skill.key as keyof typeof formData] as number)}`}>
                      {formData[skill.key as keyof typeof formData]}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={formData[skill.key as keyof typeof formData] as number}
                      onChange={(e) => handleSkillChange(skill.key, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${getBarColor(formData[skill.key as keyof typeof formData] as number)} 0%, ${getBarColor(formData[skill.key as keyof typeof formData] as number)} ${formData[skill.key as keyof typeof formData]}%, #e5e7eb ${formData[skill.key as keyof typeof formData]}%, #e5e7eb 100%)`
                      }}
                    />
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Asignación de Equipo */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Asignación de Equipo</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipo *
              </label>
              <select
                name="team_id"
                value={teamId}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              >
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                El jugador será asignado al equipo seleccionado
              </p>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Información Adicional</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">🎉 Funcionalidades Especiales</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Notificaciones de cumpleaños:</strong> El sistema enviará saludos automáticos</li>
                <li>• <strong>Estadísticas por posición:</strong> Seguimiento de rendimiento por zona</li>
                <li>• <strong>Historial de cambios:</strong> Registro de modificaciones del jugador</li>
                <li>• <strong>Filtros avanzados:</strong> Búsqueda por posición específica y zona</li>
                <li>• <strong>Habilidades específicas:</strong> Control detallado de estadísticas del jugador</li>
              </ul>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancelar</span>
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span>{player ? 'Actualizar Jugador' : 'Registrar Jugador'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 