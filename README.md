# Todos API

## What is this repository ?

This repository, as the name suggests, is an implementation of a Todos API. The main goal of this API is to serve as a "proof" (or "portfolio") of my own skills. This API is implemented in **Typescript** and uses **NodeJS 14** (might soon move to 16, even though it's not yet in LTS).

While building this API, I'm also learning new stuff and applying new concepts that I haven't used before (but likely should have).

I want this API to follow a few principles:

- [12-factor app](https://12factor.net/)
- DI (Dependency Injection) with interfaces, thanks to [tsyringe](https://github.com/microsoft/tsyringe)
- Microservices patterns
  - More specifically ensure that events are emitted at least once (not yet implemented, see [#15](https://github.com/GuillaumeDeconinck/todos-fastify/issues/15))
  - More DDD maybe (I have to (re)read more articles/books on this)
- Properly documented
- Good error messages, as the happy flow is not the only flow

## Structure of the project

| Folder or file         | Explanation                                            |
| ---------------------- | ------------------------------------------------------ |
| `__tests__`            | Unit and e2e tests                                     |
| `.github`              | Github workflow folder (CI/CD)                         |
| `src`                  | Source code, as expected                               |
| `docker-compose*.yaml` | All the docker-compose files, used for dev & e2e tests |
| `openapi.yaml`         | **OpenAPI definition** of the API                      |

Moreover, the `src` folder is divided as follows (not in alphabetical order):

| Folder or file   | Explanation                                                                   |
| ---------------- | ----------------------------------------------------------------------------- |
| `rest`           | REST, so route handlers, middlewares, etc. No logic here !                    |
| `application`    | Services doing the link between REST and domain (not really useful right now) |
| `domain`         | The models and repositories' interfaces, that's where the logic should be     |
| `infrastructure` | All the repositories implementations, e.g. Postgres                           |
| `tools`          | Utilities files such as env vars, logger & maintenance stuff                  |

> Technically `rest` could be in `infrastructure`

> **This structure can be seen as overkill for the size of this API (as there is only one resource for now)**

## How to use

### Prerequisites

For running this project, it's expected that you have already on your machine

- Node 16 & npm 8
- Docker

### Running the API

The project is quite simple to use, first clone the repository anywhere on your machine:

```sh
git clone https://github.com/GuillaumeDeconinck/todos-fastify.git
```

Then, install the dependencies:

```sh
npm ci
```

> `npm` is used here, but you can use `yarn` or `pnpm`.

As the API is expected to run in a container (e.g. in a Kubernetes cluster), I rely heavily on Docker, even for development and tests. For running the api, run the following command:

```sh
npm run dev
```

After a ~~short~~ time, you should have a running API on port `9002` (default)

### Migrations

> Outdated, to be rewritten soon

As you may have noticed, migrations weren't mentioned at all in the previous section. **The migrations are in fact run during the startup of the API.** This is not always the best thing to do (e.g. a highly sensitive migration that cannot be avoided), but for this simple API, it's okay.

To create a new migration, simply run

```sh
npx db-migrate create the-name-of-the-migration
```

It will create a new file in the `migrations` folder, with a timestamp and the name provided.

## Testing the API

### Unit tests

Simply run the following command

```sh
npm run test
```

### E2E tests

Run the following command

```sh
npm run docker:e2e
```

This will launch a few containers:

- The current API
- A Postgres database, used by the API
- A test runner -> executes Jest

The API has a volume mapped to `src` with `nodemon` running. So any change to the source code will trigger a restart of the API.

The test runner has a volume mapped to `__tests__` with `nodemon` running as well. Any change to a test will re-launch the whole E2E suite.

> You can test/focus only on one test file by changing the `command:` option in the file `docker-compose.e2e.local.yaml`.

## Conventions

A `.editorconfig` file will soon be added. In the mean time, this project uses `prettier` with `eslint` to ensure that the codebase follows the conventions properly.

## Roadmap

The roadmap is kinda described in the issues of this repository, but in "short" and not in order:

- Finish the CRUD of Todos
- Add CRUD of Tags, and link these to Todos
- Migrate current manual usage of `pg` to an ORM maybe ?
- Event emission to RabbitMQ when something is created/changed/deleted
- Handle errors more gracefully
- Handle shutdown signal gracefully (e.g. do not kill all ongoing requests)
- Prometheus metrics
- Span/tracing of requests (ELK ?)
- Proper logging in JSON with good metadata/error handling
- Healthcheck/readiness routes
- Auth with JWT
- Automated cleanup (to avoid the free Heroku DB to go full)
- Rate limiting (global and per user ?)
- Implement e2e/integration tests with supertest or something similar ?
- Add unit tests... But right now there's literally no logic to test :)
