# SNS Topic for image upload notifications
resource "aws_sns_topic" "image_upload_notification_topic" {
  name = "image-upload-notification-topic"

  tags = {
    Name        = "Note Assist Image Upload Notification"
    Environment = "Development"
  }
}
