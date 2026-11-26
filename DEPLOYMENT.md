# Production hosting and CI/CD

The invitation and RSVP API deploy together on **Vercel**. RSVP data is stored in **MongoDB Atlas**. Keeping the API on the same Vercel domain avoids a separate Render service and its free-tier idle wake-up delay.

## One-time hosting setup

1. Create a MongoDB Atlas Free (M0) cluster and a database user with `readWrite` access to the `wedding-invitation` database. Copy its connection string.
2. In Vercel, import the `ShubhamUpadhay/my-wedding-invite` repository as a Vite project. Keep the root directory as `.` and output directory as `dist`.
3. In **Vercel → Project → Settings → Environment Variables**, add `MONGODB_URI` for the Production environment. Do not prefix it with `VITE_`.
4. Deploy. Verify `https://<your-vercel-domain>/api/health` returns `{ "ok": true }`.

## Pipeline behavior

- Pull requests and pushes to `main` run `.github/workflows/ci.yml`.
- Vercel's GitHub integration deploys every push to `main` to production, after the Vercel build succeeds.
- `vercel.json` requires browsers to revalidate the page and unversioned images and audio on each visit. Vite versions the JavaScript and CSS filenames automatically; visitors do not need to clear their browser cache after a deployment.

`MONGODB_URI` belongs only in Vercel's environment settings—never in GitHub Actions or frontend variables.
