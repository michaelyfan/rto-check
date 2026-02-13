# RTO Calculator - Agent Reference Guide

## Overview
This is an **RTO (Return to Office) Calculator** app—a tool to check compliance with in-office attendance policies (e.g., requiring a certain number of days over a period). It's built as a full-stack React application using modern tooling.

## Tooling Setup
This is a **React Router** project, which provides full-stack routing, server-side rendering (SSR), and data loading/mutations out of the box. It's designed for production-ready apps with modern React features.

- **Build Tool & Dev Server**: [Vite](https://vitejs.dev/) (configured in `vite.config.ts`). It handles fast hot module replacement (HMR), asset bundling, and optimization. Plugins include:
  - `@react-router/dev/vite`: Integrates React Router for routing and SSR.
  - `@tailwindcss/vite`: Enables Tailwind CSS for utility-first styling.
  - `vite-tsconfig-paths`: Supports TypeScript path aliases (e.g., `~` for the app root).
- **React & TypeScript**: 
  - React with React DOM.
  - TypeScript for type safety (configured in `tsconfig.json`).
- **UI & Styling**:
  - [Mantine](https://mantine.dev/) (v8): A React component library for UI elements like date pickers and providers. Includes `@mantine/core`, `@mantine/dates`, and `@mantine/hooks`.
  - Tailwind CSS (v4): For custom styling and responsive design.
  - Fonts: Google Fonts (Inter) loaded via `links` in `root.tsx`.
- **Other Dependencies**:
  - `dayjs`: Lightweight date manipulation (used in compliance logic).
  - `isbot`: For bot detection in SSR.
  - Docker: A `Dockerfile` is present for containerization (likely for deployment).
- **Configuration**:
  - `react-router.config.ts`: Enables SSR by default (set `ssr: true`). This means pages render on the server for better SEO and performance.

## File Layout
The project follows a flat, organized structure typical of React Router apps. 

- **Root-Level Config Files**:
  - `package.json`: Defines scripts, dependencies (React, Mantine, etc.), and dev dependencies (Vite, TypeScript).
  - `vite.config.ts`: Vite configuration with plugins.
  - `tsconfig.json`: TypeScript compiler options (e.g., strict mode, JSX support).
  - `react-router.config.ts`: React Router settings (SSR enabled).
  - `Dockerfile`: For building a containerized app.
  - `README.md`: Project docs with TODOs (e.g., add tests, improve UI).

- **app/** (Main Application Code) (might be outdated):
  - `root.tsx`: The root component and layout (includes MantineProvider, error boundary, and HTML structure).
  - `routes.ts`: Defines app routes (currently just an index route).
  - `app.css`: Global styles (likely Tailwind imports).
  - `routes/` (Route-Specific Components):
    - `home.tsx`: The home page component (renders the main calculator UI).
  - `welcome/` (UI Components):
    - `welcome.tsx`: The core "Welcome" component with the RTO calculator form (date inputs, compliance check).
  - `utils/` (Utilities):
    - `compliance.ts`: Logic for calculating RTO compliance.

- **public/**: Static assets (e.g., images, favicons—not detailed in the structure, but standard for Vite).

The layout is modular: routes are file-based (React Router convention), and components are split by feature (e.g., `welcome` for the main UI, `utils` for logic). No backend code yet—it's client-side with SSR.

## Routing / Page Layout
This is a single-page app (SPA) with SSR, using React Router's file-based routing. There's minimal routing currently (just one page), but it's set up for expansion.

- **Routing Structure**:
  - Defined in `app/routes.ts`: Uses React Router's `index` route to map the root path (`/`) to `routes/home.tsx`.
  - No nested routes yet (TODO in `routes.ts` suggests adding more).
  - Routes are auto-discovered by React Router based on the file structure.

- **Page Layout**:
  - **Root Layout** (`root.tsx`): Wraps all pages with:
    - HTML structure (`<html>`, `<head>`, `<body>`).
    - MantineProvider for theming/UI components.
    - `<Outlet />`: Placeholder where route components render.
    - Error boundary for handling route errors (e.g., 404s or crashes).
    - Scripts and links for SSR, fonts, and meta tags.
  - **Home Page** (`routes/home.tsx`): Simple wrapper that renders the `Welcome` component. Includes meta tags for SEO.
  - **Main Content** (`welcome/welcome.tsx`): The interactive page with:
    - A form to input a "calculation date" and select in-office days (using Mantine date pickers).
    - A "Do I meet the policy?" button that calls `getCompliance` from `utils/compliance.ts`.
    - Displays compliance result (compliant/not), the calculation period, and included weeks.
    - Styled with Tailwind (e.g., flex layouts, responsive design).
  - **Compliance Logic** (`utils/compliance.ts`)

The app is currently a single-page calculator. TODOs in the README suggest adding more routes (e.g., a config page) and features like authentication.
