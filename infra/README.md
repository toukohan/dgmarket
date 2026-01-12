## JWT Signing Keys (Production)

The API uses asymmetric JWT signing for access and refresh tokens.

Private keys are used to sign tokens.
Public keys are used to verify tokens.

Keys are long-lived infrastructure state and must persist across container rebuilds.
They must never be committed to git.

### Key location

JWT keys are stored outside the application images and mounted into the API container.

Expected directory:

infra/keys/
  jwt-access-private.pem
  jwt-access-public.pem
  jwt-refresh-private.pem
  jwt-refresh-public.pem

### Generating keys

Generate keys once on a secure machine (local or VPS).

```bash
mkdir -p infra/keys
cd infra/keys

openssl genrsa -out jwt-access-private.pem 4096
openssl rsa -in jwt-access-private.pem -pubout -out jwt-access-public.pem

openssl genrsa -out jwt-refresh-private.pem 4096
openssl rsa -in jwt-refresh-private.pem -pubout -out jwt-refresh-public.pem
```

### Git safety

JWT private keys must never be committed.

Ensure the following is in `.gitignore`:

`infra/keys/*.pem`