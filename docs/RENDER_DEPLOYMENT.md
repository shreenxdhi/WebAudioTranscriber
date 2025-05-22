# WebAudioTranscriber - Render Deployment Guide

This guide will walk you through deploying the WebAudioTranscriber application to [Render](https://render.com/).

## Prerequisites

1. A [Render](https://render.com/) account
2. A [GitHub](https://github.com/), [GitLab](https://gitlab.com/), or [Bitbucket](https://bitbucket.org/) account with the repository
3. [Git](https://git-scm.com/) installed locally
4. [Node.js](https://nodejs.org/) (v18 or later) and [npm](https://www.npmjs.com/) installed locally

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Create a New Web Service on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click the "New +" button and select "Web Service"
3. Connect your Git provider if you haven't already
4. Select your repository

### 3. Configure the Web Service

Use the following settings:

- **Name**: `webaudio-transcriber` (or your preferred name)
- **Region**: Choose the region closest to your users
- **Branch**: `main` (or your preferred branch)
- **Runtime**: Node
- **Build Command**: `npm run render-build`
- **Start Command**: `npm run render-start`
- **Plan**: Free (or choose a paid plan for better performance)

### 4. Set Up Environment Variables

Add the following environment variables in the Render dashboard under the "Environment" section:

```
NODE_ENV=production
PORT=10000
WHISPER_MODEL=base
DEVICE=cpu
SESSION_SECRET=your-secret-key-here
COOKIE_SECURE=true
LOG_LEVEL=info
MAX_FILE_SIZE=52428800
```

### 5. Advanced Settings

- **Auto-Deploy**: Enable to automatically deploy when you push to the specified branch
- **Build Cache**: Enable for faster builds
- **Health Check Path**: `/health`

### 6. Deploy the Application

1. Click "Create Web Service" to start the deployment
2. Monitor the build and deployment logs in the Render dashboard
3. Once deployed, your app will be available at `https://your-app-name.onrender.com`

## Post-Deployment

### Setting Up a Custom Domain (Optional)

1. Go to your web service in the Render dashboard
2. Click on "Settings" > "Custom Domains"
3. Follow the instructions to add and verify your domain

### Enabling HTTPS

HTTPS is automatically enabled by Render with a free Let's Encrypt SSL certificate.

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check the build logs in the Render dashboard
   - Ensure all dependencies are correctly listed in `package.json`
   - Verify the Node.js version compatibility

2. **Application Not Starting**:
   - Check the application logs in the Render dashboard
   - Ensure the `PORT` environment variable is set to `10000`
   - Verify all required environment variables are set

3. **File Upload Issues**:
   - Check the `MAX_FILE_SIZE` environment variable
   - Ensure the `uploads` directory has the correct permissions

## Updating Your Application

To update your application:

1. Push your changes to the connected Git repository
2. Render will automatically detect the changes and trigger a new deployment
3. Monitor the deployment status in the Render dashboard

## Database Setup (Optional)

If your application requires a database:

1. In the Render dashboard, click "New +" and select "PostgreSQL"
2. Configure the database with a name and credentials
3. Add the connection string to your web service's environment variables as `DATABASE_URL`

## Support

For additional help, refer to:
- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/node-version)
- [Environment Variables on Render](https://render.com/docs/environment-variables)

---

Happy transcribing! 🎤✨
