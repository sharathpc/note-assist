#!/bin/bash

echo "🚀 Note Assist Infrastructure Deployment Script"
echo "================================================"

# Check if LocalStack is running
echo "📡 Checking if LocalStack is running..."
if ! curl -s http://localhost:4566/_localstack/health > /dev/null; then
    echo "❌ LocalStack is not running. Please start LocalStack first."
    echo "   Run: docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack"
    exit 1
fi
echo "✅ LocalStack is running!"

# Navigate to terraform directory
cd terraform

# Initialize Terraform
echo "⚙️  Initializing Terraform..."
terraform init

# Validate configuration
echo "🔍 Validating Terraform configuration..."
terraform validate
if [ $? -ne 0 ]; then
    echo "❌ Terraform configuration validation failed!"
    exit 1
fi

# Plan the deployment
echo "📋 Planning Terraform deployment..."
terraform plan

# Ask for confirmation
read -p "🤔 Do you want to proceed with the deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

# Apply the configuration
echo "🚀 Applying Terraform configuration..."
terraform apply -auto-approve

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment complete!"
    echo "======================="
    echo ""
    echo "📚 Database Resources:"
    echo "• Users Table: $(terraform output -raw users_table_name 2>/dev/null || echo 'N/A')"
    echo "• Notes Table: $(terraform output -raw notes_table_name 2>/dev/null || echo 'N/A')"
    echo "• S3 Bucket: $(terraform output -raw s3_bucket_name 2>/dev/null || echo 'N/A')"
    echo ""
    echo "🔧 Next Steps:"
    echo "1. Wait a few minutes for the application to start"
    echo "2. Test the API: curl \$(terraform output -raw application_url)/health"
    echo "3. SSH to instance: ssh -i keys/note-assist-key ec2-user@\$(terraform output -raw instance_public_ip)"
    echo "4. Check application logs: ssh -i keys/note-assist-key ec2-user@\$(terraform output -raw instance_public_ip) 'sudo journalctl -u note-assist -f'"
    echo "5. Your actual Note Assist API is now running from the cloned repository!"
    echo ""
else
    echo "❌ Deployment failed!"
    exit 1
fi
