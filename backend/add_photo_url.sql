-- Script SQL para agregar la columna photo_url a la tabla players
-- Ejecutar este script en PostgreSQL

-- Verificar si la columna ya existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'players' 
        AND column_name = 'photo_url'
    ) THEN
        -- Agregar la columna photo_url
        ALTER TABLE players ADD COLUMN photo_url TEXT;
        RAISE NOTICE 'Columna photo_url agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna photo_url ya existe';
    END IF;
END $$; 