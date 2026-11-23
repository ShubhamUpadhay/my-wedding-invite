# Wedding RSVP API

This project has a Vite frontend and an Express API that stores RSVP submissions in MongoDB.

## Local setup

1. Create a free MongoDB Atlas cluster and database user.
2. Copy `server/.env.example` to `server/.env`.
3. Set `MONGODB_URI` to the Atlas connection string and retain `CORS_ORIGIN=http://localhost:8443`.
4. In separate terminals, run:

   ```sh
   npm run dev:api
   npm run dev
   ```

The frontend is available at `http://localhost:8443`, and Vite forwards `/api` requests to the API at `http://localhost:8787`.

## Deploy for the wedding

1. **MongoDB Atlas**: create a Free (M0) cluster. Add a database user with a strong password and add the Render service IP range in Network Access (or temporarily allow `0.0.0.0/0` with a strong database password).
2. **Render API**: create a new Blueprint from this repository; Render reads `render.yaml`. Set:
   - `MONGODB_URI`: the Atlas connection string
   - `CORS_ORIGIN`: your deployed frontend URL, for example `https://your-invitation.vercel.app`
3. **Vercel frontend**: import the same repository as a Vite project. Set the build command to `npm run build`, output directory to `dist`, and add:
   - `VITE_API_URL=https://your-render-api.onrender.com/api`
4. Redeploy the frontend after adding `VITE_API_URL`.

Do not store credentials in frontend variables or commit `server/.env`.
# my-wedding-invite
