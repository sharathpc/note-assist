# Note Assist - LocalStack EC2 Deployment

This repository contains the infrastructure and deployment configuration for deploying the Note Assist Node.js API to a LocalStack EC2 instance using Terraform.

## 🏗️ Infrastructure Overview

The deployment creates the following AWS resources in LocalStack:

### Networking
- **VPC** with DNS resolution enabled
- **Internet Gateway** for external connectivity
- **Public Subnet** in us-east-1a
- **Route Table** with internet access
- **Security Group** allowing HTTP (80), API (3000), and SSH (22) access

### Compute
- **EC2 Instance** (t2.micro) running Amazon Linux 2
- **SSH Key Pair** for secure access
- **User Data Script** for automatic application setup

### Storage & Database
- **DynamoDB Tables** for Users and Notes
- **S3 Bucket** for image storage
- **SNS Topic** for notifications (existing)
- **Lambda Function** for processing (existing)

## 📋 Prerequisites

1. **LocalStack** running on your machine:
   ```bash
   docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack
   ```

2. **Terraform** installed (version >= 1.0)

3. **AWS CLI** (optional, for testing)

## 🚀 Quick Deployment

### 1. Deploy Infrastructure
```bash
./deploy.sh
```

This script will:
- Check LocalStack connectivity
- Generate SSH keys if needed
- Initialize and validate Terraform
- Deploy all infrastructure
- Display connection details

### 2. Test the Deployment
```bash
# Test the health endpoint
curl $(cd terraform && terraform output -raw application_url)/health

# Test the main API endpoint
curl $(cd terraform && terraform output -raw application_url)/
```

### 3. SSH to the Instance (Optional)
```bash
# Get the instance IP
INSTANCE_IP=$(cd terraform && terraform output -raw instance_public_ip)

# SSH to the instance
ssh -i terraform/note-assist-key ec2-user@$INSTANCE_IP
```

## 🧹 Cleanup

To destroy all infrastructure:
```bash
./cleanup.sh
```

## 📁 Project Structure

```
.
├── deploy.sh                    # Main deployment script
├── cleanup.sh                   # Infrastructure cleanup script
├── services/
│   ├── .env.production         # Production environment variables
│   └── [your existing API code]
└── terraform/
    ├── providers.tf            # AWS provider configuration (existing)
    ├── variables.tf            # Terraform variables (updated)
    ├── outputs.tf              # Terraform outputs (updated)
    ├── ec2.tf                  # EC2 and networking resources (new)
    ├── user-data.sh            # EC2 initialization script (new)
    ├── dynamodb.tf             # DynamoDB tables (existing)
    ├── s3.tf                   # S3 bucket (existing)
    ├── sns.tf                  # SNS topic (existing)
    ├── lambda.tf               # Lambda function (existing)
    └── [SSH keys generated during deployment]
```

## 🔧 Configuration Details

### Environment Variables
The EC2 instance is configured with:
- `PORT=3000` - API server port
- `AWS_HOST=localhost:4566` - LocalStack endpoint
- `NODE_ENV=production` - Production environment
- AWS credentials for LocalStack

### Application Setup
The user data script automatically:
1. Installs Node.js 18 and dependencies
2. Clones the Note Assist repository from GitHub
3. Navigates to the services directory
4. Creates production environment configuration
5. Installs npm packages and builds the TypeScript application
6. Sets up systemd service for the actual API
7. Configures Nginx reverse proxy
8. Starts all services

### Git Repository Integration
- The EC2 instance clones your actual repository: `https://github.com/sharathpc/note-assist.git`
- Application runs from `/opt/note-assist/services/`
- Uses your real API code, not a demo application
- Automatically builds and deploys your TypeScript services

### Security
- Security group allows only necessary ports
- SSH access via generated key pair
- EC2 instance in public subnet with internet access

## 🌐 API Endpoints

After deployment, your API will be available at:
- **Health Check**: `http://<instance-ip>:3000/health`
- **Main API**: `http://<instance-ip>:3000/`
- **Via Nginx**: `http://<instance-ip>/` (port 80)

## 🔍 Monitoring & Logs

### Application Logs
```bash
# SSH to instance and check logs
ssh -i terraform/note-assist-key ec2-user@$INSTANCE_IP
sudo journalctl -u note-assist -f
```

### Repository Updates
```bash
# SSH to instance and update code
ssh -i terraform/note-assist-key ec2-user@$INSTANCE_IP
cd /opt/note-assist
sudo git pull origin main
cd services
sudo npm run build
sudo systemctl restart note-assist
```

### Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🛠️ Troubleshooting

### Common Issues

1. **LocalStack not running**
   ```bash
   # Start LocalStack
   docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack
   ```

2. **SSH connection issues**
   ```bash
   # Check security group allows SSH
   # Verify key permissions
   chmod 600 terraform/note-assist-key
   ```

3. **Application not starting**
   ```bash
   # SSH to instance and check service status
   sudo systemctl status note-assist
   sudo journalctl -u note-assist
   
   # Check if repository was cloned successfully
   ls -la /opt/note-assist/
   
   # Manually rebuild if needed
   cd /opt/note-assist/services
   npm run build
   sudo systemctl restart note-assist
   ```

### Repository Access
- The deployment clones from: `https://github.com/sharathpc/note-assist.git`
- Make sure your repository is public or configure SSH keys for private repos
- Application files are located at: `/opt/note-assist/services/`
- The actual Note Assist API with all your routes and logic is deployed

### Manual Application Updates

To deploy code changes after initial deployment:

1. SSH to the instance
2. Navigate to the repository directory
3. Pull latest changes and rebuild:
   ```bash
   cd /opt/note-assist
   git pull origin main
   cd services
   npm run build
   sudo systemctl restart note-assist
   ```

## 📝 Notes

- This setup uses LocalStack's AMI ID placeholder
- The application starts with a demo Express server
- Replace the demo code with your actual Note Assist services
- All AWS resources are created in LocalStack, not real AWS
- The deployment is suitable for development and testing

## 🔗 Related Documentation

- [LocalStack Documentation](https://docs.localstack.cloud/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/)
- [Note Assist API Documentation](./services/README.md)
