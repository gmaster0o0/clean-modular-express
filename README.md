# Clean Modular Express

A small demo project showing a clean, modular Express architecture.

## Overview

This repository demonstrates how to organize an Express app with clear separation between application setup, routes, middleware, controllers, and utilities. The goal is to keep each responsibility isolated and easy to maintain.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file if needed for environment configuration.
   - The demo currently uses Prisma and Express defaults, so `.env` is optional unless you customize database or app settings.

3. Initialize Husky hooks (if not already installed):

   ```bash
   npm run prepare
   ```

## Run

Start the application in production mode:

```bash
npm start
```

Start the application in development mode with automatic reload:

```bash
npm run dev
```

## Architecture

This demo follows a clean, modular Express architecture with a modular monolith pattern.

### Project Architecture Overview

```text
app/
├── auth/                # Authentication & authorization helpers
├── middlewares/         # Shared middleware, including error handling
├── users/               # User controller and routes
├── utils/               # Reusable utilities and helpers
└── app.routes.js        # Route registration

prisma/
├── db.js                # Prisma client initialization
└── schema.prisma        # Database schema definition

test/
├── mocks/               # Centralized mocks for tests
└── testdata/            # Shared test fixtures
```

### Feature Module Pattern

Each feature module is organized around a small set of responsibilities:

```text
[feature]/
├── [feature].controller.js   # Business logic and handlers
├── [feature].router.js       # Express routes for the feature
└── [feature].spec.js         # Unit tests / feature tests
```

### Data Flow

```text
HTTP Request
    ↓
Router (app.routes.js)
    ↓
Middleware / Auth Guard
    ↓
Controller (business logic)
    ↓
Database / Prisma
    ↓
HTTP Response
```

## Authentication and authorization

The app includes an auth guard and role-based permissions in `app/auth/auth.guard.js`.

- `createAuthGuard(auth)` protects routes by validating the current session with `auth.api.getSession({ headers: req.headers })`.
- If there is no valid session, it throws an `Unauthorized` error.
- When authentication succeeds, it attaches `req.user` and `req.session` to the request.
- `restrictTo(...roles)` enforces user role permissions and throws `Forbidden` when the signed-in user does not have an allowed role.

Example usage:

```js
import { createAuthGuard, restrictTo } from './app/auth/auth.guard.js';

app.get(
  '/admin',
  createAuthGuard(auth),
  restrictTo('admin'),
  adminController
);
```

This pattern keeps authentication and authorization separate from controller logic and makes it easy to protect new routes with role-based access control.

### Why this structure?

- `app.js` keeps Express initialization separate from route wiring.
- `app.routes.js` centralizes route registration and mounts.
- Feature folders keep related code together and make the app easier to extend.
- Shared middleware and utilities reduce duplication.
- Centralized test helpers keep tests consistent and simple.

### Benefits

- Easier to reason about individual modules.
- Faster onboarding for new features.
- Better testability: controllers, routers, and middleware can be tested separately.
- Cleaner import boundaries and dependency flow.

## Testing

Run all tests:

```bash
npm test
```

Run unit tests only:

```bash
npm run test:unit
```

Run integration tests only:

```bash
npm run test:int
```

## Writing Tests

This repo uses centralized test helpers to keep tests consistent and easy to maintain.

### Centralized mocks

- `test/mocks/http.mock.js` - mock HTTP request and response objects
- `test/mocks/prisma.mock.js` - mock Prisma client behavior

Use these mocks in controller or router tests to avoid repeating boilerplate.

### Shared test data

- `test/testdata/users.testdata.js` - shared user fixtures

Import test data into test cases rather than redefining it. This keeps test coverage easier to maintain and makes shared expectations consistent.

### Example pattern

A typical test should:

1. Import shared mocks and test data.
2. Set up the mock behavior for the unit under test.
3. Call the controller or helper.
4. Assert the result and verify error handling.

Example:

```js
import { req, res, next } from '../test/mocks/http.mock.js'
import { userData } from '../test/testdata/users.testdata.js'
import { getUserController } from '../../app/users/user.controller.js'
```

### Integration test conventions

- Use centralized test data from `test/testdata/*.js` so integration tests remain consistent and easy to update.
- Use `supertest` to exercise Express routes directly and avoid manual HTTP server setup.
- Use `statusCodes` from `app/utils/status-codes.js` to assert response status values consistently.

## Notes

- The architecture is intentionally simple and demonstrative.
- Extend the demo by adding more feature modules and shared middleware.
- Keep tests DRY by using shared fixtures and mock helpers from the `test/` directory.

