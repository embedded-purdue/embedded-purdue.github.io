# Project Name

A React-based web application built with TypeScript, Next.js, and MDX. This project is designed to provide a modular and scalable architecture for modern web development.

## Features

- **React**: Component-based UI development.
- **TypeScript**: Type-safe code for better maintainability.
- **Next.js**: Server-side rendering and static site generation.
- **MDX**: Markdown with JSX for dynamic content.
- **PostCSS**: CSS transformations and optimizations.
- **Custom Hooks**: Reusable logic for mobile detection and toast notifications.

## Project Structure

- **`app/`**: Contains the main pages and layouts of the application.
- **`components/`**: Reusable UI components and MDX-related utilities.
- **`hooks/`**: Custom React hooks like `use-mobile` and `use-toast`.
- **`lib/`**: Utility functions for markdown processing and workshop data handling.
- **`content/`**: Blog and workshop content configuration.
- **`styles/`**: Global CSS styles.
- **`public/`**: Static assets like images and icons.

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Run the development server:
   ```sh
   npm run dev
   ```

Open the app in your browser at [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run linting checks.

## Configuration

- `tsconfig.json`: TypeScript configuration.
- `next.config.mjs`: Next.js configuration.
- `astro.config.mjs`: Astro configuration for MDX.
- `postcss.config.mjs`: PostCSS configuration.

## Custom Hooks

- `use-mobile`: Detects if the user is on a mobile device.
- `use-toast`: Manages toast notifications.

## Utilities

- **Markdown Utilities**: Functions for processing markdown content.
- **General Utilities**: Helper functions.

## Styling

Global styles are defined in `styles/globals.css` and `app/globals.css`.

## License

This project is licensed under the MIT License.
