# Interview Forge

Interview Forge is a small Next.js application that generates three thoughtful interview questions for a role entered by the user. It was built for a technical screen that asks for a clean, readable web page, a working AI API call, a loading state, and simple error handling.

## Features

- Accepts a job title from a text input.
- Sends the job title to a server-side API route.
- Calls the Gemini API from the server so the API key is not exposed in the browser.
- Returns exactly three role-specific interview questions.
- Shows a loading state while the request is running.
- Shows a readable error message if generation fails.
- Keeps prompts generic and avoids personal information.

## Tech Stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Google Gemini API](https://ai.google.dev/)
- `@google/genai` SDK

## Project Structure

```text
interview-forge/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts        # POST API route for generating questions
│   ├── globals.css             # Global styles and Tailwind import
│   ├── layout.tsx              # App layout and metadata
│   └── page.tsx                # Main client-side UI
├── lib/
│   └── gemini.ts               # Gemini client and prompt logic
├── public/                     # Static assets
├── package.json
└── README.md
```

## How It Works

1. The user enters a job title in the form on the homepage.
2. The client sends a `POST` request to `/api/generate` with this JSON body:

```json
{
  "jobTitle": "Customer Success Manager"
}
```

3. The API route validates that a job title was provided.
4. The server calls the Gemini API with a focused prompt asking for three role-specific interview questions.
5. The Gemini response is parsed as a JSON array.
6. The client renders the returned questions in an ordered list.

## Prompt

The Gemini helper currently uses this prompt pattern:

```text
You are an experienced HR professional and hiring manager.
Generate exactly 3 thoughtful, role-specific interview questions for a {jobTitle} position.
Focus on a mix of behavioral, situational, and competency-based questions.
Return ONLY a JSON array of 3 strings. No explanations, no markdown, no extra text.
Example format: ["Question 1?", "Question 2?", "Question 3?"]
```

This prompt keeps the output predictable by asking for a JSON array only. The application still includes fallback parsing in case the model returns extra text around the JSON.

## Environment Variables

Create a `.env` file in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

The `.env` file is ignored by Git through `.gitignore`, so the API key should not be committed.

You can create a Gemini API key from Google AI Studio:

```text
https://ai.google.dev/
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:3000
```

On Windows PowerShell, if `npm` is blocked by execution policy, use:

```bash
npm.cmd run dev
```

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production build locally. Run `npm run build` first.

```bash
npm run lint
```

Runs ESLint across the project.

## API Route

### `POST /api/generate`

Request body:

```json
{
  "jobTitle": "Customer Success Manager"
}
```

Successful response:

```json
{
  "questions": [
    "Question one?",
    "Question two?",
    "Question three?"
  ]
}
```

Error response:

```json
{
  "error": "Missing jobTitle"
}
```

or:

```json
{
  "error": "Generation failed"
}
```

## Privacy and Security

- The Gemini API key is read only on the server through `process.env.GEMINI_API_KEY`.
- The browser calls the local API route instead of calling Gemini directly.
- The prompt should only include generic job titles.
- Do not paste private resumes, phone numbers, names, addresses, or other personal information into the app.
- Do not commit `.env` or any API keys to GitHub.

## Deployment

This app can be deployed for free on Vercel.

1. Push the repository to GitHub.
2. Create a new Vercel project from the GitHub repository.
3. Add the environment variable `GEMINI_API_KEY` in the Vercel project settings.
4. Deploy the project.
5. Test the live URL by generating questions for `Customer Success Manager`.

Other hosting providers can also work as long as they support Next.js server routes and environment variables.

## Notes for Reviewers

The core implementation is intentionally small. The main logic lives in `lib/gemini.ts`, while the server boundary lives in `app/api/generate/route.ts`. The UI is kept simple so the generated interview questions and the working API call remain the focus of the assignment.
