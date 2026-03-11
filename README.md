# InterviewFlow AI Monorepo

AI destekli teknik mulakat hazirlik platformu icin full-stack monorepo.

## Proje Yapisi

- `apps/api`: Express + TypeScript backend
- `apps/worker`: RabbitMQ consumer evaluation worker (mock provider)
- `apps/admin`: operasyon/admin paneli (React + Vite)
- `apps/web`: candidate-facing interview uygulamasi (React + Vite)
- `packages/shared-types`: paylasilan tipler
- `packages/eslint-config`: paylasilan ESLint config
- `packages/tsconfig`: paylasilan TypeScript config

## Teknoloji

- Node.js + npm workspaces
- Express.js + TypeScript
- React + Vite + TypeScript
- MongoDB + Redis + RabbitMQ + Elasticsearch
- TanStack Query, React Router, React Hook Form, Zod
- Docker Compose

## Hizli Baslangic

### 1) Ortam dosyalarini olustur

Ornek dosyalari kopyalayip `.env` olustur:

- `/.env.example` -> `/.env`
- `/apps/api/.env.example` -> `/apps/api/.env`
- `/apps/worker/.env.example` -> `/apps/worker/.env`
- `/apps/admin/.env.example` -> `/apps/admin/.env`
- `/apps/web/.env.example` -> `/apps/web/.env`

`apps/api/.env` icinde en az su alanlari doldur:

- `JWT_SECRET` (en az 16 karakter, tercihen 32+)
- `MONGODB_URI`
- `REDIS_URL`
- `RABBITMQ_URL`
- `ELASTICSEARCH_NODE`

### 2) Altyapi servislerini kaldir

```bash
docker compose up -d mongodb redis rabbitmq elasticsearch
```

### 3) Node bagimliliklarini kur

```bash
npm install
```

### 4) Uygulamalari calistir

Ayri terminallerde:

```bash
npm run dev --workspace @interviewflow/api
npm run dev --workspace @interviewflow/worker
npm run dev --workspace @interviewflow/admin
npm run dev --workspace @interviewflow/web
```

## URL'ler

- API health: `http://localhost:4000/health`
- API docs: `http://localhost:4000/docs`
- Admin UI: `http://localhost:5173`
- Candidate Web UI: `http://localhost:5174`
- RabbitMQ Management: `http://localhost:15672` (`guest` / `guest`)

## Candidate Flow (apps/web)

Route'lar:

- `/login`
- `/dashboard`
- `/interviews`
- `/interviews/:id`
- `/sessions/:sessionId`
- `/sessions/:sessionId/result`

Akis:

1. Kullanici login olur (`POST /api/v1/auth/login`)
2. Interview secer (`GET /api/v1/interviews`, `GET /api/v1/interviews/:id`)
3. Session baslatir (`POST /api/v1/interviews/:id/start`)
4. Cevaplari adim adim kaydeder (`POST /api/v1/sessions/:sessionId/answers`)
5. Submit eder (`POST /api/v1/sessions/:sessionId/submit`)
6. Status polling ile takip edilir (`GET /api/v1/sessions/:sessionId/status`)
7. Sonuc ekraninda score + feedback gosterilir (`GET /api/v1/sessions/:sessionId/result`)

Not: Ilk versiyonda evaluation sonucu mock akis ile uretilir.

## Scriptler

Root:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run format`

Workspace bazli:

```bash
npm run dev --workspace @interviewflow/api
npm run dev --workspace @interviewflow/worker
npm run dev --workspace @interviewflow/admin
npm run dev --workspace @interviewflow/web
```

## Mimari Notlar

- API startup asamasinda Mongo/Redis/RabbitMQ/Elasticsearch baglantilarini dener.
- Worker evaluation job tuketimi ve retry mantigina sahip.
- Admin operasyon ekranidir; candidate sinav deneyimi `apps/web` altindadir.
- Session/evaluation state su an demo odakli olarak API tarafinda in-memory tutulur.
