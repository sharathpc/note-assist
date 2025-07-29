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

resource "aws_iam_role_policy" "sns_publish_policy" {
  name = "${var.lambda_function_name}-sns-publish-policy"
  role = aws_iam_role.lambda_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = "sns:Publish",
        Effect   = "Allow",
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
    content  = file("${path.root}/../lambda/index.js")
    filename = "index.js"
  }

  source {
    content  = file("${path.root}/../lambda/package.json")
    filename = "package.json"
  }
}

# Lambda function
resource "aws_lambda_function" "image_upload_notification_lambda" {
  function_name    = "image-upload-notification-lambda"
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  role             = aws_iam_role.lambda_exec_role.arn
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
