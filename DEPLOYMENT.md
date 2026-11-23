# Production hosting and CI/CD

The deployment setup uses **Vercel** for the static invitation, **Render** for the Express API, and **MongoDB Atlas** for RSVP data.

## One-time hosting setup

1. Create a MongoDB Atlas Free (M0) cluster and database user. Copy its connection string.
2. Create a Render Web Service from this repository (or use the `render.yaml` Blueprint). Set these Render environment variables:
   - `MONGODB_URI`: your Atlas connection string
   - `CORS_ORIGIN`: the final Vercel URL, for example `https://our-forever.vercel.app`
3. Create a Vercel project from this repository. Add the production environment variable:
   - `VITE_API_URL`: `https://<your-render-service>.onrender.com/api`
4. Confirm the deployed API at `https://<your-render-service>.onrender.com/api/health`.

## GitHub Actions secrets

In GitHub: **Repository → Settings → Secrets and variables → Actions**, add:

| Secret | Value |
| --- | --- |
| `VERCEL_TOKEN` | Vercel account token |
| `VERCEL_ORG_ID` | Vercel team or personal account ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `VITE_API_URL` | `https://<your-render-service>.onrender.com/api` |
| `RENDER_DEPLOY_HOOK` | Render deploy-hook URL for the API service |

`MONGODB_URI` belongs only in Render's environment settings—never in GitHub Actions or frontend variables.

## Pipeline behavior

- Pull requests and pushes to `main` run `.github/workflows/ci.yml`.
- A successful push to `main` deploys the frontend to Vercel and triggers a Render deployment for the RSVP API through `.github/workflows/deploy.yml`.
