## Description

This project was bootstrapped with [NestJS](https://nestjs.com/) A progressive <a href="http://nodejs.org" target="blank">Node.js</a>
 framework for building efficient and scalable server-side applications.

## Install Packages

```bash
yarn install
```

## Firebase
Check [FIREBASE.md](./FIREBASE.md) for requirements and setup.

## Twilio
Create a Twillio account and setup [Network Traversal Service](https://www.twilio.com/console/video/network-traversal)
 (STUN and TURN servers, [docs]((https://www.twilio.com/docs/stun-turn))).

## SMTP Server
Setup a SMTP server of your choice, like Sendgrid.

## Database
PostgreSQL database is used.

Setting up database for development:

```postgresql
--- create user
CREATE USER project_a WITH LOGIN;
ALTER ROLE project_a with password 'password';

--- create database
CREATE DATABASE project_a WITH OWNER project_a;

--- use the new database:
\c project_a;

--- enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Environment
Copy `.env.example` file to `.env` and fill in the values.

Set database user, pw, database, etc in corresponding `TYPEORM_` vars.
For development set `TYPEORM_SYNCHRONIZE=true`, it will do database
synchronisation with the model on app startup.

Set `AUTH_RESET_PASSWORD_URL` to `<frontend_base_url>/auth/update-password/:token`.
This is the URL that will be put to password reset email.
Default is `http://localhost:3000/auth/update-password/:token`.

## ORM

[TypeORM](https://typeorm.io/#/) is used as ORM tool.

Configuration file [`ormconfig.js`](./ormconfig.js).

TypeORM CLI tool can be used as follows:

```bash
yarn run typeorm <command> [params, ...]
```

More info about CLI tool can be found in [TypeORM CLI docs](https://typeorm.io/#/using-cli).

## Fixtures

To load fixtures execute:

```bash
yarn run fixtures:load
```

## Running the app

If `TYPEORM_SYNCHRONIZE` wasn't set to true, database sync must be done manually:

```bash
yarn run typeorm schema:sync
```

To run the app execute one of the following:

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

# Heroku

Use following build packs, in corresponding order:
1. https://github.com/lstoll/heroku-buildpack-monorepo
2. https://buildpack-registry.s3.amazonaws.com/buildpacks/elishaterada/google-application-credentials-buildpack.tgz
3. heroku/nodejs

#### Database

Create PostgreSQL database on heroku.
Note the connection string

#### Env Vars

Check [heroku-google-application-credentials-buildpack](https://elements.heroku.com/buildpacks/elishaterada/heroku-google-application-credentials-buildpack) docs
to see how to include service account key.

The rest of ENV variables should be set as in .env file.
