# OPERATIONS.md

This document describes **how to operate the dgmarket project in production**.
It is intentionally short, explicit, and boring.
If something breaks at 02:00, this is the file you read.

---

## 1. Initial VPS Setup (one-time)

### 1.1 Log in to the VPS

```bash
ssh deploy@<VPS_IP>
```

Use a non-root user with sudo rights.

---

### 1.2 Install required system packages

```bash
sudo apt update
sudo apt install -y \
  ca-certificates \
  curl \
  git \
  gnupg \
  lsb-release
```

---

### 1.3 Install Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Log out and back in so group changes apply.

Verify:

```bash
docker --version
docker compose version
```

---

## 2. Clone the Repository (one-time)

Choose a stable location for the project.
Recommended:

```bash
sudo mkdir -p /opt/dgmarket
sudo chown $USER:$USER /opt/dgmarket
cd /opt/dgmarket
```

Clone:

```bash
git clone <GITHUB_REPO_URL> .
```

The repository is now the **source of truth** for application code.

---

## 3. Production Secrets & Infrastructure State

### 3.1 Environment file

Create the production env file:

```bash
cp .env.example .env.prod
nano .env.prod
```

This file is **never committed**.

---

### 3.2 JWT signing keys (required)

JWT keys are long-lived infrastructure state.
They must exist **outside containers**.

```bash
mkdir -p infra/keys
cd infra/keys

openssl genrsa -out jwt-access-private.pem 4096
openssl rsa -in jwt-access-private.pem -pubout -out jwt-access-public.pem

openssl genrsa -out jwt-refresh-private.pem 4096
openssl rsa -in jwt-refresh-private.pem -pubout -out jwt-refresh-public.pem
```

Lock permissions:

```bash
chmod 700 infra/keys
chmod 600 infra/keys/*-private.pem
chmod 644 infra/keys/*-public.pem
```

Backup these keys securely.

---

## 4. First Production Deploy

From the project root:

```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

Verify:

```bash
docker compose ps
docker compose logs -f api
```

All services should be running.

---

## 5. Normal Deploy Procedure (code updates)

This is the **standard deploy flow**.

```bash
git pull
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

Notes:

* Containers are recreated
* Volumes persist
* JWT keys persist
* Database persists

---

## 6. Logs

Follow logs:

```bash
docker compose logs -f proxy
docker compose logs -f api
docker compose logs -f web
```

Single service:

```bash
docker compose logs api
```

---

## 7. Restarting Services

Restart everything:

```bash
docker compose restart
```

Restart one service:

```bash
docker compose restart api
```

---

## 8. Backups (minimum viable)

### 8.1 Database backup

```bash
docker exec dgmarket_db pg_dump -U $POSTGRES_USER $POSTGRES_DB > db-backup.sql
```

Store backups **off the VPS**.

---

### 8.2 Critical files to back up

* `infra/keys/`
* `infra/nginx/certbot/conf/`
* database dumps

---

## 9. Health Checks

API health endpoint:

```bash
curl http://localhost:4000/api/health
```

External uptime monitoring is recommended.

---

## 10. What NOT to do

* Do not commit `.env.prod`
* Do not commit `infra/keys/*`
* Do not regenerate JWT keys casually
* Do not edit containers manually

All changes go through git + deploy.

---

## 11. If Something Is Broken

1. Check `docker compose ps`
2. Check logs for the failing service
3. Restart the service
4. Roll back with `git checkout <previous_commit>`
5. Rebuild and redeploy

---

## 12. Philosophy

* Simple beats clever
* Reproducible beats manual fixes
* Infrastructure state is explicit
* Containers are disposable

This file exists so future-you does not suffer.
