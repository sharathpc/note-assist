# Outputs for the Note Assist infrastructure
output "s3_bucket_name" {
  description = "Name of the S3 bucket for images"
  value       = aws_s3_bucket.ns_bucket.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket for images"
  value       = aws_s3_bucket.ns_bucket.arn
}

output "users_table_name" {
  description = "Name of the DynamoDB users table"
  value       = aws_dynamodb_table.ns_users_table.name
}

output "notes_table_name" {
  description = "Name of the DynamoDB notes table"
  value       = aws_dynamodb_table.ns_notes_table.name
}

output "sns_topic_arn" {
  description = "ARN of the SNS topic for image upload notifications"
  value       = aws_sns_topic.image_upload_notification_topic.arn
}

output "lambda_function_name" {
  description = "Name of the Lambda function for image upload notifications"
  value       = aws_lambda_function.image_upload_notification_lambda.function_name
}

output "lambda_function_arn" {
  description = "ARN of the Lambda function for image upload notifications"
  value       = aws_lambda_function.image_upload_notification_lambda.arn
}