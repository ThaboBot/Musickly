# Musickly - Your AI Music Co-pilot

This is a Next.js application built in Firebase Studio that uses AI to help you create music. It features a variety of tools, from lyric generation to album art creation, all powered by Google's Genkit.

## Getting Started

To get started, explore the features on the main dashboard accessible from the root page (`/`).

## Running Locally in VS Code

To run this project on your local machine using Visual Studio Code, follow these steps:

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 20 or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   A [Google AI API Key](https://aistudio.google.com/app/apikey). Genkit uses this to power the AI features.

### 1. Install Dependencies

Open a terminal in VS Code (`View` > `Terminal`) and install the necessary packages:

```bash
npm install
```

### 2. Set Up Environment Variables

The project uses a `.env` file to manage secret keys.

1.  Create a new file named `.env` in the root of your project.
2.  Add your Google AI API key to this file:

```
GOOGLE_API_KEY="YOUR_GOOGLE_AI_API_KEY_HERE"
```

Replace `"YOUR_GOOGLE_AI_API_KEY_HERE"` with the actual key you obtained from Google AI Studio.

### 3. Run the Development Servers

This application requires two separate development servers to run concurrently: one for the Next.js frontend and one for the Genkit AI backend.

**Terminal 1: Run the Genkit AI Server**

In your first VS Code terminal, start the Genkit development server. This server watches your AI flow files for changes.

```bash
npm run genkit:dev
```

**Terminal 2: Run the Next.js App**

Open a second terminal in VS Code (click the `+` icon in the terminal panel) and start the Next.js development server.

```bash
npm run dev
```

### 4. Open the App

Once both servers are running, you can view your application by opening your browser and navigating to:

[http://localhost:9002](http://localhost:9002)

You're all set! Any changes you make to the code will automatically reload the application.
