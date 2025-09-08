# SkillLane Client

## Features

- User authentication (login/register)
- Book management (CRUD operations)
- Library browsing and search
- Responsive design with Tailwind CSS

## Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment**:
   Create `.env`:
   ## Environment Variables

    ### server run on localhost

    ```bash
    API_URL=http://localhost:8080/api
    ```

    ### server run with docker

    ```bash
    API_URL=http://host.docker.internal:8080/api
    ```

3. **Start development**:

   ```bash
   npm run dev
   ```

4. **Open**: [http://localhost:3000](http://localhost:3000)

## Docker

The application includes Docker and Docker Compose configuration for easy setup:

### Using Docker Compose (Recommended)

```bash
# Start both database and application
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d
```