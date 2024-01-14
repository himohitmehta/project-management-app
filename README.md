# Project Management App

Built with - NextJS, tRPC, Prisma, TailwindCSS, PlanetScale(MySQL)

Features:

- Manage Projects - Create, Update and Delete
- Manage Tasks - Create, Update and Delete
- User profile - Update user profile
- Authentication - Login with Github to use the app

## Getting Started

Running the development server for the first time

```bash
pnpm install
pnpm dev
```

Update the .env file with the following variables

```bash

DATABASE_URL='planetscale_db_connection_string'

NEXTAUTH_URL="http://localhost:3000"

AUTH_GITHUB_SECRET='github_auth_client_secret'
AUTH_GITHUB_ID='github_auth_client_id'
NEXTAUTH_SECRET="next_auth_secret"
#  You can generate a new secret on the command line with:
# openssl rand -base64 32
# https://next-auth.js.org/configuration/options#secret


```

the app will start on [http://localhost:3000](http://localhost:3000)



