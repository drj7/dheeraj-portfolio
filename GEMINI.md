# Gemini Project Overview

This project is a modern web application built with a React frontend and a Node.js backend. It serves as a portfolio for Dheeraj, showcasing his skills and projects. The application is designed to be visually appealing and interactive, with a focus on user experience.

## Project Structure

The project is organized into the following directories:

- `client/`: Contains the React frontend code, including components, pages, and styles.
- `server/`: Contains the Node.js backend code, which serves the frontend and provides API endpoints.
- `shared/`: Contains code that is shared between the frontend and backend.
- `dist/`: Contains the production build of the application.

## Technologies Used

- **Frontend:**
  - React
  - Vite
  - Tailwind CSS
  - wouter (for routing)
- **Backend:**
  - Node.js
  - Express
- **Testing:**
  - Vitest
  - React Testing Library

## Building and Running the Project

To build and run the project, you will need to have Node.js and pnpm installed on your machine.

**1. Install Dependencies:**

```bash
pnpm install
```

**2. Run the Development Server:**

```bash
pnpm dev
```

This will start the development server on `http://localhost:3000`.

**3. Build for Production:**

```bash
pnpm build
```

This will create a production build of the application in the `dist` directory.

## Testing the Project

To run the tests, use the following command:

```bash
pnpm test
```

This will run the tests in watch mode. To run the tests once, use the following command:

```bash
pnpm test:run
```

To generate a coverage report, use the following command:

```bash
pnpm test:coverage
```

## Development Conventions

The project follows standard React and Node.js development conventions. All code is written in TypeScript and formatted with Prettier. The project also uses ESLint to enforce code quality.

All components are well-tested with React Testing Library, and the project has a high level of test coverage.

## API Endpoints

The backend provides the following API endpoints:

- `/api/chat`: This endpoint is used for the chat functionality of the application.

All other requests are proxied to the frontend to enable client-side routing.
