resource "aws_s3_bucket" "ns_bucket" {
  bucket        = "ns-images-bucket"
  force_destroy = true

  tags = {
    Name        = "Note Assist S3 Images Bucket"
    Environment = "Development"
  }
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
