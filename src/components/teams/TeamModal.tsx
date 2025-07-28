'use client';

import { useState, useEffect } from 'react';
import { Team, CreateTeamRequest, UpdateTeamRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTeamRequest | UpdateTeamRequest) => void;
  team?: Team | null;
  loading?: boolean;
}

export default function TeamModal({
  isOpen,
  onClose,
  onSubmit,
  team,
  loading = false,
}: TeamModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  } as CreateTeamRequest);

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        description: team.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [team, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
        <h2 className='text-xl font-semibold mb-4'>
          {team ? 'Editar Equipo' : 'Crear Nuevo Equipo'}
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='name'>Nombre del Equipo</Label>
            <Input
              id='name'
              name='name'
              type='text'
              value={formData.name}
              onChange={handleChange}
              placeholder='Ingresa el nombre del equipo'
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor='description'>Descripción</Label>
            <Input
              id='description'
              name='description'
              type='text'
              value={formData.description}
              onChange={handleChange}
              placeholder='Ingresa una descripción del equipo'
              required
              disabled={loading}
            />
          </div>

          <div className='flex gap-3 pt-4'>
            <Button type='submit' disabled={loading} className='flex-1'>
              {loading ? 'Guardando...' : team ? 'Actualizar' : 'Crear'}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={loading}
              className='flex-1'
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
