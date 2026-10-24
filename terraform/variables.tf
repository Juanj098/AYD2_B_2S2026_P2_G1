variable "region" {
  description = "Región de AWS donde se despliega todo"
  type        = string
  default     = "us-east-1"
}

variable "proyecto" {
  description = "Prefijo para nombrar los recursos"
  type        = string
  default     = "libreria-ayd"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "instance_type" {
  description = "Tipo de las máquinas virtuales (frontend, libros y ventas)"
  type        = string
  default     = "t3.micro"
}

variable "ssh_public_key_path" {
  description = "Llave pública que se carga en las VMs"
  type        = string
  default     = "~/.ssh/libreria-ayd.pub"
}

variable "ssh_private_key_path" {
  description = "Llave privada que usará Ansible para conectarse"
  type        = string
  default     = "~/.ssh/libreria-ayd"
}

variable "admin_cidr" {
  description = "Rango que puede entrar por SSH (idealmente su IP pública /32)"
  type        = string
  default     = "0.0.0.0/0"
}

variable "db_instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "db_engine_version" {
  type    = string
  default = "16"
}

variable "db_allocated_storage" {
  description = "Almacenamiento inicial en GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Límite de autoescalado del almacenamiento en GB"
  type        = number
  default     = 50
}

variable "db_backup_retention" {
  description = "Días de respaldo automático (las cuentas free tier solo permiten 0)"
  type        = number
  default     = 0
}

variable "db_username" {
  type    = string
  default = "libreria"
}

variable "image_tag" {
  description = "Tag de las imágenes en ECR que se despliegan"
  type        = string
  default     = "latest"
}
