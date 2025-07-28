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
    photo_url: '',
    team_id: teamId,
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
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

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
        date_of_birth: player.date_of_birth || '',
        position_zone_id: player.position_zone_id || 1,
        position_specific_id: player.position_specific_id,
        jersey_number: player.jersey_number?.toString() || '',
        height: player.height?.toString() || '',
        weight: player.weight?.toString() || '',
        skill_level: player.skill_level || 5,
        photo_url: player.photo_url || '',
        team_id: player.team_id || teamId,
        // Habilidades específicas
        rit: player.rit || 70,
        tir: player.tir || 70,
        pas: player.pas || 70,
        reg: player.reg || 70,
        defense: player.defense || 70,
        fis: player.fis || 70
      });
      setPhotoPreview(player.photo_url || '');
    } else {
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
        photo_url: '',
        team_id: teamId,
        // Habilidades específicas
        rit: 70,
        tir: 70,
        pas: 70,
        reg: 70,
        defense: 70,
        fis: 70
      });
      setPhotoPreview('');
    }
  }, [player, teamId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 DEBUG - handleSubmit iniciado');
    setIsLoading(true);
    
    try {
      console.log('🔍 DEBUG - Datos del formulario antes de enviar:', {
        formData,
        photo_url: formData.photo_url,
        photoPreview
      });
      
      const playerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        nationality: formData.country,
        jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : undefined,
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseInt(formData.weight) : undefined,
        skill_level: formData.skill_level,
        photo_url: formData.photo_url, // Agregar photo_url
        // Habilidades específicas
        rit: formData.rit,
        tir: formData.tir,
        pas: formData.pas,
        reg: formData.reg,
        defense: formData.defense,
        fis: formData.fis,
        position_zone_id: formData.position_zone_id,
        position_specific_id: formData.position_specific_id,
        team_id: formData.team_id
      };
      
      console.log('🔍 DEBUG - Datos procesados para enviar:', playerData);
      console.log('🔍 DEBUG - Llamando a onSubmit con playerData');
      
      // Usar la prop onSubmit en lugar de llamar directamente al servicio
      onSubmit(playerData);
      console.log('🔍 DEBUG - onSubmit ejecutado, cerrando modal');
      onClose();
    } catch (error) {
      console.error('❌ Error en el formulario:', error);
      setError('Error al guardar jugador. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
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
    setFormData(prev => ({ ...prev, [skillName]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoPreview(result);
        setFormData(prev => ({ ...prev, photo_url: result }));
      };
      reader.readAsDataURL(file);
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-4xl mx-4 max-h-[85vh] overflow-y-auto">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 text-center">
          <h1 className="text-2xl font-bold mb-1">
            {player ? 'Editar Jugador' : 'Registrar Jugador'}
          </h1>
          <p className="text-blue-100 text-sm">
            {player ? 'Modifica la información del jugador' : 'Crea una cuenta de usuario para un jugador'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Información Personal */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Información Personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="juan.perez@equipo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleCountryChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="+56 912345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                {formData.date_of_birth && (
                  <p className="text-xs text-gray-500 mt-1">
                    Edad: {calculateAge(formData.date_of_birth)} años
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Camiseta
                </label>
                <input
                  type="number"
                  name="jersey_number"
                  value={formData.jersey_number}
                  onChange={handleChange}
                  min="1"
                  max="99"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="150"
                  max="220"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="175"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="50"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="70"
                />
              </div>

              {/* Campo de foto del jugador */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto del Jugador
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos: JPG, PNG. Máximo 2MB
                    </p>
                  </div>
                  {photoPreview && (
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={photoPreview}
                          alt="Vista previa"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información de Posición */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Información de Posición</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zona de Posición *
                </label>
                <select
                  name="position_zone_id"
                  value={formData.position_zone_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {POSITION_ZONES.map(position => (
                    <option key={position.id} value={position.id}>
                      {position.name} ({position.abbreviation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posición Específica
                </label>
                <select
                  name="position_specific_id"
                  value={formData.position_specific_id || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nivel de Habilidad General</h3>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Nivel de Habilidad
                </label>
                <span className="text-sm font-bold text-gray-600">
                  {formData.skill_level}/5
                </span>
              </div>
              
              <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, skill_level: level }))}
                    className={`text-2xl transition-all duration-200 hover:scale-110 ${
                      formData.skill_level >= level ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    {formData.skill_level >= level ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              
              <div className="text-xs text-gray-600">
                {formData.skill_level === 1 && 'Principiante - Habilidades básicas'}
                {formData.skill_level === 2 && 'Básico - Conocimientos fundamentales'}
                {formData.skill_level === 3 && 'Intermedio - Buen nivel técnico'}
                {formData.skill_level === 4 && 'Avanzado - Alto rendimiento'}
                {formData.skill_level === 5 && 'Experto - Nivel profesional'}
              </div>
            </div>
          </div>

          {/* Habilidades Específicas */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Habilidades Específicas</h3>
            <p className="text-sm text-gray-600 mb-2">
              Ajusta las estadísticas específicas del jugador (1-100)
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: 'rit', label: 'Ritmo', color: 'from-blue-500 to-blue-600', icon: '⚡' },
                { key: 'tir', label: 'Tiro', color: 'from-green-500 to-green-600', icon: '🎯' },
                { key: 'pas', label: 'Pase', color: 'from-purple-500 to-purple-600', icon: '🎾' },
                { key: 'reg', label: 'Regate', color: 'from-yellow-500 to-yellow-600', icon: '🔄' },
                { key: 'defense', label: 'Defensa', color: 'from-red-500 to-red-600', icon: '🛡️' },
                { key: 'fis', label: 'Físico', color: 'from-orange-500 to-orange-600', icon: '💪' }
              ].map((skill) => (
                <div key={skill.key} className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <span>{skill.icon}</span>
                      <span>{skill.label}</span>
                    </label>
                    <span className={`text-sm font-bold px-2 py-1 rounded ${getStatColor(formData[skill.key as keyof typeof formData] as number)} bg-white`}>
                      {formData[skill.key as keyof typeof formData]}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={formData[skill.key as keyof typeof formData] as number}
                      onChange={(e) => handleSkillChange(skill.key, parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${getBarColor(formData[skill.key as keyof typeof formData] as number)} 0%, ${getBarColor(formData[skill.key as keyof typeof formData] as number)} ${formData[skill.key as keyof typeof formData]}%, #e5e7eb ${formData[skill.key as keyof typeof formData]}%, #e5e7eb 100%)`
                      }}
                    />
                    
                    <div className="flex justify-between text-xs text-gray-400">
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
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Asignación de Equipo</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipo *
              </label>
              <select
                name="team_id"
                value={teamId}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm"
              >
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Información Adicional</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Campos Opcionales</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Fecha de nacimiento (calcula edad automáticamente)</li>
                      <li>• Altura y peso (para estadísticas físicas)</li>
                      <li>• Posición específica (recomendado para 11v11)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">Habilidades Automáticas</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Se calculan según el nivel general</li>
                      <li>• Puedes ajustarlas manualmente</li>
                      <li>• Se reflejan en las tarjetas de jugador</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-green-600 rounded-lg hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : (player ? 'Actualizar Jugador' : 'Crear Jugador')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 