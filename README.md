# Wedding RSVP API

This project has a Vite frontend, Vercel RSVP API functions, and MongoDB RSVP storage.

## Local setup

1. Create a free MongoDB Atlas cluster and database user.
2. Copy `server/.env.example` to `server/.env`.
3. Set `MONGODB_URI` to the Atlas connection string.
4. In separate terminals, run:

   ```sh
   npm run dev:api
   npm run dev
   ```

The frontend is available at `http://localhost:8443`, and Vite forwards `/api` requests to the local API at `http://localhost:8787`.

## Deploy for the wedding

1. **MongoDB Atlas**: create a Free (M0) cluster. Add a database user with a strong password and add an Atlas Network Access entry for the deployed app.
2. **Vercel**: import this repository as a Vite project. Set the build command to `npm run build`, output directory to `dist`, and add `MONGODB_URI` as a Production environment variable.
3. Deploy and confirm `/api/health` responds with `{ "ok": true }`.

Do not store credentials in frontend variables or commit `server/.env`.
# my-wedding-invite
