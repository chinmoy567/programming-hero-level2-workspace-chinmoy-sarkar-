# Express + TypeScript Setup

## 1. Create Project Folder

```bash
mkdir express
cd express
```

---

## 2. Initialize Node Project

```bash
npm init -y
```

This creates:

- `package.json`

---

## 3. Install Express

```bash
npm i express
```

---

## 4. Install Development Dependencies

```bash
npm i -D typescript tsx @types/node @types/express
```

### Purpose

| Package        | Purpose                 |
| -------------- | ----------------------- |
| typescript     | TypeScript compiler     |
| tsx            | Run TypeScript directly |
| @types/node    | Node.js type support    |
| @types/express | Express type support    |

---

## 5. Create TypeScript Config

```bash
npx tsc --init
```

This creates:

- `tsconfig.json`

---

## 6. Create Folder Structure

```text
project/
│
├── src/
│   └── server.ts
│
├── package.json
├── tsconfig.json
└── .gitignore
```

---

## 7. Update `tsconfig.json`

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",

    "module": "esnext",
    "target": "esnext",

    "types": ["node"],

    "sourceMap": true,

    "strict": true,

    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true
  }
}
```

---

## 8. Create `server.ts`

Inside:

```text
src/server.ts
```

Add:

```ts
import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

---

## 9. Add Dev Script

Inside `package.json`

```json
"scripts": {
  "dev": "tsx watch ./src/server.ts"
}
```

---

## 10. Run Server

```bash
npm run dev
```

---

## 11. Open Browser

Visit:

```text
http://localhost:3000
```

Output:

```text
Hello world
```

---

# Recommended `.gitignore`

```gitignore
node_modules
dist
.env
```

---

# Useful Commands

## Install New Package

```bash
npm i package-name
```

## Install Dev Dependency

```bash
npm i -D package-name
```

## Run Project

```bash
npm run dev
```

---

# Important Concepts

| Concept       | Meaning                  |
| ------------- | ------------------------ |
| Node.js       | JavaScript runtime       |
| Express       | Backend framework        |
| TypeScript    | Typed JavaScript         |
| tsconfig.json | TypeScript configuration |
| tsx           | Runs TypeScript directly |
| package.json  | Project configuration    |
| npm           | Package manager          |
