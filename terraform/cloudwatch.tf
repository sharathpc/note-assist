resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/image-upload-notification-lambda"
  retention_in_days = 14

  tags = {
    Name        = "Note Assist Lambda Logs"
    Environment = "Development"
  }
}
