export interface Location {
  id: string
  name: string
  cities?: City[]
}

export interface City {
  id: string
  name: string
  communes?: Commune[]
}

export interface Commune {
  id: string
  name: string
}

export const countries: Location[] = [
  {
    id: 'CL',
    name: 'Chile',
    cities: [
      {
        id: 'Santiago',
        name: 'Santiago',
        communes: [
          { id: 'Pudahuel', name: 'Pudahuel' },
          { id: 'Maipu', name: 'Maipú' },
          { id: 'Providencia', name: 'Providencia' },
          { id: 'LasCondes', name: 'Las Condes' },
          { id: 'Nuñoa', name: 'Ñuñoa' },
          { id: 'LaFlorida', name: 'La Florida' },
          { id: 'SanMiguel', name: 'San Miguel' },
          { id: 'LaCisterna', name: 'La Cisterna' },
          { id: 'ElBosque', name: 'El Bosque' },
          { id: 'PedroAguirreCerda', name: 'Pedro Aguirre Cerda' }
        ]
      },
      {
        id: 'Valparaiso',
        name: 'Valparaíso',
        communes: [
          { id: 'Valparaiso', name: 'Valparaíso' },
          { id: 'VinaDelMar', name: 'Viña del Mar' },
          { id: 'Quilpue', name: 'Quilpué' },
          { id: 'VillaAlemana', name: 'Villa Alemana' }
        ]
      },
      {
        id: 'Concepcion',
        name: 'Concepción',
        communes: [
          { id: 'Concepcion', name: 'Concepción' },
          { id: 'Talcahuano', name: 'Talcahuano' },
          { id: 'Chillan', name: 'Chillán' }
        ]
      }
    ]
  },
  {
    id: 'ES',
    name: 'España',
    cities: [
      {
        id: 'Madrid',
        name: 'Madrid',
        communes: [
          { id: 'Madrid', name: 'Madrid' },
          { id: 'Alcobendas', name: 'Alcobendas' },
          { id: 'Getafe', name: 'Getafe' },
          { id: 'Mostoles', name: 'Móstoles' }
        ]
      },
      {
        id: 'Barcelona',
        name: 'Barcelona',
        communes: [
          { id: 'Barcelona', name: 'Barcelona' },
          { id: 'Hospitalet', name: 'Hospitalet de Llobregat' },
          { id: 'Badalona', name: 'Badalona' },
          { id: 'Terrassa', name: 'Terrassa' }
        ]
      },
      {
        id: 'Valencia',
        name: 'Valencia',
        communes: [
          { id: 'Valencia', name: 'Valencia' },
          { id: 'Torrent', name: 'Torrent' },
          { id: 'Gandia', name: 'Gandia' }
        ]
      }
    ]
  },
  {
    id: 'AR',
    name: 'Argentina',
    cities: [
      {
        id: 'BuenosAires',
        name: 'Buenos Aires',
        communes: [
          { id: 'BuenosAires', name: 'Buenos Aires' },
          { id: 'LaPlata', name: 'La Plata' },
          { id: 'MarDelPlata', name: 'Mar del Plata' }
        ]
      },
      {
        id: 'Cordoba',
        name: 'Córdoba',
        communes: [
          { id: 'Cordoba', name: 'Córdoba' },
          { id: 'VillaMaria', name: 'Villa María' }
        ]
      }
    ]
  },
  {
    id: 'MX',
    name: 'México',
    cities: [
      {
        id: 'CiudadDeMexico',
        name: 'Ciudad de México',
        communes: [
          { id: 'CiudadDeMexico', name: 'Ciudad de México' },
          { id: 'Guadalajara', name: 'Guadalajara' },
          { id: 'Monterrey', name: 'Monterrey' }
        ]
      }
    ]
  }
]

export const getCitiesByCountry = (countryId: string): City[] => {
  const country = countries.find(c => c.id === countryId)
  return country?.cities || []
}

export const getCommunesByCity = (countryId: string, cityId: string): Commune[] => {
  const country = countries.find(c => c.id === countryId)
  const city = country?.cities?.find(c => c.id === cityId)
  return city?.communes || []
} 