# VentureLink

VentureLink is a modern fund management platform that connects investors and founders, providing tools for efficient fund operations, investor relations, and portfolio management.

## Project Overview

This is a monorepo project built with Turborepo, containing a Next.js web application and a backend server. The platform features a modern tech stack with real-time chat capabilities, AI-powered assistance.

## Features

- 🔐 Secure authentication for both investors and founders
- 💬 Real-time chat system with AI chatbot integration
- 🤝 Investor relationship management tools
- 📈 Portfolio tracking and analytics
- 🎯 Deal flow management
- 🔄 Real-time updates and notifications
- 🎨 Modern, responsive UI with light mode support

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui hosted on Vultr
- **Backend**: Node.js, Express hosted on Vultr
- **Database**: PostgreSQL with Prisma ORM provided by Vultr
- **Real-time**: WebSocket
- **AI Integration**: Vultr API for chatbot functionality
- **Authentication**: NextAuth.js
- **Build Tool**: Turborepo

## Environment Variables

### Root Directory
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="next auth secret"
JWT_SECRET="jwt secret"
NEXT_PUBLIC_CHAT_SERVER_URL="http://localhost:3001"
VULTR_API_KEY="your-vultr-api-key"
```

### Database Configuration

```env
 DATABASE_URL="your-postgres-connection-string"
```


## Getting Started

1. Clone the repository:


```shellscript
git clone https://github.com/your-username/venturelink.git
cd venturelink
```

2. Install dependencies:


```shellscript
 npm install
```

3. Set up environment variables:

- Copy `.env.example` to `.env` in the `apps/web` directory
- Copy `.env.example` to `.env` in the `packages/db` directory
- Fill in the required environment variables


4. Set up the database:


```shellscript
    cd packages/db
    npm prisma migrate dev
    npm prisma generate 
```

5. Start the development servers:


```shellscript
 npm run dev
```

## Development

- Web app runs on: `http://localhost:3000`
- Server runs on: `http://localhost:3001`


### Available Scripts

- `npm dev` - Start all applications in development mode
- `npm build` - Build all applications
- `npm lint` - Run linting


## Deployment

1. Build the project:


```shellscript
 npm build
```

2. For production deployment:

- Start a compute on Vultr
- Clone the codebase on the server
- Configure environment variables in your deployment platforms
- Start the server after building `npm run build`


### Production Considerations

- Ensure all environment variables are properly set in your production environment
- Set up proper security headers and CORS configurations
- Configure database connection pools and caching strategies
- Set up monitoring and logging solutions


## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
