# AYD2_B_2S2026_P2_G1 - Librería AYD

Plataforma web para consultar el catálogo de una librería, buscar libros por título o autor,
registrar ventas y ver el ranking de los más vendidos. Construida con microservicios,
contenedorizada con Docker y desplegada en AWS con Terraform y Ansible.

## Documentación

- [Arquitectura, diagrama de despliegue y contratos de API](docs/arquitectura.md)
- [Guía de despliegue en AWS](docs/despliegue.md)
- [Manual de usuario](docs/manual-usuario.md)

## Estructura

```
frontend/          SPA (HTML/CSS/JS) servida por Nginx
gateway/           API Gateway (Nginx): /api/libros, /api/ventas
libros-service/    Microservicio de Libros (Node + Express + PostgreSQL)
ventas-service/    Microservicio de Ventas (Node + Express + PostgreSQL)
db/                Script de BD para el entorno local
terraform/         Infraestructura AWS: VPC, EC2 + EIP, ALB, RDS, ECR, IAM
ansible/           Configuración de las VMs y despliegue de contenedores
scripts/           build-push.sh: construir y subir imágenes a ECR
docs/              Documentación
```

## Correr en local

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Gateway: http://localhost:8080/api/libros

## Desplegar en AWS (resumen)

```bash
cd terraform && terraform init && terraform apply && cd ..
./scripts/build-push.sh
cd ansible && ansible-playbook -i inventory/hosts.yml site.yml
```

Detalle completo en [docs/despliegue.md](docs/despliegue.md).
