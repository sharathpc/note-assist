provider "aws" {
  access_key                  = "mock_access_key"
  secret_key                  = "mock_secret_key"
  region                      = "us-east-1"

  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    iam            = "http://localhost:4566"
    ec2            = "http://localhost:4566"
    dynamodb       = "http://localhost:4566"
    s3             = "http://s3.localhost.localstack.cloud:4566"
    lambda         = "http://localhost:4566"
    sns            = "http://localhost:4566"
    logs           = "http://localhost:4566"
    cloudwatch     = "http://localhost:4566"
  }
}

provider "archive" {}

resource "aws_s3_bucket" "ns_bucket" {
  bucket = "ns-images-bucket"

  tags = {
    Name     = "Note Assist S3 Images Bucket"
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
    Name     = "Note Assist Users Table Dynamodb"
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
    Name     = "Note Assist Notes Table Dynamodb"
    Environment = "Development"
  }
}

variable "lambda_function_name" {
  description = "The name of the Lambda function"
  type        = string
  default     = "my-sns-notification-lambda"
}

# SNS Topic for image upload notifications
resource "aws_sns_topic" "image_upload_notification_topic" {
  name = "image-upload-notification-topic"

  tags = {
    Name        = "Note Assist Image Upload Notification"
    Environment = "Development"
  }
}

# Create the IAM Role for the Lambda function
resource "aws_iam_role" "lambda_exec_role" {
  name = "${var.lambda_function_name}-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/image-upload-notification-lambda"
  retention_in_days = 14

  tags = {
    Name        = "Note Assist Lambda Logs"
    Environment = "Development"
  }
}

resource "aws_iam_role_policy" "sns_publish_policy" {
  name = "${var.lambda_function_name}-sns-publish-policy"
  role = aws_iam_role.lambda_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sns:Publish",
        Effect = "Allow",
        Resource = aws_sns_topic.image_upload_notification_topic.arn
      },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect = "Allow",
        Resource = [
          aws_cloudwatch_log_group.lambda_log_group.arn,
          "${aws_cloudwatch_log_group.lambda_log_group.arn}:*"
        ]
      }
    ]
  })
}

# Create the Lambda function code as a zip file
data "archive_file" "lambda_deployment_package" {
  type        = "zip"
  output_path = "/tmp/lambda_function.zip"
  
  source {
    content  = file("${path.module}/lambda/index.js")
    filename = "index.js"
  }
  
  source {
    content  = file("${path.module}/lambda/package.json")
    filename = "package.json"
  }
}

# Lambda function
resource "aws_lambda_function" "image_upload_notification_lambda" {
  function_name    = "image-upload-notification-lambda"
  handler         = "index.handler"
  runtime         = "nodejs20.x"
  role            = aws_iam_role.lambda_exec_role.arn
  filename         = data.archive_file.lambda_deployment_package.output_path
  source_code_hash = data.archive_file.lambda_deployment_package.output_base64sha256

  environment {
    variables = {
      SNS_TOPIC_ARN = aws_sns_topic.image_upload_notification_topic.arn
    }
  }

  tags = {
    Name        = "Note Assist Image Upload Notification"
    Environment = "Development"
  }

  depends_on = [
    aws_cloudwatch_log_group.lambda_log_group,
    aws_iam_role_policy.sns_publish_policy
  ]
}

# Lambda permission for S3 to invoke the function
resource "aws_lambda_permission" "allow_s3_invoke" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.image_upload_notification_lambda.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.ns_bucket.arn
}

# S3 bucket notification configuration
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.ns_bucket.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.image_upload_notification_lambda.arn
    events              = ["s3:ObjectCreated:*"]
  }

  depends_on = [aws_lambda_permission.allow_s3_invoke]
}