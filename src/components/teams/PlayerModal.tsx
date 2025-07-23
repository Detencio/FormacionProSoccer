'use client'

import { useState, useEffect } from 'react';
import { Player, CreatePlayerRequest, UpdatePlayerRequest } from '@/services/teamService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  'Defensa Central',
  'Lateral Derecho',
  'Lateral Izquierdo',
  'Mediocentro Defensivo',
  'Mediocentro',
  'Mediocentro Ofensivo',
  'Extremo Derecho',
  'Extremo Izquierdo',
  'Delantero Centro',
  'Segundo Delantero'
];

export default function PlayerModal({ isOpen, onClose, onSubmit, player, teamId, loading = false }: PlayerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    age: ''
  });

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        position: player.position,
        age: player.age.toString()
      });
    } else {
      setFormData({
        name: '',
        position: '',
        age: ''
      });
    }
  }, [player, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      age: parseInt(formData.age),
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">
          {player ? 'Editar Jugador' : 'Agregar Nuevo Jugador'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Jugador</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingresa el nombre del jugador"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="position">Posición</Label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            >
              <option value="">Selecciona una posición</option>
              {POSITIONS.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="age">Edad</Label>
            <Input
              id="age"
              name="age"
              type="number"
              min="5"
              max="50"
              value={formData.age}
              onChange={handleChange}
              placeholder="Ingresa la edad"
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Guardando...' : (player ? 'Actualizar' : 'Agregar')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 