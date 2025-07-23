'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { countries, getCitiesByCountry, getCommunesByCity } from '@/lib/locations'
import MainLayout from '@/components/Layout/MainLayout'

// Datos simulados para equipos (solo como fallback inicial)
const initialMockTeams = [
  {
    id: 1,
    name: 'Matiz FC',
    country: 'CL',
    city: 'Santiago',
    commune: 'Pudahuel',
    founded: 2025,
    logo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM4QjIzMjMiLz4KPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMzUiIGZpbGw9IiM4QjIzMjMiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSI1MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1FPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+',
    players: [
      { 
        id: 101, 
        name: 'Carlos González', 
        position: 'Portero', 
        age: 28,
        phone: '+56 912345678',
        email: 'carlos.gonzalez@matizfc.com',
        jersey_number: 1,
        country: 'CL',
        photo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiMzMzc0Q0EiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSI1MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNHPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+'
      },
      { 
        id: 102, 
        name: 'Miguel Silva', 
        position: 'Defensa', 
        age: 25,
        phone: '+56 923456789',
        email: 'miguel.silva@matizfc.com',
        jersey_number: 4,
        country: 'CL',
        photo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM2QjcyODAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSI1MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1TPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+'
      },
      { 
        id: 103, 
        name: 'Diego Morales', 
        position: 'Centrocampista', 
        age: 22,
        phone: '+56 934567890',
        email: 'diego.morales@matizfc.com',
        jersey_number: 8,
        country: 'CL',
        photo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM0Q0I1N0QiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSI1MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkRNPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+'
      },
      { 
        id: 104, 
        name: 'Andrés Rojas', 
        position: 'Delantero', 
        age: 24,
        phone: '+56 945678901',
        email: 'andres.rojas@matizfc.com',
        jersey_number: 9,
        country: 'CL',
        photo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiNFNTczQzIiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSI1MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFSPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+'
      },
      { 
        id: 105, 
        name: 'Felipe Torres', 
        position: 'Defensa', 
        age: 26,
        phone: '+56 956789012',
        email: 'felipe.torres@matizfc.com',
        jersey_number: 3,
        country: 'CL',
        photo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM2QjcyODAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSI1MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZUPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+'
      },
      { 
        id: 106, 
        name: 'Roberto Herrera', 
        position: 'Portero', 
        age: 29,
        phone: '+56 967890123',
        email: 'roberto.herrera@matizfc.com',
        jersey_number: 12,
        country: 'CL',
        photo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiMzMzc0Q0EiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSI1MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJIPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+'
      },
      { 
        id: 107, 
        name: 'Sebastián Vega', 
        position: 'Defensa', 
        age: 23,
        phone: '+56 978901234',
        email: 'sebastian.vega@matizfc.com',
        jersey_number: 2,
        country: 'CL',
        photo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM2QjcyODAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSI1MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNWPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+'
      },
      { 
        id: 108, 
        name: 'Matías Contreras', 
        position: 'Centrocampista', 
        age: 21,
        phone: '+56 989012345',
        email: 'matias.contreras@matizfc.com',
        jersey_number: 6,
        country: 'CL',
        photo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM0Q0I1N0QiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSI1MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1DPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+'
      },
      { 
        id: 109, 
        name: 'Nicolás Paredes', 
        position: 'Centrocampista', 
        age: 24,
        phone: '+56 990123456',
        email: 'nicolas.paredes@matizfc.com',
        jersey_number: 10,
        country: 'CL',
        photo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM0Q0I1N0QiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSI1MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5QPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+'
      },
      { 
        id: 110, 
        name: 'Cristian Muñoz', 
        position: 'Delantero', 
        age: 25,
        phone: '+56 901234567',
        email: 'cristian.munoz@matizfc.com',
        jersey_number: 7,
        country: 'CL',
        photo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiNFNTczQzIiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSI1MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNNPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+'
      },
      { 
        id: 111, 
        name: 'Francisco Valenzuela', 
        position: 'Delantero', 
        age: 27,
        phone: '+56 912345678',
        email: 'francisco.valenzuela@matizfc.com',
        jersey_number: 11,
        country: 'CL',
        photo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiNFNTczQzIiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSI1MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZWPgo8L3N2Zz4KPC9zdmc+'
      },
      { 
        id: 112, 
        name: 'Alejandro Castro', 
        position: 'Defensa', 
        age: 30,
        phone: '+56 923456789',
        email: 'alejandro.castro@matizfc.com',
        jersey_number: 5,
        country: 'CL',
        photo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM2QjcyODAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSI1MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFDPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+'
      }
    ]
  },
  {
    id: 2,
    name: 'Real Madrid',
    country: 'ES',
    city: 'Madrid',
    commune: 'Madrid',
    founded: 1902,
    players: [
      { 
        id: 1, 
        name: 'Vinicius Jr', 
        position: 'Delantero', 
        age: 23,
        phone: '+34 600 111 111',
        email: 'vinicius@realmadrid.com',
        jersey_number: 7
      },
      { 
        id: 2, 
        name: 'Jude Bellingham', 
        position: 'Centrocampista', 
        age: 20,
        phone: '+34 600 222 222',
        email: 'jude@realmadrid.com',
        jersey_number: 5
      },
      { 
        id: 3, 
        name: 'Thibaut Courtois', 
        position: 'Portero', 
        age: 31,
        phone: '+34 600 333 333',
        email: 'courtois@realmadrid.com',
        jersey_number: 1
      }
    ]
  },
  {
    id: 2,
    name: 'Barcelona',
    country: 'ES',
    city: 'Barcelona',
    commune: 'Barcelona',
    founded: 1899,
    players: [
      { 
        id: 4, 
        name: 'Robert Lewandowski', 
        position: 'Delantero', 
        age: 35,
        phone: '+34 600 444 444',
        email: 'lewy@barcelona.com',
        jersey_number: 9
      },
      { 
        id: 5, 
        name: 'Frenkie de Jong', 
        position: 'Centrocampista', 
        age: 26,
        phone: '+34 600 555 555',
        email: 'frenkie@barcelona.com',
        jersey_number: 21
      },
      { 
        id: 6, 
        name: 'Marc-André ter Stegen', 
        position: 'Portero', 
        age: 31,
        phone: '+34 600 666 666',
        email: 'terstegen@barcelona.com',
        jersey_number: 1
      }
    ]
  },
  {
    id: 3,
    name: 'Manchester City',
    country: 'ES', // Usando España como ejemplo
    city: 'Madrid',
    commune: 'Madrid',
    founded: 1880,
    players: [
      { 
        id: 7, 
        name: 'Erling Haaland', 
        position: 'Delantero', 
        age: 23,
        phone: '+44 700 777 777',
        email: 'haaland@mancity.com',
        jersey_number: 9
      },
      { 
        id: 8, 
        name: 'Kevin De Bruyne', 
        position: 'Centrocampista', 
        age: 32,
        phone: '+44 700 888 888',
        email: 'debruyne@mancity.com',
        jersey_number: 17
      },
      { 
        id: 9, 
        name: 'Ederson', 
        position: 'Portero', 
        age: 30,
        phone: '+44 700 999 999',
        email: 'ederson@mancity.com',
        jersey_number: 31
      }
    ]
  }
]

