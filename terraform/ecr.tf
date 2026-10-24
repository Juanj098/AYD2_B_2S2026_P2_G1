locals {
  imagenes = ["frontend", "gateway", "libros-service", "ventas-service"]
}

resource "aws_ecr_repository" "imagenes" {
  for_each             = toset(local.imagenes)
  name                 = "${var.proyecto}/${each.key}"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }
}

# Conserva solo las últimas 10 imágenes de cada repositorio
resource "aws_ecr_lifecycle_policy" "imagenes" {
  for_each   = aws_ecr_repository.imagenes
  repository = each.value.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Mantener 10 imagenes"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = { type = "expire" }
    }]
  })
}
