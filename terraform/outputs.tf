output "instance_public_ip" {
  value = aws_instance.solyntek.public_ip
}

output "instance_id" {
  value = aws_instance.solyntek.id
}

output "ssh_user" {
  value = "ubuntu"
}
