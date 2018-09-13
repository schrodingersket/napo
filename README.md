# NAPO

Welcome to NAPO (Node, Angular, PostgreSQL, OAuth)!

This is a simple starter project for getting quickly
up and running with the aforementioned stack. It comes
pre-populated with everything necessary to create
and authenticate users with OAuth 2.0. Currently, only
the `password` grant type is supported, but the architecture
can certainly be extended to support other grant flows.

## Prerequisites

You must have [Docker](https://docs.docker.com/) and 
[Docker Compose][https://docs.docker.com/compose/] installed.

That's it!

## Getting Started

Getting started is simple:

```
docker-compose build && docker-compose up
```

And that should be it! The front end is available at
http://localhost, and the back end at http://localhost:3000.

## Adding a user

To add a user, simply `POST` the following JSON to 
http://localhost:3000/api/v1/user:

```json
{
  "email": "foo@bar.com",
  "password": "password",
  "username": "foo.bar"
}
```

You'll receive a response body that looks like this:

```json
{
    "email": "foo@bar.com",
    "username": "foo.bar",
    "id": 1
}
```

## Getting a User Token

Once you've created the above user, you can send a `POST` to
http://localhost:3000/api/v1/login with the following body:

```
email=foo@bar.com&username=foo.bar&password=password&grant_type=password&client_id=898d7b9c43c3b45e79008ae58098a484
```

Make sure you attach the `Content-Type: application/x-www-form-urlencoded` HTTP
header when you send your request!

You'll receive a JSON-encoded response body that looks like this:

```json
{
    "access_token": "<token>",
    "token_type": "bearer",
    "expires_in": 1209599999994,
    "refresh_token": "<refresh token>",
    "refresh_token_expires_in": 1209351619,
    "scope": null
}
```


## Getting a User

Now that you're authenticated, you can get your user info!

Make a `GET` request to http://localhost:3000/api/v1/user/1,
and attach the following header to your request:

```
Authorization: Bearer <token>
```

You should see a JSON response like this:

```json
{
    "email": "foo@bar.com",
    "username": "foo.bar",
    "id": 1
}
```

## JSON Schema Validation

The project also includes automatic JSON schema validation -
just add the schema JSON appropriate to your route and HTTP method,
and the application will do the rest!

For instance, if you'd like to validate a `POST` body to `/api/v1/token/validate`,
just insert your schema into `server/lib/validation/schema/token/validate/post.json`.
The file path after `server/lib/validation/schema` is relative to `/api/v1`. Note
that this file path is explicitly defined as the first argument when you 
initialize the middleware. For example, taken from `./routes/user/password/index.js`:

```javascript
'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});

const API = require('../../../lib/api');
const middleware = require('../../../middleware');

router.route('/reset')
  .post(
    middleware.validation('/user/password/reset'),
    API.user.resetPassword
  );

router.route('/update')
  .post(
    middleware.validation('/user/password/update'),
    API.user.updatePassword
  );

module.exports = router;
```

Note also that only `POST` and `PUT` requests with a content type of `application/json`
are validated this way - so if you don't have the schema, your request will fail!
I did this mostly to keep myself from being lazy with the creation of new routes.


## Path Exclusion for Authentication

There are certain paths you'll likely want to not require authentication; for instance,
`POST` requests to `/api/v1/user` and `/api/v1/login` are allowed access, as they
should be world-readable. By default, every path behind `/api/v1` requires authentication.
You can include new paths which should be allowed through without authentication by 
modifying `server/lib/server/allowed-paths.json`. The paths specified here are relative
to `/api/v1`. Note that for paths with contain path parameters, these must be included in
the path specified in the JSON file exactly how they're specified in your routers (e.g.,
 `/user/:userId`).


## Clearing data

By default, the `docker-compose.yml` file in this directory includes a Docker volume for
the PostgreSQL deployment to maintain database state. If you want to start completely fresh,
you can just run:

```
docker-compose down -v
```

## Development

Any changes you make to files in the `server` project can be immediately refreshed without
rebuilding by running `docker-compose restart server`.

If you make changes to the PostgreSQL initialization script (any files with a *.sql extension
in the `postgres/sql` directory), or changes to the front-end code, you'll need to rebuild
and restart those services:

```
docker-compose down && docker-compose build && docker-compose up
```

Add the `-v` flag just after `down` as specified in the previous section to also clear out
your data.

Alternatively, for the front-end, you can run `npm start` to run a live reload front end
so that you don't have to rebuild the Docker image every time. CORS is enabled for the
server, so you can simply make requests to http://localhost:3000/api/v1 directly.

In addition, both the `server` and `client` repositories contain `.nvmrc` files which have
Node versions that match those used in their corresponding Docker images. Using 
[NVM](https://github.com/creationix/nvm) to download and use those Node versions
is highly recommended for development, since it drastically reduces build time.
