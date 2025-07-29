'use client';

import React from 'react';
import { Player } from '@/services/teamService';
import { countries } from '@/lib/countries';

interface ProfessionalPlayerCardProps {
  player: Player;
  onEdit?: (player: Player) => void;
  onDelete?: (playerId: number) => void;
  compact?: boolean;
}

const ProfessionalPlayerCard: React.FC<ProfessionalPlayerCardProps> = ({
  player,
  onEdit,
  onDelete,
  compact = false,
}) => {
  // Usar estadísticas del backend o valores por defecto
  const getPlayerStats = React.useCallback(() => {
    return {
      rit: player.rit || 70,
      tir: player.tir || 70,
      pas: player.pas || 70,
      reg: player.reg || 70,
      defense: player.defense || 70,
      fis: player.fis || 70,
    };
  }, [player.rit, player.tir, player.pas, player.reg, player.defense, player.fis]);

  const stats = getPlayerStats();
  const position = player.position_zone?.abbreviation || 'N/A';
  const specificPosition = player.position_specific?.abbreviation;

  // Calcular promedio total de habilidades
  const totalRating = Math.round(
    (stats.rit + stats.tir + stats.pas + stats.reg + stats.defense + stats.fis) / 6
  ) || 0;
  
  // Estado para habilidades editables
  const [currentStats, setCurrentStats] = React.useState(stats);

  // Actualizar estadísticas cuando cambian
  React.useEffect(() => {
    const newStats = getPlayerStats();
    setCurrentStats(newStats);
  }, [getPlayerStats]);

  // Función para obtener la URL de la bandera
  const getFlagUrl = (countryCode: string) => {
    const url = `/flags/${countryCode.toLowerCase()}.png`;
    return url;
  };

  // Función para obtener el nombre del país
  const getCountryName = (countryCode: string) => {
    const country = countries.find((c: any) => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  // Función para obtener la URL del logo del equipo
  const getTeamLogoUrl = (teamId: number | undefined) => {
    if (!teamId) {
      return undefined;
      }

    // Si el jugador tiene información del equipo con logo_url, usarla
    if (player.team?.logo_url) {
      return player.team.logo_url;
    }
    
    // Fallback a archivo estático
    const url = `/team-logos/team-${teamId}.png`;
    return url;
  };

  // Función para obtener el nombre del equipo
  const getTeamName = (teamId: number | undefined) => {
    if (!teamId) return 'Sin equipo';
    
    // Si el jugador tiene información del equipo, usar el nombre real
    if (player.team?.name) {
      return player.team.name;
    }
    
    return `Equipo ${teamId}`;
  };

  if (compact) {
    return (
      <div className='relative w-64 h-80 group'>
        {/* Plantilla PNG como fondo */}
        <img
          src='/card-template.png'
          alt='Plantilla de tarjeta'
          className='absolute inset-0 w-full h-full object-cover rounded-2xl'
        />

        {/* Contenido superpuesto */}
        <div className='relative h-full p-4 flex flex-col'>
          {/* POSICIÓN DE LA FOTO - Aquí irá la foto del jugador */}
          {/* La foto debe ir exactamente como el recuadro azul dibujado */}
          {/* Desde la línea morada (arriba del nombre) hacia arriba */}
          {/* Márgenes ajustados para estar por debajo del rating y estrella */}
          <div className='absolute top-16 left-18 right-18 bottom-28'>
            {/* Imagen del jugador con contenedor completamente transparente */}
            {player.photo_url ? (
              <div className='w-full h-full relative'>
                {/* Imagen del jugador nítida sin ningún contenedor visible */}
                <img 
                  src={player.photo_url} 
                  alt={`Foto de ${player.name}`}
                  className='w-full h-full object-contain'
                  onError={(e) => {
                    // Si la foto no carga, no mostrar nada
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              // Contenedor completamente invisible cuando no hay foto
              <div className='w-full h-full'></div>
            )}
          </div>

          {/* Total Skill Number & Position (Top Left) */}
          <div className='absolute top-12 left-8'>
            <div className='text-black font-bold text-3xl'>
              {totalRating}
            </div>
            <div className='text-black text-sm text-center font-bold'>
              {position}
            </div>
            {/* Posición específica debajo de la posición principal */}
            {specificPosition && (
              <div className='text-black text-xs text-center font-bold mt-1'>
                {specificPosition}
              </div>
            )}
          </div>

          {/* Skill Level Star (Top Right) */}
          <div className='absolute top-12 right-8'>
            <div className='relative'>
              <svg className='w-10 h-10 text-black' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/>
              </svg>
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-white font-bold text-base'>
                  {player.skill_level || 1}
                </span>
              </div>
            </div>
          </div>

          {/* Nombre del jugador arriba de las estadísticas - Estilo FIFA */}
          <div className='absolute bottom-20 left-4 right-4'>
            <h3 className='text-black font-bold text-lg text-center truncate tracking-wide'>
              {player.name}
            </h3>
          </div>

          {/* Estadísticas en fila horizontal - ULTRA COMPACTAS */}
          <div className='absolute bottom-14 left-2 right-2'>
            <div className='flex justify-center items-center w-full'>
              <div className='text-center' style={{ width: '12%' }}>
                <div className='text-black text-sm font-medium mb-0'>RIT</div>
                <div className='text-black font-bold text-base'>{currentStats.rit}</div>
              </div>
              <div className='text-center' style={{ width: '12%' }}>
                <div className='text-black text-sm font-medium mb-0'>TIR</div>
                <div className='text-black font-bold text-base'>{currentStats.tir}</div>
                </div>
              <div className='text-center' style={{ width: '12%' }}>
                <div className='text-black text-sm font-medium mb-0'>PAS</div>
                <div className='text-black font-bold text-base'>{currentStats.pas}</div>
              </div>
              <div className='text-center' style={{ width: '12%' }}>
                <div className='text-black text-sm font-medium mb-0'>REG</div>
                <div className='text-black font-bold text-base'>{currentStats.reg}</div>
            </div>
              <div className='text-center' style={{ width: '12%' }}>
                <div className='text-black text-sm font-medium mb-0'>DEF</div>
                <div className='text-black font-bold text-base'>{currentStats.defense}</div>
              </div>
              <div className='text-center' style={{ width: '12%' }}>
                <div className='text-black text-sm font-medium mb-0'>FIS</div>
                <div className='text-black font-bold text-base'>{currentStats.fis}</div>
              </div>
            </div>
          </div>

          {/* Información inferior: Bandera, Número, Logo */}
          <div className='absolute bottom-4 left-2 right-2'>
            <div className='flex justify-center items-center w-full space-x-4'>
              {/* Bandera del país */}
              <div className='w-6 h-4'>
                <img 
                  src={getFlagUrl('CL')} 
                  alt={`Bandera de ${getCountryName('CL')}`}
                  className='w-full h-full object-cover rounded-sm'
                  onError={(e) => {
                    // Si la bandera no existe, mostrar una imagen por defecto
                    (e.target as HTMLImageElement).src = '/flags/cl.png';
                  }}
                />
              </div>
              
              {/* Número de camiseta con icono */}
              <div className='flex items-center justify-center'>
                <div className='relative'>
                  {/* Icono de camiseta personalizado */}
                  <img 
                    src='/icons/jersey-icon.png' 
                    alt='Camiseta'
                    className='w-6 h-6 object-contain'
                    onError={(e) => {
                      // Si no existe el icono personalizado, usar estrella como fallback
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback con estrella */}
                  <svg 
                    className='w-6 h-6 text-black hidden' 
                    fill='currentColor' 
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/>
                  </svg>
                  {/* Número encima del icono */}
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span className='text-white font-bold text-xs'>
                      {player.jersey_number || '10'}
                    </span>
            </div>
          </div>
        </div>

              {/* Logo del equipo */}
              <div className='w-6 h-6'>
                {getTeamLogoUrl(player.team_id) ? (
                  <img 
                    src={getTeamLogoUrl(player.team_id)} 
                    alt={`Logo de ${getTeamName(player.team_id)}`}
                    className='w-full h-full object-cover rounded-full'
                    onError={(e) => {
                      // Si el logo no existe, mostrar un placeholder
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                {/* Placeholder que se muestra si no hay logo */}
                <div className={`w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center ${getTeamLogoUrl(player.team_id) ? 'hidden' : ''}`}>
                  <span className='text-xs text-gray-600'>⚽</span>
            </div>
            </div>
            </div>
          </div>

          {/* Acciones en hover */}
          <div className='absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <div className='flex items-center space-x-1'>
              <button
                onClick={() => onEdit?.(player)}
                className='p-1 bg-blue-500/80 backdrop-blur-sm text-white rounded text-xs hover:bg-blue-600 transition-all duration-200'
                title='Editar jugador'
              >
                <svg className='w-2 h-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
              </button>
              <button
                onClick={() => onDelete?.(player.id)}
                className='p-1 bg-red-500/80 backdrop-blur-sm text-white rounded text-xs hover:bg-red-600 transition-all duration-200'
                title='Eliminar jugador'
              >
                <svg className='w-2 h-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative w-80 h-96 group'>
      {/* Plantilla PNG como fondo */}
      <img
        src='/card-template.png'
        alt='Plantilla de tarjeta'
        className='absolute inset-0 w-full h-full object-cover rounded-3xl'
      />

      {/* Contenido superpuesto */}
      <div className='relative h-full p-6 flex flex-col'>
        {/* POSICIÓN DE LA FOTO - Aquí irá la foto del jugador */}
        {/* La foto debe ir exactamente como el recuadro azul dibujado */}
        {/* Desde la línea morada (arriba del nombre) hacia arriba */}
        {/* Márgenes ajustados para estar por debajo del rating y estrella */}
        <div className='absolute top-20 left-20 right-20 bottom-32'>
          {/* Imagen del jugador con contenedor completamente transparente */}
          {player.photo_url ? (
            <div className='w-full h-full relative'>
              {/* Imagen del jugador nítida sin ningún contenedor visible */}
              <img 
                src={player.photo_url} 
                alt={`Foto de ${player.name}`}
                className='w-full h-full object-contain'
                onError={(e) => {
                  // Si la foto no carga, no mostrar nada
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ) : (
            // Contenedor completamente invisible cuando no hay foto
            <div className='w-full h-full'></div>
                )}
              </div>

        {/* Total Skill Number & Position (Top Left) */}
        <div className='absolute top-16 left-10'>
          <div className='text-black font-bold text-4xl'>
            {totalRating}
          </div>
          <div className='text-black text-sm text-center font-bold'>
            {position}
          </div>
          {/* Posición específica debajo de la posición principal */}
          {specificPosition && (
            <div className='text-black text-xs text-center font-bold mt-1'>
              {specificPosition}
            </div>
          )}
        </div>

        {/* Skill Level Star (Top Right) */}
        <div className='absolute top-16 right-10'>
          <div className='relative'>
            <svg className='w-12 h-12 text-black' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/>
                  </svg>
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>
                {player.skill_level || 1}
              </span>
            </div>
          </div>
        </div>
        
        {/* Nombre del jugador arriba de las estadísticas - Estilo FIFA */}
        <div className='absolute bottom-24 left-6 right-6'>
          <h2 className='text-black font-bold text-2xl text-center truncate tracking-wide'>
            {player.name}
          </h2>
              </div>

        {/* Estadísticas del jugador - Estilo FIFA */}
        <div className='absolute bottom-14 left-4 right-4'>
          <div className='flex justify-center items-center w-full space-x-2'>
            <div style={{ width: '12%' }} className='text-center'>
              <div className='text-black text-sm mb-0'>RIT</div>
              <div className='text-black font-bold text-base'>{player.rit}</div>
            </div>
            <div style={{ width: '12%' }} className='text-center'>
              <div className='text-black text-sm mb-0'>TIR</div>
              <div className='text-black font-bold text-base'>{player.tir}</div>
            </div>
            <div style={{ width: '12%' }} className='text-center'>
              <div className='text-black text-sm mb-0'>PAS</div>
              <div className='text-black font-bold text-base'>{player.pas}</div>
            </div>
            <div style={{ width: '12%' }} className='text-center'>
              <div className='text-black text-sm mb-0'>REG</div>
              <div className='text-black font-bold text-base'>{player.reg}</div>
            </div>
            <div style={{ width: '12%' }} className='text-center'>
              <div className='text-black text-sm mb-0'>DEF</div>
              <div className='text-black font-bold text-base'>{player.defense}</div>
            </div>
            <div style={{ width: '12%' }} className='text-center'>
              <div className='text-black text-sm mb-0'>FIS</div>
              <div className='text-black font-bold text-base'>{player.fis}</div>
            </div>
          </div>
              </div>

        {/* Información inferior: Bandera, Número, Logo */}
        <div className='absolute bottom-6 left-4 right-4'>
          <div className='flex justify-center items-center w-full space-x-4'>
            {/* Bandera del país */}
            <div className='w-8 h-5'>
              <img 
                src={getFlagUrl('CL')} 
                alt={`Bandera de ${getCountryName('CL')}`}
                className='w-full h-full object-cover rounded-sm'
                onError={(e) => {
                  // Si la bandera no existe, mostrar una imagen por defecto
                  (e.target as HTMLImageElement).src = '/flags/cl.png';
                }}
              />
            </div>
            
            {/* Número de camiseta con icono */}
            <div className='flex items-center justify-center'>
              <div className='relative'>
                {/* Icono de camiseta personalizado */}
                <img 
                  src='/icons/jersey-icon.png' 
                  alt='Camiseta'
                  className='w-8 h-8 object-contain'
                  onError={(e) => {
                    // Si no existe el icono personalizado, usar estrella como fallback
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                {/* Fallback con estrella */}
                <svg 
                  className='w-8 h-8 text-black hidden' 
                  fill='currentColor' 
                  viewBox='0 0 24 24'
                >
                  <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/>
                </svg>
                {/* Número encima del icono */}
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>
                    {player.jersey_number || '10'}
                  </span>
          </div>
              </div>
            </div>
            
            {/* Logo del equipo */}
            <div className='w-8 h-8'>
              {getTeamLogoUrl(player.team_id) ? (
                <img 
                  src={getTeamLogoUrl(player.team_id)} 
                  alt={`Logo de ${getTeamName(player.team_id)}`}
                  className='w-full h-full object-cover rounded-full'
                  onError={(e) => {
                    // Si el logo no existe, mostrar un placeholder
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              {/* Placeholder que se muestra si no hay logo */}
              <div className={`w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ${getTeamLogoUrl(player.team_id) ? 'hidden' : ''}`}>
                <span className='text-sm text-gray-600'>⚽</span>
                  </div>
            </div>
          </div>
        </div>

        {/* Acciones en hover */}
        <div className='absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <div className='flex items-center space-x-2'>
            <button
              onClick={() => onEdit?.(player)}
              className='p-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-lg'
              title='Editar jugador'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete?.(player.id)}
              className='p-2 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-lg'
              title='Eliminar jugador'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalPlayerCard;
