# Balanceador: único punto abierto a internet por HTTP
resource "aws_security_group" "alb" {
  name        = "${var.proyecto}-alb"
  description = "Trafico HTTP publico hacia el balanceador"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# VM del frontend + API Gateway: solo recibe del ALB (y SSH de administración)
resource "aws_security_group" "frontend" {
  name        = "${var.proyecto}-frontend"
  description = "Frontend (80) y API Gateway (8080)"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Frontend desde el ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description     = "API Gateway desde el ALB"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description = "SSH para Ansible"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "libros" {
  name        = "${var.proyecto}-libros"
  description = "Microservicio de libros"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "API de libros desde el gateway y desde ventas"
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.frontend.id, aws_security_group.ventas.id]
  }

  ingress {
    description = "SSH para Ansible"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ventas" {
  name        = "${var.proyecto}-ventas"
  description = "Microservicio de ventas"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "API de ventas desde el gateway"
    from_port       = 3002
    to_port         = 3002
    protocol        = "tcp"
    security_groups = [aws_security_group.frontend.id]
  }

  ingress {
    description = "SSH para Ansible"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Cada base solo acepta conexiones de su propio microservicio
resource "aws_security_group" "db_libros" {
  name        = "${var.proyecto}-db-libros"
  description = "PostgreSQL del catalogo"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.libros.id]
  }
}

resource "aws_security_group" "db_ventas" {
  name        = "${var.proyecto}-db-ventas"
  description = "PostgreSQL de las ventas"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ventas.id]
  }
}
