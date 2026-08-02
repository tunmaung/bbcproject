# BBC Yangon News — Deployment Guide

This guide covers self-hosting the BBC Yangon News application on **Render** and **Railway**, two popular serverless platforms.

## Prerequisites

- Git repository with the application code
- Docker installed (for local testing)
- Account on Render or Railway
- MySQL/TiDB database (provided by the platform or external service)

---

## Local Development with Docker

### Build and Run Locally

```bash
# Build the Docker image
docker build -t bbc-yangon-news .

# Run with docker-compose (includes MySQL)
docker-compose up -d

# Access the app at http://localhost:3000
```

### Database Setup

The `docker-compose.yml` automatically:
- Creates a MySQL container
- Initializes the `bbc_yangon` database
- Sets up credentials for the app

To manually run migrations:
```bash
docker exec bbc-yangon-app pnpm drizzle-kit migrate
```

---

## Deployment on Render

### Step 1: Connect Your Repository

1. Go to [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Select the branch to deploy (e.g., `main`)

### Step 2: Configure the Service

**Build Command:**
```bash
pnpm install && pnpm run build
```

**Start Command:**
```bash
node dist/index.js
```

**Environment Variables:**
Add the following in the Render dashboard under **Environment**:

```
DATABASE_URL=mysql://user:password@your-database-host:3306/bbc_yangon
NODE_ENV=production
JWT_SECRET=your-secure-random-secret-key
VITE_APP_ID=your-manus-app-id
VITE_APP_TITLE=BBC Yangon News
VITE_APP_LOGO=https://your-cdn.com/logo.png
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-api-key
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-analytics-id
```

### Step 3: Add MySQL Database

**Option A: Use Render's MySQL (Recommended)**
1. In Render dashboard, click **New +** → **MySQL**
2. Configure the database (name, region, plan)
3. Copy the connection string to `DATABASE_URL`

**Option B: Use External Database (e.g., PlanetScale, AWS RDS)**
1. Create a MySQL database on your provider
2. Get the connection string
3. Add it to `DATABASE_URL` environment variable

### Step 4: Deploy

1. Click **Create Web Service**
2. Render automatically deploys on every push to your branch
3. Monitor deployment logs in the Render dashboard
4. Once deployed, your app is live at `https://your-service-name.onrender.com`

### Step 5: Run Migrations

After first deployment:
1. Go to the Web Service dashboard
2. Click **Shell** to access the production environment
3. Run:
   ```bash
   pnpm drizzle-kit migrate
   ```

---

## Deployment on Railway

### Step 1: Connect Your Repository

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your repository and branch

### Step 2: Add MySQL Service

1. In your Railway project, click **Add Service** → **MySQL**
2. Railway automatically creates a MySQL database
3. The connection string is available as `DATABASE_URL` environment variable

### Step 3: Configure Environment Variables

In the Railway dashboard, go to your Web Service and add:

```
NODE_ENV=production
JWT_SECRET=your-secure-random-secret-key
VITE_APP_ID=your-manus-app-id
VITE_APP_TITLE=BBC Yangon News
VITE_APP_LOGO=https://your-cdn.com/logo.png
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-api-key
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-analytics-id
```

**Note:** Railway automatically links the MySQL service, so `DATABASE_URL` is pre-configured.

### Step 4: Configure Build and Start Commands

In the Railway dashboard, set:

**Build Command:**
```bash
pnpm install && pnpm run build
```

**Start Command:**
```bash
node dist/index.js
```

**Port:** `3000` (Railway auto-detects this)

### Step 5: Deploy

1. Click **Deploy**
2. Railway automatically deploys on every push to your branch
3. Monitor logs in the Railway dashboard
4. Your app is live at the provided Railway URL

### Step 6: Run Migrations

After first deployment:
1. In the Railway dashboard, click your Web Service
2. Go to the **Logs** tab to verify deployment
3. Click **Connect** to access the production shell
4. Run:
   ```bash
   pnpm drizzle-kit migrate
   ```

---

## Database Setup for Both Platforms

### Initial Migration

After deploying, connect to your production database and run:

```bash
# Via shell/terminal access on Render or Railway
pnpm drizzle-kit migrate
```

This creates all required tables (users, articles).

### Seed Sample Data (Optional)

To populate the database with sample articles, create a seed script:

```bash
# server/seed.ts
import { getDb } from './db';
import { articles } from '../drizzle/schema';

const sampleArticles = [
  {
    title: "Breaking: New Tech Startup Launches in Yangon",
    category: "Business",
    coverImageUrl: "https://example.com/image1.jpg",
    content: "A new technology startup has launched...",
    author: "John Doe",
    isFeatured: true,
    isBreaking: true,
    publishedAt: new Date(),
  },
  // Add more articles...
];

async function seed() {
  const db = await getDb();
  if (db) {
    await db.insert(articles).values(sampleArticles);
    console.log("Seed completed!");
  }
}

seed();
```

Run with:
```bash
npx tsx server/seed.ts
```

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host:3306/db` |
| `NODE_ENV` | Environment mode | `production` |
| `JWT_SECRET` | Session signing key | `your-random-secret-key` |
| `VITE_APP_ID` | Manus OAuth app ID | `app-id-from-manus` |
| `VITE_APP_TITLE` | Website title | `BBC Yangon News` |
| `OAUTH_SERVER_URL` | Manus OAuth server | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal | `https://portal.manus.im` |
| `OWNER_OPEN_ID` | Admin user ID | `owner-id-from-oauth` |
| `BUILT_IN_FORGE_API_KEY` | Manus API key (server) | `your-forge-key` |
| `VITE_FRONTEND_FORGE_API_KEY` | Manus API key (client) | `your-frontend-key` |

---

## Monitoring and Logs

### Render
- Logs available in the Web Service dashboard under **Logs**
- Real-time streaming of application output
- Historical logs available for debugging

### Railway
- Logs available in the service dashboard under **Logs**
- Filter by service, deployment, or time range
- Integration with external monitoring tools

---

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database firewall allows your platform's IP
- Ensure MySQL version is compatible (8.0+)

### Build Failures
- Check logs for missing dependencies
- Verify `package.json` and `pnpm-lock.yaml` are committed
- Ensure Node version matches (v20+ recommended)

### Runtime Errors
- Check environment variables are set correctly
- Verify migrations have run: `pnpm drizzle-kit migrate`
- Review application logs for specific errors

### Geolocation Gate Not Working
- Ensure HTTPS is enabled (both platforms provide HTTPS by default)
- Check browser console for permission prompts
- Verify geolocation is not blocked by browser settings

---

## Custom Domain Setup

### Render
1. Go to Web Service settings → **Custom Domain**
2. Add your domain (e.g., `news.example.com`)
3. Update DNS records as instructed
4. SSL certificate auto-provisioned

### Railway
1. Go to service settings → **Domain**
2. Add custom domain
3. Update DNS records (CNAME)
4. SSL certificate auto-provisioned

---

## Performance Optimization

### Caching
- Enable browser caching for static assets
- Use CDN for images and media files

### Database
- Add indexes on frequently queried columns
- Monitor query performance in production

### Build Size
- Tree-shake unused dependencies
- Minify client-side code (automatic with Vite)

---

## Security Best Practices

1. **Never commit secrets** — use environment variables
2. **Rotate JWT_SECRET** periodically
3. **Use HTTPS** — both platforms provide this by default
4. **Enable CORS** only for trusted origins
5. **Validate all user inputs** — especially in admin forms
6. **Monitor access logs** for suspicious activity

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Railway Docs:** https://docs.railway.app
- **Drizzle ORM:** https://orm.drizzle.team
- **tRPC:** https://trpc.io

---

## Next Steps

1. Deploy to Render or Railway
2. Run database migrations
3. Test geolocation gate functionality
4. Verify admin dashboard access
5. Monitor logs for errors
6. Set up custom domain
7. Enable monitoring and alerts

Good luck with your deployment!
