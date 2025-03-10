## Getting Started

This project requires a valid Redis instance to be accessible.
This can be accomplished via Docker for example.

First, run the command to install dependencies:

```bash
npm i
# or
yarn
```

Next, copy the .env.example to .env and replace the desired SERVER_PORT and Redis connection details.

Then, run the development server:

```bash
npm run start
# or
yarn start
```

The schema definitions for exposing the views of the indexer (supabase v1_cosmos)
are generated via Drizzle using the drizzle.config.ts file. This requires the correct 
connection parameters to be set for supabase, see .env.example.

To regenerate the views run:

```bash
npx drizzle-kit pull
```