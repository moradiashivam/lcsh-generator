# LCSH Generator

A modern web application that generates Library of Congress Subject Headings (LCSH) using AI. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🤖 AI-powered LCSH generation
- 🌓 Dark/Light mode
- 💫 Interactive particle background
- 📱 Fully responsive design
- 🔑 Secure API key management
- 📋 One-click copying of headings

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js)
- A DeepSeek API key

## Installation Guide

1. **Clone the repository**
   ```bash
   git clone [https://github.com/moradiashivam/lcsh-generator]
   cd lcsh-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add your DeepSeek API key:
     ```
     VITE_DEEPSEEK_API_KEY=your_api_key_here
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```
   The built files will be in the `dist` directory.

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Particle Effects**: tsParticles
- **Build Tool**: Vite
- **API**: DeepSeek AI

## Project Structure

```
lcsh-generator/
├── src/
│   ├── components/
│   │   └── ParticlesBackground.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts
│   └── index.css
├── public/
├── .env
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Development Team

### Developer
- **Shivam Vallabhbhai Moradia**
  - College Librarian
  - St. Xavier's College (Autonomous) Ahmedabad

### Project Mentor
- **Dr. Meghna Vyas**
  - Associate Professor
  - Sardar Patel University, Vallabhvidhyanagar
