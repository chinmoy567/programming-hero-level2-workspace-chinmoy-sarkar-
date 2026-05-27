# TypeScript + Express Backend Setup

## Initialize Project

```bash
npm init --y
```

---

## Install TypeScript

```bash
npm i -D typescript
```

---

## Initialize TypeScript Config

```bash
npx tsc --init
```

---

## Set Module Type

Add this in `package.json`

```json
"type": "module"
```

---

## Update tsconfig.json

Comment this line:

```json
// "jsx": "react-jsx",
```

Add these lines:

```json
"include": ["src/**/*"],
"exclude": []
```

---

## Create src Folder

```bash
src/
```

---

## Install Express

```bash
npm i express
```

---

## Install Express Types

```bash
npm i --save-dev @types/express
```

---

## Install TSX

```bash
npm i -D tsx
```

---

## Add Dev Script

Add this inside `package.json`

```json
"scripts": {
  "dev": "tsx watch src/server.ts"
}
```

---

## Run Development Server

```bash
npm run dev
```

---

# Ready For Build & Deployment

## Update Scripts

Replace scripts with:

```json
"scripts": {
  "start": "node dist/server.js",
  "dev": "tsx watch ./src/server.ts",
  "build": "tsup"
}
```

---

## Install TSUP

```bash
npm i tsup
```

---

## Create tsup.config.ts

Create `tsup.config.ts` in project root

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],

  format: ["esm", "cjs"],

  target: "esnext",

  outDir: "dist",

  clean: true,

  bundle: true,

  splitting: false,

  sourcemap: true,

  banner: {
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
  },
});
```

---

## Build Project

```bash
npm run build
```

---

## Run Production Server

```bash
npm start
```

---

# Example server.ts

```ts
import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
```

---

# .gitignore

Create `.gitignore`

```gitignore
node_modules
dist
.env
```