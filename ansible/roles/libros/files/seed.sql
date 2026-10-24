-- Catálogo inicial. Solo inserta si la tabla está vacía, así se puede correr varias veces.
INSERT INTO libros (titulo, autor, precio, existencias)
SELECT v.titulo, v.autor, v.precio, v.existencias
FROM (VALUES
  ('Cien años de soledad', 'Gabriel García Márquez', 150.00, 10),
  ('El amor en los tiempos del cólera', 'Gabriel García Márquez', 135.00, 6),
  ('Hombres de maíz', 'Miguel Ángel Asturias', 120.00, 8),
  ('El Señor Presidente', 'Miguel Ángel Asturias', 110.00, 5),
  ('Pedro Páramo', 'Juan Rulfo', 95.00, 12),
  ('Rayuela', 'Julio Cortázar', 160.00, 4),
  ('La casa de los espíritus', 'Isabel Allende', 140.00, 7),
  ('Ficciones', 'Jorge Luis Borges', 105.00, 9),
  ('La sombra del viento', 'Carlos Ruiz Zafón', 175.00, 3),
  ('El túnel', 'Ernesto Sabato', 85.00, 11)
) AS v(titulo, autor, precio, existencias)
WHERE NOT EXISTS (SELECT 1 FROM libros);
