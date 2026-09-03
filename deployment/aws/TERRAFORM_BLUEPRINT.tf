# Terraform AWS Infrastructure Blueprint for CitizenCare Platform

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  default = "us-east-1"
}

# 1. Dedicated VPC
resource "aws_vpc" "citizencare_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "citizencare-prod-vpc" }
}

# 2. AWS RDS PostgreSQL 16 Multi-AZ Instance
resource "aws_db_instance" "citizencare_postgres" {
  identifier          = "citizencare-prod-postgres"
  allocated_storage   = 50
  engine              = "postgres"
  engine_version      = "16.1"
  instance_class      = "db.t3.medium"
  db_name             = "citizencare_db"
  username            = "citizencare_admin"
  password            = var.db_password
  multi_az            = true
  skip_final_snapshot = true
}

# 3. AWS S3 Storage for Photo & Document Evidence
resource "aws_s3_bucket" "citizencare_evidence" {
  bucket = "citizencare-evidence-storage-prod"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "citizencare_s3_encryption" {
  bucket = aws_s3_bucket.citizencare_evidence.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# 4. AWS Application Load Balancer
resource "aws_lb" "citizencare_alb" {
  name               = "citizencare-prod-alb"
  internal           = false
  load_balancer_type = "application"
}

# 5. AWS CloudWatch SLA Alarm
resource "aws_cloudwatch_metric_alarm" "sla_breach_alarm" {
  alarm_name          = "citizencare-high-sla-breach-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "OverdueComplaints"
  namespace           = "CitizenCare/SLA"
  period              = 300
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Triggered when overdue civic complaints exceed 5 in a 10-minute window"
}
