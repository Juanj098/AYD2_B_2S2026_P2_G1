resource "aws_db_subnet_group" "main" {
  name       = "${var.proyecto}-db"
  subnet_ids = aws_subnet.privada[*].id
}

resource "random_password" "db" {
  for_each = toset(["libros", "ventas"])
  length   = 24
  special  = false
}

locals {
  bases = {
    libros = { nombre = "libros_db", sg = aws_security_group.db_libros.id }
    ventas = { nombre = "ventas_db", sg = aws_security_group.db_ventas.id }
  }
}

# Una base gestionada por microservicio (database per service)
resource "aws_db_instance" "db" {
  for_each   = local.bases
  identifier = "${var.proyecto}-${each.key}"

  engine                = "postgres"
  engine_version        = var.db_engine_version
  instance_class        = var.db_instance_class
  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = "gp2"
  storage_encrypted     = true

  db_name  = each.value.nombre
  username = var.db_username
  password = random_password.db[each.key].result

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [each.value.sg]
  publicly_accessible    = false

  backup_retention_period = var.db_backup_retention
  skip_final_snapshot     = true
  deletion_protection     = false
  apply_immediately       = true

  tags = { Name = "${var.proyecto}-${each.key}-db" }
}
