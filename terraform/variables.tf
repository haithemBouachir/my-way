variable "aws_region" {
  description = "AWS region used for deployment"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used in tags and resource names"
  type        = string
  default     = "my-way"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "root_volume_size" {
  description = "EC2 root EBS volume size in GiB"
  type        = number
  default     = 20
}

variable "key_name" {
  description = "Existing AWS EC2 key pair name used for SSH access"
  type        = string
}

variable "ami_id" {
  description = "Optional AMI override. Leave empty to use latest Ubuntu 24.04 LTS image"
  type        = string
  default     = ""
}

variable "ssh_ingress_cidr" {
  description = "CIDR allowed to connect on SSH port 22"
  type        = string
  default     = "0.0.0.0/0"
}

variable "tags" {
  description = "Additional tags applied to AWS resources"
  type        = map(string)
  default     = {}
}
