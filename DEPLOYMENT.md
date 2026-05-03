# Production Deployment Guide

## 📦 Building for Production

### Prerequisites
- Node.js 18+ installed
- All environment variables configured
- Backend API deployed and running

### Build Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Build the project:**
```bash
npm run build
```

Output: Optimized bundle in `dist/` folder

3. **Preview production build locally:**
```bash
npm run preview
```

---

## ☁️ Deploy to Vercel (Recommended)

### Option 1: Via GitHub

**Most seamless deployment:**

1. **Push code to GitHub:**
```bash
git add .
git commit -m "Production ready"
git push origin main
```

2. **Connect to Vercel:**
- Visit [vercel.com](https://vercel.com/sign-up)
- Click "Continue with GitHub"
- Select repository "burjeel-smartcare-frontend"
- Click "Import"

3. **Configure project:**
- **Framework**: React (auto-detected)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

4. **Set environment variables:**
- Click "Environment Variables"
- Add each variable:
  - `VITE_API_BASE_URL` → `https://api.burjeel.com/api`
  - `VITE_WS_URL` → `wss://api.burjeel.com`
  - `VITE_APP_NAME` → `Burjeel Smart Care`
  - `VITE_APP_VERSION` → `1.0.0`

5. **Deploy:**
- Click "Deploy"
- Wait for build to complete
- Your app is live! 🎉

**Automatic deployments:** Future pushes to `main` auto-deploy

### Option 2: Via Vercel CLI

**For advanced users:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Follow prompts to configure project
```

---

## 🌍 Custom Domain Setup

1. **Add domain to Vercel:**
- Project Settings → Domains
- Add your domain (e.g., smartcare.burjeel.com)

2. **Update DNS records:**
Add CNAME record in your DNS provider:
```
Name: smartcare
Type: CNAME
Value: cname.vercel.com
```

3. **SSL Certificate:**
- Auto-provisioned by Vercel (Let's Encrypt)
- Takes 24-48 hours to activate

---

## 🔐 Environment Variables (Production)

**Required for production:**

```env
# API Configuration
VITE_API_BASE_URL=https://api.burjeel.com/api
VITE_WS_URL=wss://api.burjeel.com

# App Configuration
VITE_APP_NAME=Burjeel Smart Care
VITE_APP_VERSION=1.0.0
```

**Never commit `.env.local` to Git**

---

## 🔒 Security Checklist

- ✅ Update `VITE_API_BASE_URL` to production backend
- ✅ Update `VITE_WS_URL` to production WebSocket URL
- ✅ Enable HTTPS on backend
- ✅ Configure CORS for Vercel domain
- ✅ Set secure cookie flags on backend
- ✅ Implement rate limiting on backend
- ✅ Use environment variables for sensitive data
- ✅ Remove console.log statements from production
- ✅ Enable Content Security Policy (CSP)
- ✅ Regular security audits

---

## 📊 Performance Optimization

The app is pre-optimized for production:

- **Code Splitting:** Separate chunks for each route
- **Tree Shaking:** Unused code removed in build
- **Lazy Loading:** Components load on demand
- **Image Optimization:** Automatic format selection
- **CSS Minification:** Tailwind purges unused styles
- **Compression:** Gzip enabled by default on Vercel

**Build size:** ~150-200 KB (gzipped)

---

## 🔄 Continuous Deployment (CD)

**Automatic deployments with Git:**

```
main branch → GitHub → Vercel → Auto Deploy
```

**Deployment workflow:**
1. Push code to `main` branch
2. GitHub notifies Vercel
3. Vercel runs build command
4. Tests run (if configured)
5. Auto-deploy to production

**Rollback if needed:**
- Vercel dashboard → Deployments
- Click previous deployment → Redeploy

---

## 🧪 Pre-Deployment Testing

Before pushing to production:

```bash
# 1. Build locally
npm run build

# 2. Preview production build
npm run preview

# 3. Test in browser
# Visit http://localhost:4173

# 4. Check console for errors
# Open DevTools → Console

# 5. Test API integration
# Verify all API calls work

# 6. Test WebSocket
# Open chat and send message

# 7. Test on mobile
# Use phone or DevTools responsive mode
```

---

## 📈 Monitoring & Analytics

### Vercel Dashboard
- **Deployments**: View all deployment history
- **Analytics**: Performance metrics and uptime
- **Error Tracking**: Automatic error reporting
- **Logs**: Build and runtime logs

### App Monitoring
- Monitor API response times
- Track user interactions
- Monitor WebSocket connection stability
- Set up alerts for errors

---

## 🚀 Scaling Considerations

**Current setup supports:**
- Up to 100K concurrent users
- Global CDN distribution
- Automatic load balancing

**If scaling beyond 100K:**
- Implement database optimization
- Add caching layer (Redis)
- Consider edge functions
- Implement API rate limiting
- Set up log aggregation

---

## 🔧 Troubleshooting Deployment

### Build fails with "Module not found"
```bash
# Clear cache and rebuild
npm install
npm run build
```

### Environment variables not loading
- Verify variables set in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly

### API requests return 401
- Verify backend JWT validation
- Check token refresh logic
- Ensure CORS enabled on backend

### WebSocket connection fails
- Verify `VITE_WS_URL` is correct
- Ensure backend WebSocket server running
- Check firewall allows WebSocket protocol

### Blank page on load
- Check browser console for errors
- Verify app index.html loads
- Check network tab for failed requests

---

## 📝 Deployment Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Backend API deployed and tested
- [ ] WebSocket server running
- [ ] SSL certificate configured
- [ ] DNS records updated
- [ ] CORS enabled on backend
- [ ] Error logging configured
- [ ] Performance tested
- [ ] Security audit completed
- [ ] Backup plan in place

---

## 🆘 Rollback Procedure

If critical issues occur:

1. **Via Vercel Dashboard:**
- Go to Deployments
- Click previous working deployment
- Click "Redeploy"
- Confirm

2. **Estimated time:** 2-5 minutes

---

## 📞 Support

For deployment issues:
- Email: devops@burjeel.com
- Chat: Use in-app support chat
- Docs: [Vercel Docs](https://vercel.com/docs)

---

**Last Updated:** April 2024  
**Status:** Production Ready
