# Deployment Guide

## GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

### Setup Steps

1. **Repository Settings**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "GitHub Actions"

2. **Environment Variables**
   Add these secrets in your repository settings under "Secrets and variables" > "Actions":
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_EMAILJS_PRIVATE_KEY=your_private_key
   ```

3. **Domain Configuration**
   - If using a custom domain, add a `CNAME` file to the `public` folder
   - Update the `base` path in `vite.config.ts` if needed

### Troubleshooting

#### Common Issues

1. **React Context Error**
   - This usually indicates a bundling issue
   - Check that React dependencies are properly resolved
   - Clear node_modules and reinstall if needed

2. **404 Errors for Assets**
   - Check the `base` path in `vite.config.ts`
   - Ensure assets are in the `public` folder or imported correctly

3. **Build Failures**
   - Check the GitHub Actions logs
   - Run `npm run build` locally to test
   - Use `npm run deploy:debug` to check build output

#### Debug Commands

```bash
# Check build locally
npm run build

# Debug deployment
npm run deploy:debug

# Preview build
npm run preview
```

### Manual Deployment

If automatic deployment fails, you can deploy manually:

```bash
# Build the project
npm run build

# Deploy to gh-pages branch (if using gh-pages package)
npm run deploy
```

### Performance Optimization

The build is optimized for production with:
- Code splitting
- Asset optimization
- CSS minification
- Tree shaking
- Gzip compression

### Monitoring

Check deployment status:
- GitHub Actions tab for build logs
- GitHub Pages settings for deployment status
- Browser developer tools for runtime errors