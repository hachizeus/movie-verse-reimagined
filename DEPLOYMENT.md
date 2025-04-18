
# Deploying to GitHub Pages

Since this project has package.json as a read-only file, we need to use manual methods to deploy to GitHub Pages.

## Prerequisites

1. Make sure you have Git installed and configured
2. You need access to push to the repository

## Deployment Steps

### Option 1: Using gh-pages CLI tool (recommended)

1. Install gh-pages globally:
   ```
   npm install -g gh-pages
   ```

2. Build your project:
   ```
   npm run build
   ```

3. Deploy the dist folder to GitHub Pages:
   ```
   gh-pages -d dist
   ```

### Option 2: Manual Git deployment

1. Build your project:
   ```
   npm run build
   ```

2. Create a .nojekyll file (to bypass Jekyll processing):
   ```
   touch dist/.nojekyll
   ```

3. Add the dist folder to git (force if it's in .gitignore):
   ```
   git add dist -f
   ```

4. Commit the changes:
   ```
   git commit -m "Deploy to GitHub Pages"
   ```

5. Push the dist folder to the gh-pages branch:
   ```
   git subtree push --prefix dist origin gh-pages
   ```

## Important Configuration Notes

1. In `vite.config.ts`, replace `/your-repo-name/` with your actual repository name.
   For example, if your repo is `github.com/username/movie-app`, use `/movie-app/`

2. After deployment, your site will be available at:
   `https://yourusername.github.io/your-repo-name/`

3. If you encounter 404 errors for routes, make sure your GitHub Pages settings are correct:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Ensure the source is set to "gh-pages" branch
