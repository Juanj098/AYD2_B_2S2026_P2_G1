CREATE DATABASE ventas_db;

\c libros_db

CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE IF NOT EXISTS libros (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  autor VARCHAR(150) NOT NULL,
  precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
  existencias INT NOT NULL DEFAULT 0 CHECK (existencias >= 0)
);

INSERT INTO libros (titulo, autor, precio, existencias) VALUES
  ('Cien años de soledad', 'Gabriel García Márquez', 150.00, 10),
  ('El amor en los tiempos del cólera', 'Gabriel García Márquez', 135.00, 6),
  ('Hombres de maíz', 'Miguel Ángel Asturias', 120.00, 8),
  ('El Señor Presidente', 'Miguel Ángel Asturias', 110.00, 5),
  ('Pedro Páramo', 'Juan Rulfo', 95.00, 12),
  ('Rayuela', 'Julio Cortázar', 160.00, 4),
  ('La casa de los espíritus', 'Isabel Allende', 140.00, 7),
  ('Ficciones', 'Jorge Luis Borges', 105.00, 9),
  ('La sombra del viento', 'Carlos Ruiz Zafón', 175.00, 3),
  ('El túnel', 'Ernesto Sabato', 85.00, 11);