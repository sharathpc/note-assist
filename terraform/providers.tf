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
  region                      = "us-east-1"

  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    iam        = "http://localhost:4566"
    ec2        = "http://localhost:4566"
    dynamodb   = "http://localhost:4566"
    s3         = "http://s3.localhost.localstack.cloud:4566"
    lambda     = "http://localhost:4566"
    sns        = "http://localhost:4566"
    logs       = "http://localhost:4566"
    cloudwatch = "http://localhost:4566"
  }
}
