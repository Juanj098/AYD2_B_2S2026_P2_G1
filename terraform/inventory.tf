# Inventario de Ansible generado a partir de lo que Terraform creó
resource "local_sensitive_file" "inventario" {
  filename        = "${path.module}/../ansible/inventory/hosts.yml"
  file_permission = "0600"

  content = templatefile("${path.module}/templates/hosts.yml.tftpl", {
    ip_publica    = { for k, eip in aws_eip.vm : k => eip.public_ip }
    ip_privada    = { for k, vm in aws_instance.vm : k => vm.private_ip }
    llave_privada = pathexpand(var.ssh_private_key_path)
    region        = var.region
    registry      = split("/", aws_ecr_repository.imagenes["frontend"].repository_url)[0]
    repos         = { for k, r in aws_ecr_repository.imagenes : k => r.repository_url }
    image_tag     = var.image_tag
    db_usuario    = var.db_username
    db_host       = { for k, db in aws_db_instance.db : k => db.address }
    db_nombre     = { for k, db in aws_db_instance.db : k => db.db_name }
    db_password   = { for k, p in random_password.db : k => p.result }
  })
}
