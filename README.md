# SigFlow

**Lightweight TCP Message Broker built with Node.js and TypeScript.**

SigFlow is a custom message broker designed to enable communication between clients and microservices through **persistent TCP connections**, without relying on HTTP or an external message-broker platform.

The project focuses on low-level networking, authentication, message routing, and distributed-system concepts.

## Architecture

```text
                    ┌──────────────┐
                    │     SSO      │
                    │ JWT + RS256  │
                    └──────┬───────┘
                           │
                     Public Keys
                           │
                           ▼
┌────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Client   │─────▶│   SigFlow    │─────▶│   Microservice  │
│    TCP     │ TCP  │ Message      │ TCP  │      TCP        │
└────────────┘      │   Broker     │      └─────────────────┘
                    └──────┬───────┘
                           │
                    ┌──────▼──────┐
                    │ PostgreSQL  │
                    └─────────────┘
```

### Core flow

1. A client connects to SigFlow through TCP.
2. The client authenticates using a JWT issued by the SSO service.
3. SigFlow verifies the JWT using the SSO-provided public keys.
4. Commands are parsed by the broker's custom TCP protocol.
5. The broker manages events and microservice subscriptions.
6. Commands are routed through persistent TCP connections to the appropriate microservices.

## Technical Highlights

- **Node.js + TypeScript**
- Custom **TCP server/client communication** using `node:net`
- Persistent TCP connections between broker and microservices
- Custom application-level protocol and command parser
- JWT authentication with **RS256 public-key verification**
- Public-key management and `kid`-based key selection
- PostgreSQL persistence through **Prisma**
- In-memory connection tracking for active microservices
- Event → microservice routing
- Separation between networking, authentication, protocol parsing, services, and persistence
- Asynchronous I/O and event-driven architecture

The project intentionally avoids HTTP for broker communication in order to explore the mechanics of **TCP-based application protocols, connection lifecycle management, message framing, authentication, and service-to-service communication**.

## Environment

SigFlow is designed to run as a **server-side Node.js application** in a Linux or Windows development environment.

### Requirements

- Node.js 20+
- PostgreSQL
- npm
- A running SSO service capable of issuing JWTs and providing the broker with the active RSA public keys

### Configuration

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/SigFlow"

SSO_HOSTNAME="localhost"
SSO_PORT=4002

CLIENT_PORT=4000
MICROSERVICES_PORT=4001

BROKER_NAME="sigflow"
BROKER_SECRET="your-broker-secret"
```

Install dependencies and start the application:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

The broker exposes separate TCP endpoints for clients and microservices while maintaining a persistent connection to the SSO service.

## Project Structure

```text
src/
├── clientProtocol/       # Client command protocol and parsing
├── config/               # Environment configuration
├── database/             # PostgreSQL / Prisma access
├── middlewares/           # Authentication
├── servers/               # TCP servers
├── services/              # Broker/business logic
├── sso/                   # SSO connection and public keys
├── validation/            # Input validation
└── index.ts               # Application entry point
```

## Why SigFlow?

SigFlow was built to go beyond typical REST API development and explore how backend infrastructure works at a lower level:

**TCP → protocol → authentication → routing → persistent connections → microservices → database**

The project is an exercise in designing and implementing a distributed, event-driven backend system rather than simply consuming an existing messaging platform.
