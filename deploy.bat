@echo off
cd /d "C:\Users\willb\OneDrive - Cranfield University\Documents\Graduate Roles\Personal Landing Page"

echo Pushing changes to GitHub...

git add index.html style.css script.js robots.txt sitemap.xml closeup.jpg "grad immage.jpg" tecplotanimation.mp4 assets

git commit -m "Update site"

git push

echo.
echo Done! Changes are live.
pause
