# Hili Asset Manager — Deploy Guide

## Stack
- **Frontend**: `public/index.html` — vanilla JS single file, nessun bundler
- **Backend**: `server.js` — Node.js + Express
- **Database**: Turso (SQLite cloud, persistente)
- **Hosting**: Render (piano gratuito)

---

## 1. Crea il database su Turso

```bash
# Installa CLI Turso
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Crea database
turso db create hili-asset-manager

# Ottieni URL e token
turso db show hili-asset-manager --url
turso db tokens create hili-asset-manager
```

Annota i valori: `TURSO_URL` (libsql://...) e `TURSO_AUTH_TOKEN`.

---

## 2. Struttura cartelle

```
hili-asset-manager/
├── server.js
├── package.json
├── public/
│   └── index.html
└── README.md
```

---

## 3. Deploy su Render

1. Crea repository GitHub e pubblica il progetto
2. Su [render.com](https://render.com) → **New Web Service** → connetti il repo
3. Impostazioni:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node
4. Aggiungi le variabili d'ambiente:

| Variabile | Valore |
|-----------|--------|
| `TURSO_URL` | `libsql://hili-asset-manager-xxx.turso.io` |
| `TURSO_AUTH_TOKEN` | `eyJ...` |
| `ADMIN_USER` | `HiliAdmin` (o personalizzato) |
| `ADMIN_PASS` | `Asset2026` (o personalizzato) |
| `SESSION_SECRET` | stringa casuale sicura |
| `PORT` | `8080` (già default) |

5. Click **Create Web Service** → deploy automatico

---

## 4. Test locale

```bash
# Copia le env nel file .env (non committare!)
TURSO_URL=libsql://...
TURSO_AUTH_TOKEN=eyJ...
ADMIN_USER=HiliAdmin
ADMIN_PASS=Asset2026
SESSION_SECRET=qualcosa-di-segreto

# Avvia
node server.js
# oppure con dotenv
node -e "require('dotenv').config();require('./server.js')"
```

---

## Credenziali default
- **Username**: `HiliAdmin`
- **Password**: `Asset2026`

Cambiarle tramite variabili d'ambiente in produzione.
