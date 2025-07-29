terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  access_key                  = "mock_access_key"
  secret_key                  = "mock_secret_key"
  region                      = var.aws_region

  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    iam        = var.localstack_url
    dynamodb   = var.localstack_url
    s3         = var.localstack_s3_url
    lambda     = var.localstack_url
    sns        = var.localstack_url
    logs       = var.localstack_url
    cloudwatch = var.localstack_url
  }
}
