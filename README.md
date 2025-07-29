# Chalet User Dashboard

A modern web application for managing chalets and bookings, built with Vite, React, and TypeScript.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Docker Deployment](#docker-deployment)
- [Version Control & Releases (Optional)](#version-control--releases-optional)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Prerequisites

Before running the app, ensure you have the following installed:

- **Node.js** (version 18.x or higher)
- **npm** (version 8 or higher)
- **Git**
- **Docker** (optional, for containerized deployment)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/jamobrand/chalet-user.git
cd chalet-admin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_REACT_APP_BACKEND_URL="http://localhost:6170/api" 
VITE_REACT_APP_API_URL=http://localhost:6170 
VITE_REACT_APP_PAYSTACK_TEST_KEY=


```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:4500`

## Environment Setup

### Development Environment

For local development:

1. **API Backend**: Ensure your Chalet API is running (typically on port 6170)
2. **Environment Variables**: Configure the `.env` file with development settings
3. **Hot Reload**: The Vite dev server provides instant hot module replacement

### Production Environment

For production deployment:

1. Build the application for production
2. Use Docker for consistent deployment across environments
3. Configure production environment variables
4. Ensure API endpoints are accessible from the production environment

## Development Workflow

### Running the Application

**Development Mode:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
```

**Preview Production Build:**
```bash
npm run preview
```

### Code Quality

The project includes automated code quality tools:

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Type checking
npm run type-check

# Format code
npx prettier --write .
```

## Docker Deployment

### Building Docker Image

Get the current version and build the Docker image:

```bash
# Get the version from package.json
VERSION=$(node -p "require('./package.json').version")

# Build Docker image with version tag
docker build -t kiapoynt/chalet-user:$VERSION .

# Optionally, also tag as latest
docker build -t kiapoynt/chalet-user:latest .
```

### Running Docker Container

Start the container with the specific version:

```bash
# Using the version from package.json
VERSION=$(node -p "require('./package.json').version")

# Run the container
sudo docker run -d -p 4600:4600 --name chalet-admin kiapoynt/chalet-user:$VERSION

# Or run with latest tag
sudo docker run -d -p 4600:4600 --name chalet-admin kiapoynt/chalet-user:latest
```

### Docker Management Commands

```bash
# Stop the container
docker stop chalet-user

# Remove the container
docker rm chalet-user

# View running containers
docker ps

# View container logs
docker logs chalet-user

# Remove old images (cleanup)
docker image prune -f
```

### Docker Compose (Optional)

Create a `docker-compose.yml` file for easier management:

```yaml
version: '3.8'
services:
  chalet-admin:
    build: .
    ports:
      - "4600:4600"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Run with Docker Compose:

```bash
docker-compose up -d
```

## Version Control & Releases (Optional)

**Note:** Version control with changesets is optional. You can choose to use it for structured releases or skip this section for simpler workflows.

### Why Use Version Control?

- **Structured Releases**: Automatic changelog generation
- **Semantic Versioning**: Clear version increments (patch, minor, major)
- **Team Collaboration**: Better tracking of changes and features
- **Docker Integration**: Consistent versioning across deployments

### Setup (One-time)

If you choose to use version control:

```bash
npx changeset init
```

### Feature Development Workflow

#### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
# Examples: feature/dashboard-redesign, feature/booking-calendar, feature/user-management
```

#### 2. Develop Your Feature

Make your changes, test thoroughly, and ensure the build works correctly.

#### 3. Create Changeset (Optional)

```bash
npx changeset
```

Select the type of change and describe your modifications.

#### 4. Commit and Push

```bash
git add .
git commit -m "feat: Add your feature description

- Detailed description of UI changes
- New components or pages added
- Any breaking changes or migration notes"

git push -u origin feature/your-feature-name
```

#### 5. Create Pull Request

1. Go to your GitHub repository
2. Click "Compare & pull request"
3. Fill in the PR description with:
   - Screenshots of UI changes
   - Description of new functionality
   - Testing instructions
   - Any dependencies on API changes

#### 6. Review and Merge

Follow the same review process as described in the API documentation.

#### 7. Post-Merge Steps

```bash
# Switch to main and pull changes
git checkout main
git pull origin main

# Delete feature branch
git branch -d feature/your-feature-name
```

### Release Process (If Using Version Control)

#### 1. Version Bump

```bash
npx changeset version
```

#### 2. Commit Release Changes

```bash
git add .
git commit -m "chore(release): prepare for version $(node -p "require('./package.json').version")"
```

#### 3. Create Git Tag and Push

```bash
VERSION=$(node -p "require('./package.json').version")
git tag v$VERSION
git push origin v$VERSION
git push origin main
```

#### 4. Build and Deploy Docker Image

```bash
# Build with the new version
VERSION=$(node -p "require('./package.json').version")
docker build -t kiapoynt/chalet-user:$VERSION .

# Deploy the new version
sudo docker stop chalet-user || true
sudo docker rm chalet-user || true
sudo docker run -d -p 4600:4600 --name chalet-user kiapoynt/chalet-user:$VERSION
```

### Simplified Workflow (Without Version Control)

If you prefer a simpler approach without changesets:

1. Make changes directly on main branch or use feature branches
2. Build and test locally: `npm run build`
3. Build Docker image: `docker build -t kiapoynt/chalet-user:latest .`
4. Deploy: `sudo docker run -d -p 4600:4600 --name chalet-user kiapoynt/chalet-user:latest`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on source files |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run type-check` | Run TypeScript type checking |

## Project Structure

```
chalet-admin/
├── src/
│   ├── components/         # Reusable UI components
│   ├── routes/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── assets/            # Static assets (images, icons)
│   └── App.tsx            # Main application component
├── public/                # Public assets
├── dist/                  # Production build (generated)
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## Key Features

- **Modern React Stack**: Built with React 18, TypeScript, and Vite
- **Responsive Design**: Mobile-first approach with modern UI components
- **Authentication**: JWT-based authentication with the Chalet API
- **Real-time Updates**: WebSocket integration for live data updates
- **File Upload**: Support for image and document uploads
- **Docker Ready**: Containerized deployment for consistent environments
- **Type Safety**: Full TypeScript integration for better development experience

## API Integration

The frontend integrates with the Chalet API backend:

- **Base URL**: Configure in `VITE_API_BASE_URL` environment variable
- **Authentication**: JWT tokens stored securely and sent with requests
- **Error Handling**: Centralized error handling for API responses
- **Loading States**: Proper loading indicators for all async operations

## Deployment Considerations

### Environment Variables

Ensure all production environment variables are properly set:

- API endpoints should point to production backend
- Remove or disable development-only features
- Configure proper error reporting (Sentry, etc.)

### Performance

- The production build is optimized with Vite's built-in optimizations
- Images and assets are automatically optimized
- Code splitting is implemented for optimal loading

### Security

- Environment variables starting with `VITE_` are exposed to the client
- Never include sensitive information in client-side environment variables
- API authentication tokens are handled securely

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'feat: Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a pull request

### Code Style Guidelines

- Use TypeScript for all new components
- Follow React best practices and hooks patterns
- Use meaningful component and variable names
- Include JSDoc comments for complex functions
- Ensure responsive design for all new UI components

## Troubleshooting

### Common Issues

**Build Errors:**
- Ensure Node.js version is 18.x or higher
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

**Docker Issues:**
- Ensure Docker is running: `docker --version`
- Check port availability: `lsof -i :4500`
- View container logs: `docker logs chalet-admin`

**API Connection Issues:**
- Verify API is running and accessible
- Check CORS configuration on the backend
- Confirm environment variables are correctly set

## Support

For questions or issues:

1. Check existing [GitHub Issues](https://github.com/jamobrand/chalet-admin/issues)
2. Create a new issue with detailed description and screenshots
3. Contact the maintainer: James Kariuki

## License

This project is UNLICENSED. See the package.json file for details.