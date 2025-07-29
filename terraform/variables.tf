variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "localstack_url" {
  description = "LocalStack URL"
  type        = string
  default     = "http://localhost:4566"
}

variable "localstack_s3_url" {
  description = "LocalStack S3 URL"
  type        = string
  default     = "http://s3.localhost.localstack.cloud:4566"
}

variable "lambda_function_name" {
  description = "The name of the Lambda function"
  type        = string
  default     = "my-sns-notification-lambda"
}
