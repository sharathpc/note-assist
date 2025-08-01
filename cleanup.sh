#!/bin/bash

echo "🗑️  Note Assist Infrastructure Cleanup Script"
echo "=============================================="

# Navigate to terraform directory
cd terraform

# Check if terraform state exists
if [ ! -f "terraform.tfstate" ]; then
    echo "ℹ️  No Terraform state found. Nothing to destroy."
    exit 0
fi

# Show what will be destroyed
echo "📋 Planning infrastructure destruction..."
terraform plan -destroy

# Ask for confirmation
read -p "⚠️  Are you sure you want to destroy all infrastructure? This cannot be undone! (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled."
    exit 1
fi

# Empty S3 bucket before destruction
echo "🗑️  Emptying S3 bucket..."
S3_BUCKET_NAME="ns-images-bucket"
if aws s3api head-bucket --bucket "$S3_BUCKET_NAME" 2>/dev/null; then
    echo "📦 Found S3 bucket: $S3_BUCKET_NAME"
    echo "🧹 Removing all objects from bucket..."
    aws s3 rm s3://$S3_BUCKET_NAME --recursive
    echo "✅ S3 bucket emptied successfully"
else
    echo "ℹ️  S3 bucket $S3_BUCKET_NAME not found or already deleted"
fi

# Destroy the infrastructure
echo "🗑️  Destroying infrastructure..."
terraform destroy -auto-approve

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Infrastructure successfully destroyed!"
    echo ""
    echo "🧹 Cleaning up generated files..."
    
    echo ""
    echo "🎉 Cleanup complete!"
else
    echo "❌ Cleanup failed! You may need to manually review and clean up resources."
    exit 1
fi
