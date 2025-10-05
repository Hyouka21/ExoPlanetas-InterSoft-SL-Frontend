# 🚀 Deployment Guide - ExoClassifier Frontend

## Deploying to Render

### Prerequisites
- [Render account](https://render.com)
- GitHub repository with the code
- Backend API running (can be deployed separately)

### Step 1: Prepare the Repository

1. **Push to GitHub**: Make sure all your code is pushed to a GitHub repository
2. **Environment Variables**: The app uses `/api` as the default API URL (configured in `next.config.js`)

### Step 2: Deploy on Render

#### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect Repository**: Connect your GitHub repository
4. **Configure the service**:
   - **Name**: `exoclassifier-frontend`
   - **Environment**: `Node`
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (or set to the frontend folder if in monorepo)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

#### Option B: Using render.yaml (Infrastructure as Code)

1. **Use the included `render.yaml`** file
2. **Connect repository** and Render will automatically detect the configuration

### Step 3: Environment Variables

In Render dashboard, add these environment variables:

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=/api
```

**Important**: If your backend is deployed separately, update `NEXT_PUBLIC_API_URL` to point to your backend URL:
```
NEXT_PUBLIC_API_URL=https://your-backend-service.onrender.com
```

### Step 4: Backend Configuration

The frontend expects the backend to be available. You have two options:

#### Option A: Deploy Backend Separately
1. Deploy your backend API to Render or another service
2. Update `NEXT_PUBLIC_API_URL` to point to the backend URL
3. Update `next.config.js` to proxy to the backend URL

#### Option B: Use CORS (if backend is on different domain)
1. Configure your backend to allow CORS from your frontend domain
2. Update the API client to use the full backend URL

### Step 5: Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click on "Settings" → "Custom Domains"
3. Add your custom domain
4. Configure DNS as instructed by Render

### Troubleshooting

#### Build Issues
- Check that all dependencies are in `package.json`
- Ensure Node.js version compatibility
- Check build logs in Render dashboard

#### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check if backend is running and accessible
- Review network requests in browser dev tools

#### Performance Issues
- Consider upgrading to a paid plan for better performance
- Enable caching in `next.config.js`
- Optimize images and assets

### File Structure

```
exoclassifier-frontend/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── api/                # API client
│   └── lib/                # Utilities
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── render.yaml             # Render configuration
└── README_DEPLOYMENT.md    # This file
```

### Support

If you encounter issues:
1. Check Render build logs
2. Review Next.js documentation
3. Check the GitHub repository for updates

---

**Happy Deploying! 🎉**