export default function TeamsPage() {
  const { user, token, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [teams, setTeams] = useState<any[]>([])
  const [showAuthWarning, setShowAuthWarning] = useState(false)
  
  // Estados para modales
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState<any>(null)
  const [editingPlayer, setEditingPlayer] = useState<any>(null)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [showDetails, setShowDetails] = useState<number | null>(null)

  // Cargar equipos desde localStorage al iniciar
  useEffect(() => {
    const savedTeams = localStorage.getItem('teams-data')
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams))
    } else {
      // Solo usar datos simulados si no hay datos guardados
      setTeams(initialMockTeams)
      localStorage.setItem('teams-data', JSON.stringify(initialMockTeams))
    }
  }, [])

  // Guardar equipos en localStorage cuando cambien
  useEffect(() => {
    if (teams.length > 0) {
      localStorage.setItem('teams-data', JSON.stringify(teams))
    }
  }, [teams])

  useEffect(() => {
    // Mostrar advertencia si no está autenticado
    if (!isAuthenticated || !user || !token) {
      setShowAuthWarning(true)
    }
  }, [isAuthenticated, user, token])

  const handleLogin = () => {
    router.push('/login')
  }

  const handleDebug = () => {
    router.push('/debug')
  }

  // Funciones para equipos
  const handleAddTeam = () => {
    setEditingTeam(null)
    setShowTeamModal(true)
  }

  const handleEditTeam = (team: any) => {
    setEditingTeam(team)
    setShowTeamModal(true)
  }

  const handleDeleteTeam = (teamId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      setTeams(prev => prev.filter(team => team.id !== teamId))
    }
  }

  const handleTeamSubmit = (formData: any) => {
    if (editingTeam) {
      // Actualizar equipo existente
      setTeams(prev => prev.map(team => 
        team.id === editingTeam.id 
          ? { ...team, ...formData }
          : team
      ))
    } else {
      // Crear nuevo equipo
      const newTeam = {
        id: Math.max(...teams.map(t => t.id)) + 1,
        ...formData,
        players: []
      }
      setTeams(prev => [...prev, newTeam])
    }
    setShowTeamModal(false)
    setEditingTeam(null)
  }

  // Funciones para jugadores
  const handleAddPlayer = (teamId: number) => {
    setSelectedTeamId(teamId)
    setEditingPlayer(null)
    setShowPlayerModal(true)
  }

  const handleEditPlayer = (player: any, teamId: number) => {
    setSelectedTeamId(teamId)
    setEditingPlayer(player)
    setShowPlayerModal(true)
  }

  const handleDeletePlayer = (playerId: number, teamId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este jugador?')) {
      setTeams(prev => prev.map(team => 
        team.id === teamId 
          ? { ...team, players: team.players.filter(p => p.id !== playerId) }
          : team
      ))
    }
  }

  const handlePlayerSubmit = (formData: any) => {
    if (!selectedTeamId) return

    if (editingPlayer) {
      // Actualizar jugador existente
      setTeams(prev => prev.map(team => 
        team.id === selectedTeamId 
          ? { ...team, players: team.players.map(p => 
              p.id === editingPlayer.id ? { ...p, ...formData } : p
            )}
          : team
      ))
    } else {
      // Crear nuevo jugador
      const newPlayer = {
        id: Math.max(...teams.flatMap(t => t.players).map(p => p.id)) + 1,
        ...formData
      }
      setTeams(prev => prev.map(team => 
        team.id === selectedTeamId 
          ? { ...team, players: [...team.players, newPlayer] }
          : team
      ))
    }
    setShowPlayerModal(false)
    setEditingPlayer(null)
    setSelectedTeamId(null)
  }

  // Función para mostrar/ocultar detalles
  const toggleDetails = (teamId: number) => {
    setShowDetails(showDetails === teamId ? null : teamId)
  }

  return (
    <MainLayout>
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Equipos</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/register-player')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            title="Crear cuenta de usuario para jugador"
          >
            Registrar Jugador
          </button>
          <button
            onClick={handleDebug}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Debug
          </button>
          {!isAuthenticated && (
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Diferencia entre funciones:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-700">
          <div>
            <h4 className="font-medium">📝 "Agregar Jugador" (en cada equipo):</h4>
            <ul className="mt-1 space-y-1">
              <li>• Solo agrega datos del jugador al equipo</li>
              <li>• No crea cuenta de usuario</li>
              <li>• Para gestión interna de equipos</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">👤 "Registrar Jugador" (botón verde):</h4>
            <ul className="mt-1 space-y-1">
              <li>• Crea cuenta de usuario con email</li>
              <li>• Asigna jugador a un equipo</li>
              <li>• El jugador puede iniciar sesión</li>
              <li>• Contraseña por defecto: 123456</li>
            </ul>
          </div>
        </div>
      </div>

      {showAuthWarning && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <strong>Modo de prueba:</strong> Estás viendo datos simulados porque no estás autenticado.
                <button
                  onClick={handleLogin}
                  className="ml-2 underline hover:no-underline"
                >
                  Iniciar sesión
                </button>
                para acceder a datos reales.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                {team.logo_url && (
                  <img 
                    src={team.logo_url} 
                    alt={`Logo ${team.name}`}
                    className="w-16 h-20 object-contain border rounded"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{team.name}</h3>
                  <p className="text-gray-600">
                    {team.commune && `${team.commune}, `}{team.city}, {team.country}
                  </p>
                  <p className="text-sm text-gray-500">Fundado: {team.founded}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEditTeam(team)}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  title="Editar equipo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Eliminar equipo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">Jugadores ({team.players.length})</h4>
                <button
                  onClick={() => handleAddPlayer(team.id)}
                  className="text-green-500 hover:text-green-700 text-sm"
                >
                  + Agregar
                </button>
              </div>
              
              <div className="space-y-2">
                {team.players.map((player) => (
                  <div key={player.id} className="p-3 bg-gray-50 rounded border">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {player.photo_url && (
                          <img 
                            src={player.photo_url} 
                            alt={`Foto ${player.name}`}
                            className="w-8 h-8 object-cover border rounded"
                          />
                        )}
                        <span className="font-medium text-gray-900">{player.name}</span>
                        {player.jersey_number && (
                          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                            #{player.jersey_number}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditPlayer(player, team.id)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Editar jugador"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.id, team.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Eliminar jugador"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {player.position}
                        </span>
                        <span>{player.age} años</span>
                      </div>
                      
                      {player.email && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate">{player.email}</span>
                        </div>
                      )}
                      
                      {player.phone && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{player.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleDetails(team.id)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                >
                  {showDetails === team.id ? 'Ocultar' : 'Ver'} Detalles
                </button>
                <button 
                  onClick={() => handleEditTeam(team)}
                  className="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
                >
                  Editar
                </button>
              </div>
              
              {showDetails === team.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h5 className="font-medium mb-2">Detalles del Equipo</h5>
                  <div className="text-sm space-y-1">
                    <p><strong>Nombre:</strong> {team.name}</p>
                    <p><strong>Ciudad:</strong> {team.city}</p>
                    <p><strong>País:</strong> {team.country}</p>
                    <p><strong>Fundado:</strong> {team.founded}</p>
                    <p><strong>Total Jugadores:</strong> {team.players.length}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={handleAddTeam}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          + Agregar Nuevo Equipo
        </button>
      </div>

      {/* Modal para Equipos */}
      {showTeamModal && (
        <TeamModal
          isOpen={showTeamModal}
          onClose={() => {
            setShowTeamModal(false)
            setEditingTeam(null)
          }}
          onSubmit={handleTeamSubmit}
          team={editingTeam}
        />
      )}

      {/* Modal para Jugadores */}
      {showPlayerModal && (
        <PlayerModal
          isOpen={showPlayerModal}
          onClose={() => {
            setShowPlayerModal(false)
            setEditingPlayer(null)
            setSelectedTeamId(null)
          }}
          onSubmit={handlePlayerSubmit}
          player={editingPlayer}
          teamId={selectedTeamId}
        />
      )}
      </div>
    </MainLayout>
  )
}

// Componente Modal para Equipos
function TeamModal({ isOpen, onClose, onSubmit, team }: any) {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    country: team?.country || '',
    city: team?.city || '',
    commune: team?.commune || '',
    founded: team?.founded || '',
    logo_url: team?.logo_url || ''
  })
  const [availableCities, setAvailableCities] = useState<any[]>([])
  const [availableCommunes, setAvailableCommunes] = useState<any[]>([])
  const [logoPreview, setLogoPreview] = useState<string>('')

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        country: team.country,
        city: team.city,
        commune: team.commune,
        founded: team.founded,
        logo_url: team.logo_url
      })
      setLogoPreview(team.logo_url || '')
    } else {
      setFormData({
        name: '',
        country: '',
        city: '',
        commune: '',
        founded: '',
        logo_url: ''
      })
      setLogoPreview('')
    }
  }, [team])

  // Actualizar ciudades cuando cambie el país
  useEffect(() => {
    if (formData.country) {
      const cities = getCitiesByCountry(formData.country)
      setAvailableCities(cities)
      // Resetear ciudad y comuna si cambia el país
      if (formData.city && !cities.find(c => c.id === formData.city)) {
        setFormData(prev => ({ ...prev, city: '', commune: '' }))
      }
    } else {
      setAvailableCities([])
    }
  }, [formData.country])

  // Actualizar comunas cuando cambie la ciudad
  useEffect(() => {
    if (formData.country && formData.city) {
      const communes = getCommunesByCity(formData.country, formData.city)
      setAvailableCommunes(communes)
      // Resetear comuna si cambia la ciudad
      if (formData.commune && !communes.find(c => c.id === formData.commune)) {
        setFormData(prev => ({ ...prev, commune: '' }))
      }
    } else {
      setAvailableCommunes([])
    }
  }, [formData.country, formData.city])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        setFormData(prev => ({ ...prev, logo_url: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {team ? 'Editar Equipo' : 'Nuevo Equipo'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Equipo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País *
            </label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar país</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad *
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!formData.country}
            >
              <option value="">Seleccionar ciudad</option>
              {availableCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comuna *
            </label>
            <select
              value={formData.commune}
              onChange={(e) => setFormData({...formData, commune: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!formData.city}
            >
              <option value="">Seleccionar comuna</option>
              {availableCommunes.map((commune) => (
                <option key={commune.id} value={commune.id}>
                  {commune.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año de Fundación *
            </label>
            <input
              type="number"
              value={formData.founded}
              onChange={(e) => setFormData({...formData, founded: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1800"
              max="2025"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo/Insignia del Equipo
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {logoPreview && (
                <div className="mt-2">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-20 h-20 object-contain border rounded"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {team ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Componente Modal para Jugadores
function PlayerModal({ isOpen, onClose, onSubmit, player, teamId }: any) {
  const [formData, setFormData] = useState({
    name: player?.name || '',
    position: player?.position || '',
    age: player?.age || '',
    phone: player?.phone || '',
    email: player?.email || '',
    jersey_number: player?.jersey_number || '',
    photo_url: player?.photo_url || ''
  })
  const [photoPreview, setPhotoPreview] = useState<string>('')

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        position: player.position,
        age: player.age,
        phone: player.phone || '',
        email: player.email || '',
        jersey_number: player.jersey_number || '',
        photo_url: player.photo_url || ''
      })
      setPhotoPreview(player.photo_url || '')
    } else {
      setFormData({
        name: '',
        position: '',
        age: '',
        phone: '',
        email: '',
        jersey_number: '',
        photo_url: ''
      })
      setPhotoPreview('')
    }
  }, [player])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoPreview(result)
        setFormData(prev => ({ ...prev, photo_url: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {player ? 'Editar Jugador' : 'Nuevo Jugador'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Jugador *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Posición *
            </label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar posición</option>
              <option value="Portero">Portero</option>
              <option value="Defensa">Defensa</option>
              <option value="Centrocampista">Centrocampista</option>
              <option value="Delantero">Delantero</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edad *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="16"
                max="50"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Camiseta
              </label>
              <input
                type="number"
                value={formData.jersey_number}
                onChange={(e) => setFormData({...formData, jersey_number: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="99"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="jugador@ejemplo.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+34 600 000 000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto del Jugador
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {photoPreview && (
                <div className="mt-2">
                  <img 
                    src={photoPreview} 
                    alt="Foto preview" 
                    className="w-20 h-20 object-cover border rounded"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {player ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 