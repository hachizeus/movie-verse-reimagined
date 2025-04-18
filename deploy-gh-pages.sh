
#!/bin/bash
# Script to deploy to GitHub Pages without modifying package.json

# Build the project
echo "Building project..."
npm run build

# Create .nojekyll file to bypass Jekyll processing
touch dist/.nojekyll

# Deploy to GitHub Pages manually
echo "To deploy to GitHub Pages:"
echo "1. Install gh-pages globally: npm install -g gh-pages"
echo "2. Run: gh-pages -d dist"
echo ""
echo "Alternatively, you can push the dist folder to the gh-pages branch:"
echo "git add dist -f"
echo "git commit -m 'Deploy to GitHub Pages'"
echo "git subtree push --prefix dist origin gh-pages"

echo "Done! Your app will be available at: https://yourusername.github.io/your-repo-name/"
