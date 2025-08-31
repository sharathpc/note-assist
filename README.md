# 📝 Note Assist

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.79.3-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.9-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Terraform](https://img.shields.io/badge/Terraform-1.0+-purple.svg)](https://terraform.io/)
[![AWS](https://img.shields.io/badge/AWS-LocalStack-orange.svg)](https://localstack.cloud/)
[![Docker](https://img.shields.io/badge/Docker-Required-blue.svg)](https://docker.com/)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey.svg)](https://reactnative.dev/)
[![Architecture](https://img.shields.io/badge/Architecture-Monorepo-red.svg)](https://en.wikipedia.org/wiki/Monorepo)
[![Database](https://img.shields.io/badge/Database-DynamoDB-yellow.svg)](https://aws.amazon.com/dynamodb/)
[![Storage](https://img.shields.io/badge/Storage-S3-orange.svg)](https://aws.amazon.com/s3/)

A modern React Native mobile application for note-taking with AWS backend services, built with a monorepo architecture using Terraform for infrastructure management and LocalStack for local development.

<img src="mobile/assets/noteassist-logo.png" alt="Note Assist" width="250" height="auto" />

## 🚀 Features

- **📱 Cross-platform Mobile App** - Built with React Native and Expo
- **🔐 User Authentication** - Secure login and registration system
- **📝 Rich Note Management** - Create, edit, and organize notes
- **🖼️ Image Support** - Attach images to your notes
- **☁️ Cloud Storage** - AWS S3 for image storage
- **🗄️ NoSQL Database** - DynamoDB for data persistence
- **🔔 Real-time Notifications** - SNS for push notifications
- **⚡ Serverless Functions** - AWS Lambda for image processing
- **🏗️ Infrastructure as Code** - Terraform for AWS resource management
- **🐳 Local Development** - LocalStack for AWS service emulation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   Express API   │    │   AWS Services  │
│   Mobile App    │◄──►│   (TypeScript)  │◄──►│   (LocalStack)  │
│   (Expo)        │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Terraform     │    │   DynamoDB      │
                       │   Infrastructure│    │   S3 + SNS      │
                       └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
note-assist/
├── 📱 mobile/                    # React Native mobile application
│   ├── app/                     # Expo Router app directory
│   ├── components/              # Reusable UI components
│   ├── services/                # API service layer
│   ├── store/                   # State management (Zustand)
│   ├── models/                  # TypeScript interfaces
│   └── assets/                  # Images, fonts, and static files
├── 🔧 services/                 # Express.js backend API
│   ├── src/
│   │   ├── routes/              # API route handlers
│   │   ├── models/              # Data models
│   │   └── aws/                 # AWS service configurations
│   └── Dockerfile               # Container configuration
├── 🏗️ terraform/                # Infrastructure as Code
│   ├── dynamodb.tf             # Database tables
│   ├── s3.tf                   # Storage bucket
│   ├── sns.tf                  # Notification topics
│   ├── lambda.tf               # Serverless functions
│   └── cloudwatch.tf           # Logging configuration
├── 🐳 docker-compose.yaml       # Local development setup
├── 🚀 deploy.sh                 # Deployment automation
├── 🧹 cleanup.sh                # Infrastructure cleanup
└── 📚 DEPLOYMENT.md             # Detailed deployment guide
```

## 🛠️ Tech Stack

### Frontend (Mobile)
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **Gluestack UI** - Modern component library
- **NativeWind** - Tailwind CSS for React Native
- **Zustand** - Lightweight state management
- **Expo Router** - File-based routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe development
- **AWS SDK** - AWS service integration
- **Multer** - File upload handling
- **Zod** - Schema validation

### Infrastructure
- **Terraform** - Infrastructure as Code
- **AWS Services** - Cloud infrastructure
- **LocalStack** - AWS service emulation
- **Docker** - Containerization

### AWS Services Used
- **DynamoDB** - NoSQL database
- **S3** - Object storage
- **SNS** - Push notifications
- **Lambda** - Serverless functions
- **CloudWatch** - Logging and monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g @expo/cli`)
- Terraform 1.0+
- Docker and Docker Compose
- LocalStack (for local development)

### 1. Clone the Repository

```bash
git clone https://github.com/sharathpc/note-assist.git
cd note-assist
```

### 2. Start LocalStack

```bash
docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack
```

### 3. Deploy Infrastructure

```bash
./deploy.sh
```

### 4. Start Backend Services

```bash
cd services
npm install
npm run dev
```

### 5. Start Mobile App

```bash
cd mobile
npm install
npx expo start
```

## 📱 Mobile App Development

### Features
- **Authentication** - Login and registration with email
- **Note Management** - Create, edit, delete, and organize notes
- **Image Attachments** - Add images to notes with camera or gallery
- **Offline Support** - Local storage with MMKV
- **Modern UI** - Beautiful interface with Gluestack UI components
- **Responsive Design** - Works on phones and tablets

### Key Components
- **Custom UI Components** - Reusable, themed components
- **State Management** - Zustand for global state
- **API Integration** - Axios for HTTP requests
- **Image Handling** - Expo Image Picker for media
- **Navigation** - Expo Router for file-based routing

## 🔧 Backend API

### Endpoints

#### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login

#### Notes
- `GET /notes` - Get user's notes
- `POST /notes` - Create new note
- `GET /notes/:id` - Get specific note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

#### Images
- `POST /images/upload` - Upload image
- `GET /images/:id` - Get image

### Data Models

#### User
```typescript
interface IUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}
```

#### Note
```typescript
interface INote {
  noteId: string;
  userId: string;
  title: string;
  content: string;
  status: string;
  imageUrl: string | null;
  createdAt: number;
  updatedAt: number;
}
```

## 🏗️ Infrastructure

### AWS Resources
- **DynamoDB Tables**
  - `ns_users_table` - User data storage
  - `ns_notes_table` - Note data storage with GSI
- **S3 Bucket** - `ns_bucket` for image storage
- **SNS Topic** - Image upload notifications
- **Lambda Function** - Image processing automation
- **CloudWatch** - Logging and monitoring

### LocalStack Configuration
All AWS services are configured to work with LocalStack for local development:
- Endpoint: `localhost:4566`
- Region: `us-east-1`
- Credentials: LocalStack defaults

## 🚀 Deployment

### Local Development
```bash
# Start LocalStack
docker run --rm -it -p 4566:4566 localstack/localstack

# Deploy infrastructure
./deploy.sh

# Start services
cd services && npm run dev
cd mobile && npx expo start
```

### Production Deployment
```bash
# Deploy to AWS (update terraform configuration)
cd terraform
terraform init
terraform plan
terraform apply
```

## 🧪 Testing

### Mobile App
```bash
cd mobile
npm run lint
npm run fmt
```

### Backend API
```bash
cd services
npm run build
npm start
```

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions
- [Terraform Documentation](terraform/README.md) - Infrastructure setup
- [API Documentation](services/README.md) - Backend API reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

⭐ **Star this repository if you find it helpful!** 