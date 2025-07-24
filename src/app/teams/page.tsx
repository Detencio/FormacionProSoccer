'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { countries, getCitiesByCountry, getCommunesByCity } from '@/lib/locations'
import MainLayout from '@/components/Layout/MainLayout'
import PlayerModal from '@/components/teams/PlayerModal'

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
  
  // Estados para filtrado y vista
  const [selectedFilterTeam, setSelectedFilterTeam] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards')
  const [showAllPlayers, setShowAllPlayers] = useState(false)

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
          ? { ...team, players: team.players.filter((p: any) => p.id !== playerId) }
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
                      ? { ...team, players: team.players.map((p: any) => 
                p.id === editingPlayer.id ? { ...p, ...formData } : p
              )}
          : team
      ))
    } else {
      // Crear nuevo jugador
      const newPlayer = {
        id: Math.max(...teams.flatMap(t => t.players).map((p: any) => p.id)) + 1,
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

  // Funciones para filtrado y vista
  const handleFilterChange = (teamId: number | null) => {
    setSelectedFilterTeam(teamId)
    setShowAllPlayers(false)
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === 'cards' ? 'list' : 'cards')
  }

  const toggleShowAllPlayers = () => {
    setShowAllPlayers(!showAllPlayers)
  }

  // Obtener jugadores filtrados
  const getFilteredPlayers = () => {
    if (selectedFilterTeam) {
      const team = teams.find(t => t.id === selectedFilterTeam)
      return team ? team.players : []
    }
    if (showAllPlayers) {
      return teams.flatMap(team => team.players.map((player: any) => ({
        ...player,
        teamName: team.name,
        teamId: team.id
      })))
    }
    return []
  }

  const filteredPlayers = getFilteredPlayers()

  return (
    <MainLayout>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Header con diseño FIFA 26 */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-2xl border border-gray-100 p-8 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Equipos</h1>
                <p className="text-blue-100 text-lg">Gestión de equipos y jugadores</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/register-player')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                title="Crear cuenta de usuario para jugador"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Registrar Jugador</span>
                </div>
              </button>
              <button
                onClick={handleDebug}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Debug</span>
                </div>
              </button>
              {!isAuthenticated && (
                <button
                  onClick={handleLogin}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Iniciar Sesión</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Información con diseño FIFA 26 */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Diferencia entre funciones</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-bold">📝</span>
                </div>
                <h4 className="font-semibold text-gray-800">"Agregar Jugador" (en cada equipo)</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Solo agrega datos del jugador al equipo
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  No crea cuenta de usuario
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Para gestión interna de equipos
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-bold">👤</span>
                </div>
                <h4 className="font-semibold text-gray-800">"Registrar Jugador" (botón verde)</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Crea cuenta de usuario con email
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Asigna jugador a un equipo
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  El jugador puede iniciar sesión
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Contraseña por defecto: 123456
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Advertencia de autenticación con diseño FIFA 26 */}
        {showAuthWarning && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Modo de Prueba</h3>
                <p className="text-yellow-700 mb-3">
                  Estás viendo datos simulados porque no estás autenticado.
                </p>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Iniciar sesión para acceder a datos reales</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controles de filtrado y vista con diseño FIFA 26 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                <span className="font-semibold text-gray-800">Filtrar por Equipo:</span>
              </div>
              <select
                value={selectedFilterTeam || ''}
                onChange={(e) => handleFilterChange(e.target.value ? Number(e.target.value) : null)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                <option value="">Todos los equipos</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleShowAllPlayers}
                className={`px-4 py-2 rounded-xl transition-all duration-200 font-semibold ${
                  showAllPlayers
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Ver todos los jugadores</span>
                </div>
              </button>

              <div className="flex items-center space-x-2 bg-white rounded-xl p-1 shadow-md">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'cards'
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title="Vista en tarjetas"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title="Vista en lista"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Información del filtro activo */}
          {(selectedFilterTeam || showAllPlayers) && (
            <div className="mt-4 p-4 bg-white rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {selectedFilterTeam 
                        ? `Mostrando jugadores de: ${teams.find(t => t.id === selectedFilterTeam)?.name}`
                        : 'Mostrando todos los jugadores'
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      {filteredPlayers.length} jugador{filteredPlayers.length !== 1 ? 'es' : ''} encontrado{filteredPlayers.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFilterTeam(null)
                    setShowAllPlayers(false)
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Limpiar filtro
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vista de jugadores filtrados */}
        {(selectedFilterTeam || showAllPlayers) && (
          <div className="mb-8">
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlayers.map((player: any) => (
                  <div key={player.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center space-x-4 mb-4">
                      {player.photo_url && (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center shadow-lg border-2 border-gray-200">
                          <img 
                            src={player.photo_url} 
                            alt={`Foto ${player.name}`}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">{player.name}</h4>
                        <p className="text-sm text-gray-600">{player.position}</p>
                        {player.teamName && (
                          <p className="text-xs text-blue-600 font-medium">{player.teamName}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Edad:</span>
                        <span className="font-semibold">{player.age} años</span>
                      </div>
                      {player.jersey_number && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Número:</span>
                          <span className="font-semibold">#{player.jersey_number}</span>
                        </div>
                      )}
                      {player.email && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-semibold truncate">{player.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleEditPlayer(player, player.teamId || selectedFilterTeam)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-semibold"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletePlayer(player.id, player.teamId || selectedFilterTeam)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-semibold"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Jugador</th>
                        <th className="px-6 py-4 text-left font-semibold">Equipo</th>
                        <th className="px-6 py-4 text-left font-semibold">Posición</th>
                        <th className="px-6 py-4 text-left font-semibold">Edad</th>
                        <th className="px-6 py-4 text-left font-semibold">Número</th>
                        <th className="px-6 py-4 text-left font-semibold">Email</th>
                        <th className="px-6 py-4 text-center font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPlayers.map((player: any) => (
                        <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              {player.photo_url && (
                                <img 
                                  src={player.photo_url} 
                                  alt={`Foto ${player.name}`}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              )}
                              <span className="font-semibold text-gray-900">{player.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{player.teamName || teams.find(t => t.id === selectedFilterTeam)?.name}</td>
                          <td className="px-6 py-4 text-gray-600">{player.position}</td>
                          <td className="px-6 py-4 text-gray-600">{player.age} años</td>
                          <td className="px-6 py-4 text-gray-600">{player.jersey_number ? `#${player.jersey_number}` : '-'}</td>
                          <td className="px-6 py-4 text-gray-600">{player.email || '-'}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEditPlayer(player, player.teamId || selectedFilterTeam)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar jugador"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeletePlayer(player.id, player.teamId || selectedFilterTeam)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar jugador"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grid de equipos con diseño FIFA 26 - Solo mostrar cuando no hay filtro activo */}
        {!selectedFilterTeam && !showAllPlayers && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team, index) => (
            <div key={`team-${team.id}-${index}`} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4">
                  {team.logo_url && (
                    <div className="w-20 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center shadow-lg border-2 border-gray-200">
                      <img 
                        src={team.logo_url} 
                        alt={`Logo ${team.name}`}
                        className="w-16 h-20 object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{team.name}</h3>
                    <p className="text-gray-600 font-medium">
                      {team.commune && `${team.commune}, `}{team.city}, {team.country}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Fundado: {team.founded}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTeam(team)}
                    className="p-3 text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    title="Editar equipo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="p-3 text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    title="Eliminar equipo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                {team.players.map((player: any) => (
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

        {/* Botón agregar equipo con diseño FIFA 26 - Solo mostrar cuando no hay filtro activo */}
        {!selectedFilterTeam && !showAllPlayers && (
          <div className="mt-12 text-center">
          <button 
            onClick={handleAddTeam}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>+ Agregar Nuevo Equipo</span>
            </div>
          </button>
        </div>
        )}

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
              {countries.map((country, index) => (
                <option key={`team-country-${country.id}-${index}`} value={country.id}>
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
              {availableCities.map((city, index) => (
                <option key={`team-city-${city.id}-${index}`} value={city.id}>
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
              {availableCommunes.map((commune, index) => (
                <option key={`team-commune-${commune.id}-${index}`} value={commune.id}>
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

 