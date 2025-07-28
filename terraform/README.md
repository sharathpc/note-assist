# Note Assist Terraform Infrastructure

This directory contains the modularized Terraform configuration for the Note Assist application infrastructure.

## Structure

The infrastructure has been organized into logical modules for better maintainability:

### Files

- **`providers.tf`** - AWS and Archive provider configurations
- **`variables.tf`** - Input variables for the infrastructure
- **`s3.tf`** - S3 bucket configuration and notifications
- **`dynamodb.tf`** - DynamoDB tables for users and notes
- **`sns.tf`** - SNS topics for notifications
- **`lambda.tf`** - Lambda function and IAM configurations
- **`cloudwatch.tf`** - CloudWatch log groups
- **`outputs.tf`** - Output values for important resource identifiers

## Resources Created

### S3
- **`ns_bucket`** - S3 bucket for storing images with notification configuration

### DynamoDB
- **`ns_users_table`** - Users table with userId as hash key
- **`ns_notes_table`** - Notes table with noteId as hash key and UserIdIndex GSI

### SNS
- **`image_upload_notification_topic`** - Topic for image upload notifications

### Lambda
- **`image_upload_notification_lambda`** - Function triggered by S3 events
- **`lambda_exec_role`** - IAM role for Lambda execution
- **`sns_publish_policy`** - IAM policy for SNS publishing permissions

### CloudWatch
- **`lambda_log_group`** - Log group for Lambda function logs

## Usage

This module is imported in the root `main.tf` file. To deploy:

```bash
# From the root directory
terraform init
terraform plan
terraform apply
```

## Variables

- **`lambda_function_name`** - Name of the Lambda function (default: "my-sns-notification-lambda")

## Outputs

The module exports several important values:
- S3 bucket name and ARN
- DynamoDB table names
- SNS topic ARN
- Lambda function name and ARN

## LocalStack Configuration

This configuration is set up to work with LocalStack for local development, with all endpoints pointing to `localhost:4566`.
