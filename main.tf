provider "aws" {
  access_key                  = "mock_access_key"
  secret_key                  = "mock_secret_key"
  region                      = "us-east-1"

  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    ec2            = "http://localhost:4566"
    dynamodb       = "http://localhost:4566"
    s3             = "http://s3.localhost.localstack.cloud:4566"
    lambda         = "http://localhost:4566"
    sns            = "http://localhost:4566"
  }
}

resource "aws_s3_bucket" "ns_bucket" {
  bucket = "ns-images-bucket"

  tags = {
    Name     = "Note Assist"
    Environment = "Development"
  }
}

resource "aws_dynamodb_table" "ns_users_table" {
  name             = "Users"
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  tags = {
    Name     = "Note Assist"
    Environment = "Development"
  }
}

resource "aws_dynamodb_table" "ns_notes_table" {
  name             = "Notes"
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "noteId"

  attribute {
    name = "noteId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name     = "UserIdIndex"
    hash_key = "userId"
    projection_type = "ALL"
  }

  tags = {
    Name     = "Note Assist"
    Environment = "Development"
  }
}