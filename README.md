# embedded_practice

A React application built with TypeScript and Vite. This project uses Tailwind CSS for styling and includes the React Compiler for optimized performance.

## About This Project

This project is an **Exam Simulator (ระบบฝึกทำข้อสอบ)** designed to help students practice for their exams. It allows users to select a subject and customize the size of the exam they want to take based on the available question bank.

**Currently Supported Subjects:**
- 01204322 Embedded System
- 01219344 Mobile Software Development (Flutter)
- 01999041 Economics for Better Living

**Key Features:**
- Interactive quiz interface with navigation (Next/Previous).
- Customizable exam size (25%, 50%, 75%, or 100% of the question bank).
- Detailed result screen to review performance after finishing the exam.

## Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview the production build:
```bash
npm run preview
```

## Features

- **React 19**
- **Vite** for fast HMR and optimized builds
- **TypeScript** for static type checking
- **Tailwind CSS v4** for utility-first styling
- **React Compiler** enabled
- **ESLint** for code linting

## Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles TypeScript and builds the app for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Previews the built application locally.
