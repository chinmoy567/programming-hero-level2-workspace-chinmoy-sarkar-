# Project Setup

## 1. Initialize Node.js Project

```bash
npm init
```

---

## 2. Install TypeScript

```bash
npm install typescript tsx @types/node --save-dev
```

---

## 3. Generate TypeScript Configuration

```bash
npx tsc --init
```

---

## 4. Install Prisma CLI

```bash
npm install prisma @types/pg --save-dev
```

---

## 5. Install Prisma Client & PostgreSQL

```bash
npm install @prisma/client @prisma/adapter-pg pg dotenv
```

---

## 6. Verify Prisma Installation

```bash
npx prisma
```

---

## 7. Initialize Prisma

```bash
npx prisma init --output ../generated/prisma
```

This creates:

```
prisma/
├── schema.prisma

prisma.config.ts
.env
generated/
└── prisma/
```

---

## 8. Install Express

```bash
npm install express
```

---

## 9. Install Express Type Definitions

```bash
npm install -D @types/express
```

---

## 10. Install bcrypt

```bash
npm install bcryptjs
```

---

## 11. Install CORS

```bash
npm install cors
```

---

## 12. Install CORS Type Definitions

```bash
npm install -D @types/cors
```

---

## 13. Install Cookie Parser

```bash
npm install cookie-parser
```

---

## 14. Install Cookie Parser Type Definitions

```bash
npm install -D @types/cookie-parser
```

---

## 15. Install HTTP Status

```bash
npm install http-status
```

---

## 16. Install JSON Web Token

```bash
npm install jsonwebtoken
```

---

## 17. Install JWT Type Definitions

```bash
npm install -D @types/jsonwebtoken
```

---

# Final Dependencies

## Production Dependencies

- express
- @prisma/client
- @prisma/adapter-pg
- pg
- dotenv
- bcryptjs
- cors
- cookie-parser
- http-status
- jsonwebtoken

## Development Dependencies

- typescript
- tsx
- prisma
- @types/node
- @types/pg
- @types/express
- @types/cors
- @types/cookie-parser
- @types/jsonwebtoken

---

# Project Setup Completed

- Node.js initialized
- TypeScript configured
- Prisma configured
- PostgreSQL packages installed
- Express installed
- Authentication packages installed
- CORS configured
- Cookie Parser installed
- JWT installed
- Password hashing library installed

The project is now ready for:
- Database configuration
- Prisma schema creation
- Database migration
- Express server setup
- Authentication module implementation