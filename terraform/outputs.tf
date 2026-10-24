output "url_aplicacion" {
  description = "Entrada pública de la plataforma (balanceador)"
  value       = "http://${aws_lb.main.dns_name}"
}

output "ips_publicas" {
  description = "IPs estáticas de cada VM"
  value       = { for k, eip in aws_eip.vm : k => eip.public_ip }
}

output "ips_privadas" {
  value = { for k, vm in aws_instance.vm : k => vm.private_ip }
}

output "ecr_registry" {
  description = "Registro donde se publican las imágenes"
  value       = split("/", aws_ecr_repository.imagenes["frontend"].repository_url)[0]
}

output "ecr_repositorios" {
  value = { for k, r in aws_ecr_repository.imagenes : k => r.repository_url }
}

output "db_endpoints" {
  value = { for k, db in aws_db_instance.db : k => db.address }
}
