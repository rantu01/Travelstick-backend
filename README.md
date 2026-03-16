# Travelstick Backend

A modular, TypeScript-based backend for the Travelstick application. This repository implements a clean, feature-oriented folder structure with focused modules for activities, bookings, payments, users, and many other travel-related features.

**Highlights**
- Modular folder-per-feature architecture under `src/modules/`
- TypeScript, Express, Mongoose and Zod for validation
- Built-in helpers for email, file handling, and pagination
- Scripts for development, build, linting, and production start

**Tech stack**
- Node.js + TypeScript
- Express
- MongoDB (Mongoose)
- Zod for request validation
- Tools: `ts-node-dev`, `eslint`, `prettier`

Getting started
---------------

Prerequisites
- Node.js (v16+ recommended)
- npm (or yarn)
- A running MongoDB instance (local or hosted)

Quick setup
1. Install dependencies:

	npm install

2. Copy the environment template and set required variables:

	cp .env.example .env

	At minimum set values for `PORT`, `MONGODB_URI`, and `JWT_SECRET`.

3. Run in development mode (auto-reloads on change):

	npm run start:dev

4. Build for production:

	npm run build

5. Start the production bundle:

	npm run start:prod

Available npm scripts
- `start:dev` — development server with `ts-node-dev`
- `start:prod` — run the compiled `dist` bundle
- `build` — compile TypeScript to `dist/`
- `lint`, `lint:fix` — ESLint checks and fixes
- `prettier`, `prettier:fix` — format code with Prettier

Project layout (important paths)
- `src/server.ts` — application entry point
- `src/app.ts` — Express app configuration
- `src/config/` — configuration (database, environment)
- `src/middleware/` — common Express middleware (auth, error handler, validation)
- `src/modules/` — feature modules (each module has controller, service, model, route, validation)
- `src/utils/` — helpers, email worker, utilities

Notable modules
- activities, advertisement, auth, blog, booking, hotel, payment, product, user, visa, and many more — each lives in `src/modules/<name>` and follows the same modular pattern.

Environment variables (example)
Create a `.env` file and include the values required by your environment. A minimal example:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/travelstick
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.example.com
SMTP_USER=user@example.com
SMTP_PASS=supersecret
```

Configuration and customization
- Database configuration is in `src/config/database.ts` — update the connection string or options as needed.
- Adjust logging, security middleware (helmet, cors), and rate limiting in `src/app.ts` or the appropriate middleware files.

Testing & linting
- There are no unit tests included by default. Use the existing `eslint` and `prettier` scripts to keep code quality consistent:

  npm run lint
  npm run prettier

Deployment
- Build with `npm run build`, then run `npm run start:prod` on your production host. Ensure environment variables are set in your deployment environment.

Contributing
- Follow the existing code style (TypeScript + ESLint + Prettier).
- Add new features as modules under `src/modules/` following existing patterns (controller, service, model, route, validation).

Where to look next
- API routes live in `src/modules/*/*.route.ts` and are registered from `src/routes/index.ts`.
- Error handling is centralized in `src/middleware/globalErrorHandler.ts` and related error helpers in `src/errors/`.

License
- This project is licensed under the MIT License (see `package.json`).

Questions or help
- If you want, I can:
  - add a `.env.example` with commonly used variables,
  - add a short contributing guide, or
  - generate API docs from the routes.

Enjoy developing with Travelstick!

