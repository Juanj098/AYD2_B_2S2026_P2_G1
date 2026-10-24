data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
}

resource "aws_key_pair" "admin" {
  key_name   = "${var.proyecto}-key"
  public_key = file(pathexpand(var.ssh_public_key_path))
}

locals {
  vms = {
    frontend = { subnet = 0, sg = aws_security_group.frontend.id }
    libros   = { subnet = 0, sg = aws_security_group.libros.id }
    ventas   = { subnet = 1, sg = aws_security_group.ventas.id }
  }
}

resource "aws_instance" "vm" {
  for_each               = local.vms
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.publica[each.value.subnet].id
  vpc_security_group_ids = [each.value.sg]
  key_name               = aws_key_pair.admin.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  root_block_device {
    volume_size = 16
    volume_type = "gp3"
  }

  metadata_options {
    http_tokens = "required" # IMDSv2
  }

  tags = { Name = "${var.proyecto}-${each.key}" }
}

# IP pública estática para cada VM
resource "aws_eip" "vm" {
  for_each = aws_instance.vm
  instance = each.value.id
  domain   = "vpc"

  tags = { Name = "${var.proyecto}-${each.key}-eip" }
}
