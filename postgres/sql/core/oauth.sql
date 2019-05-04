CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE CHECK(email = lower(email)),
  username VARCHAR NOT NULL UNIQUE CHECK(username = lower(username)),
  password VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS oauth_clients (
  id SERIAL PRIMARY KEY,
  client_id VARCHAR,
  client_secret VARCHAR,
  client_name VARCHAR,
  access_token_lifetime INTEGER,
  refresh_token_lifetime INTEGER,

  CONSTRAINT oauth_clients_id_secret_unique UNIQUE(client_id)
);

CREATE TABLE IF NOT EXISTS oauth_redirect_uris (
  id SERIAL PRIMARY KEY,
  redirect_uri VARCHAR,
  client_id VARCHAR REFERENCES oauth_clients(client_id) DEFAULT '898d7b9c43c3b45e79008ae58098a484',

  CONSTRAINT oauth_redirect_uris_uri_client_id_unique UNIQUE(redirect_uri, client_id)
);

CREATE TABLE IF NOT EXISTS oauth_grants (
  id SERIAL PRIMARY KEY,
  grant_name VARCHAR,
  client_id VARCHAR REFERENCES oauth_clients(client_id)
);

CREATE TABLE IF NOT EXISTS oauth_tokens (
  id SERIAL PRIMARY KEY,
  access_token VARCHAR,
  expires_at TIMESTAMP DEFAULT NOW(),
  scope VARCHAR,
  refresh_token VARCHAR,
  refresh_token_expires_at TIMESTAMP DEFAULT NOW(),
  user_id INTEGER NOT NULL REFERENCES users(id),
  client_id VARCHAR REFERENCES oauth_clients(client_id) DEFAULT '898d7b9c43c3b45e79008ae58098a484',

  CONSTRAINT oauth_tokens_user_client_unique UNIQUE(user_id, client_id)
);

CREATE TABLE IF NOT EXISTS oauth_codes (
  id SERIAL PRIMARY KEY,
  access_code VARCHAR,
  expires_at TIMESTAMP DEFAULT NOW(),
  scope VARCHAR,
  redirect_uri VARCHAR,
  user_id INTEGER NOT NULL REFERENCES users(id),
  client_id VARCHAR REFERENCES oauth_clients(client_id) DEFAULT '898d7b9c43c3b45e79008ae58098a484',

  CONSTRAINT oauth_codes_user_client_unique UNIQUE(user_id, client_id)
);

-- Default client for front-end
INSERT INTO oauth_clients (
  client_id,
  client_secret,
  client_name,
  access_token_lifetime,
  refresh_token_lifetime
)
VALUES(
  '898d7b9c43c3b45e79008ae58098a484',
  NULL,
  'default',
  NULL,
  NULL
);

-- Allow password grant for front-end
INSERT INTO oauth_grants (grant_name, client_id) VALUES('password',
  '898d7b9c43c3b45e79008ae58098a484');
