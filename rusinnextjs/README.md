# Next.js Authentication with Better Auth & AWS Cognito

A modern, full-stack task management application built with Next.js, Better Auth, and AWS Cognito for secure authentication. This project demonstrates enterprise-grade authentication patterns with role-based access control (RBAC) and MongoDB integration.

## 🚀 Features

- **AWS Cognito Integration**: Secure OAuth2/OIDC authentication with AWS Cognito
- **Better Auth Framework**: Modern authentication library with built-in support for social providers
- **Role-Based Access Control (RBAC)**: Fine-grained permission management
- **Task Management**: Create, read, update, and delete tasks with user isolation
- **MongoDB Backend**: Scalable NoSQL database with Mongoose ODM
- **TypeScript**: Full type safety across the application
- **Modern UI**: Built with React 19 and styled with Tailwind CSS
- **Server Actions**: Secure server-side operations with verification
- **User Settings**: Manage user profiles and permissions
- **Responsive Design**: Mobile-friendly interface

## 📋 Tech Stack

### Frontend

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **Tailwind CSS 4**: Utility-first CSS framework
- **TypeScript 5**: Type-safe JavaScript

### Backend & Authentication

- **Better Auth**: Modern authentication framework
- **AWS Cognito SDK**: AWS authentication service integration
- **Node.js**: JavaScript runtime

### Database

- **MongoDB 7.0**: NoSQL database
- **Mongoose 9.0**: MongoDB object modeling

### Development

- **ESLint 9**: Code linting
- **Docker Compose**: Local MongoDB setup

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/auth/[...all]/        # Dynamic auth routes
│   ├── dashboard/                # Authenticated user dashboard
│   ├── settings/                 # User settings page
│   ├── tasks/                    # Tasks management page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── LoginButton.tsx           # OAuth Cognito login
│   ├── Navigation.tsx            # Navigation menu
│   ├── SettingsForm.tsx          # User settings form
│   ├── TaskForm.tsx              # Task creation/editing
│   ├── TaskList.tsx              # Task list display
│   └── TasksContent.tsx          # Tasks page content
├── lib/                          # Utility functions & libraries
│   ├── auth.ts                   # Better Auth configuration
│   ├── auth-client.ts            # Auth client utilities
│   ├── dal.ts                    # Data access layer
│   ├── mongodb.ts                # MongoDB connection
│   ├── settings-actions.ts       # Settings operations
│   ├── task-actions.ts           # Task CRUD operations
│   └── utils.ts                  # Utility functions
├── models/                       # Mongoose schemas
│   └── Task.ts                   # Task model
├── types.d.ts                    # TypeScript declarations
└── proxy.ts                      # Proxy utilities

docker-compose.yml              # MongoDB setup
next.config.ts                  # Next.js configuration
tsconfig.json                   # TypeScript configuration
package.json                    # Dependencies & scripts
```

## 🔧 Prerequisites

- Node.js 16+ (v20 recommended)
- npm or yarn package manager
- Docker & Docker Compose (for local MongoDB)
- AWS Cognito User Pool (for authentication)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nextjs-better-auth-cognito
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB

Start a local MongoDB instance using Docker Compose:

```bash
docker-compose up -d
```

This will start MongoDB on `mongodb://admin:password@localhost:27017/task_manager`

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🔐 AWS Cognito Setup

### Creating a Cognito User Pool

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito)
2. Create a new User Pool
3. Configure authentication providers (enable password + OAuth)
4. Create an App Client:
   - Grant type: Authorization code grant
   - Redirect URI: `http://localhost:3000/api/auth/callback/cognito`
   - Allowed OAuth scopes: `email`, `openid`, `profile`, `aws.cognito.signin.user.admin`

### User Attributes

The application manages custom user attributes:

- `sub`: Cognito user ID
- `username`: User's unique username
- `role`: User role (e.g., "user", "admin")
- `permissions`: User permissions (scope-based)
- `identities`: Linked identities information

## 👥 Authentication Flow

1. User clicks "Get Started" button
2. Redirected to AWS Cognito login page
3. User authenticates with Cognito
4. Cognito redirects to callback URL with authorization code
5. Better Auth exchanges code for tokens
6. User data synchronized to MongoDB
7. User redirected to dashboard
8. Session maintained via Better Auth

## 📊 Database Schema

### User Model

- `id`: Unique identifier
- `email`: User email
- `name`: Full name
- `emailVerified`: Email verification status
- `image`: Profile picture URL
- `sub`: Cognito subject ID
- `username`: Username
- `role`: User role
- `permissions`: User permissions
- `identities`: Linked identities

### Task Model

- `_id`: MongoDB ObjectId
- `name`: Task title
- `description`: Task description
- `completed`: Completion status
- `createdBy`: User ID who created the task
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## 🔒 Security Features

- **RBAC**: Role-based access control with permission verification
- **Server Actions**: Secure server-side operations with session verification
- **Environment Variables**: Sensitive data in environment configuration
- **TypeScript**: Type safety prevents runtime errors
- **Session Management**: Better Auth handles session security
- **CORS & CSRF**: Built-in protection against common attacks

## 📚 Key Files Overview

### `src/lib/auth.ts`

Configures Better Auth with Cognito provider and custom user fields. Handles OAuth flow and user data mapping.

### `src/lib/auth-client.ts`

Client-side auth utilities for sign-in/sign-up operations.

### `src/lib/dal.ts`

Data access layer for session verification and user retrieval.

### `src/lib/task-actions.ts`

Server actions for task CRUD operations with permission checks.

### `src/lib/settings-actions.ts`

Server actions for user profile and settings management.

### `src/lib/utils.ts`

Utility functions including permission checks (`can` function).

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://www.better-auth.com)
- [AWS Cognito Guide](https://docs.aws.amazon.com/cognito/)
- [MongoDB Mongoose](https://mongoosejs.com)
- [Tailwind CSS](https://tailwindcss.com)

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created for educational purposes demonstrating modern authentication patterns with Next.js and AWS Cognito.

---

**Happy coding!** If you find this helpful, please star the repository! ⭐

rsync -avz -e "ssh -i frontend-server-key.pem" --exclude '.git' --exclude 'node_modules' rusinnextjs/ ubuntu@ec2-34-200-248-60.compute-1.amazonaws.com:~/
tar cz rusinnextjs/ | ssh -i frontend-server-key.pem ubuntu@ec2-34-200-248-60.compute-1.amazonaws.com "tar xz -C ~/"
shopt -s extglob
rm -rf !(docker-setup.sh|snap|rusinnextjs)

git clone gitlab branch code
2 task definition separate for db and app
2 templates for db and app with separate environment variables
service discovery through namespace and load balancer
add health check in task definition
put the load balancer url in secret manager through ci cd pipeline
fetch through aws cli the load balancer url and put it in the environment variables of task definition
put mongo db credentials in secrets manager and github actions secret
if puttng alb url in secret then put them in plain text
create a subdomain api.devsandbox.space and make it point to mongo db alb
enable stickiness in alb

give me ssm parameter and secrets manager code for credentials
