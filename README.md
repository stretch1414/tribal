# tribal

An initial framework boilerplate for projects

## Prerequisites

### Bun

This project is currently built using Bun. Look at the `engines` property in the
`package.json` to see which version you need to install. Then install it from
[here](https://bun.com/) based on your operating system if necessary.

### Docker

The local development environment uses Docker to run the database and other
services. If you don't have Docker on your system, you can use the full-featured
[Docker Desktop](https://docs.docker.com/desktop/) or [Docker Engine](https://docs.docker.com/engine/install/)
if you primarily just want to use the CLI.

## Getting Started

Follow the steps below to get your local development environment setup to run the
Express API.

You'll want to start by copying the environment variable example file and
replacing any secret values present. See the `scripts` folder if you need
help generating any secret values. If you need the values for an external
service, you can get the value from another engineer or from the service directly
if you have access.

```sh
cp .env.example .env`
```

For authentication, you'll need a private key public key pair for generating
and validating JWTs. We generate the public key on the server from the given
private key. More information can be found [here](https://techdocs.akamai.com/iot-token-access-control/docs/generate-rsa-keys).

```sh
# Generate the RSA private key
openssl genrsa -out jwtRSA256-private.pem 2048
```

Next, you can spin up the local database services with Docker compose.

```sh
docker compose up -d
```

Install the package dependencies.

```sh
bun i
```

After the dependencies are installed, it's time to get the database setup. The following
command will both generate the [Prisma](https://orm.drizzle.team/) client and
migrate the Postgres database running in Docker to include our schema and tables.

```sh
bun run db:migrate
```

You'll need to seed your database with some initial data.

```sh
bun run db:seed
```

It's finally time to see if it all worked! Run this to start the server.

```sh
bun run dev
```

If you see the following (or some variation of it), then you are good to go!

```sh
2:38:05 PM - Starting compilation in watch mode...
[0]
[1] Listening on port 3000
[0]
[0] 2:38:08 PM - Found 0 errors. Watching for file changes.
[1] Restarting 'dist/server.js'
[1] [14:38:08.524] INFO (57743): SIGTERM signal received: initiating shutdown sequence
[1] [14:38:08.525] INFO (57743): Closing HTTP server
[1] Listening on port 3000
```

If you need to diagnose any issues with this process, you can run the Typescript
build process separately from the node process. This won't clear the terminal
so you can debug appropriately. Just run the following commands:

```sh
npm run build
npm run start
```

## Tech Stack

The following is a general outline of the tech stack involved in bringing this
project to life. It may not always be exhaustive, but should be kept up to date
as the project evolves.

### PostgreSQL

The primary backing database for this project is using [PostgreSQL](https://www.postgresql.org/)
(AKA "Postgres"). You can find information about the schema and tables in the
`src/db` folder.

### Prisma

We are using [Prisma](https://www.prisma.io/) as our object-relational mapping
(ORM) tool.

### Bun

We are using the [Bun]() runtime in place of Node.js. Should this prove to cause
issues at some point, we'll just revert back to using Node.js.

### Express

The primary HTTP server implementation. [Express](https://expressjs.com/) is a
lightweight and extensible server framework.

### TypeScript

In the current age of web development, [TypeScript](https://www.typescriptlang.org/)
has become the de facto standard. This gives us better intellisense in code editors.

### Dockerfile

As mentioned above, we are using Docker to run the databases and other backing
services for the API. We also use a Dockerfile to containerize the application
for deployment in any [OCI-compliant container system](https://opencontainers.org/).

### Stripe

We are using Stripe as our payment processor. You will need some environment
variables for running things locally. See the `.env.example` for the list.
Be sure to use the "test" keys.

### Webhooks

We have webhooks for Clerk and Stripe. To test those, you'll need to use
[ngrok](https://ngrok.com/docs) or another tunneling tool of your choice.
You will also need to make sure that you have the secrets for each service
in your `.env` file.

```sh
# This starts a tunnel to the default API port
ngrok http 8911

# This forwards webhook events from Stripe to our API port
stripe listen --forward-to localhost:8911/stripeWebhook
```
