@echo off
setlocal EnableExtensions

cd /d "%~dp0"

if not exist ".git" (
    echo [ERROR] This script must live in the root of a Git repository.
    pause
    exit /b 1
)

for /f "delims=" %%i in ('git branch --show-current 2^>nul') do set "BRANCH=%%i"
if not defined BRANCH set "BRANCH=main"

set "REMOTE=origin"
set "DEFAULT_MESSAGE=Update site"

echo.
echo Repo: %cd%
echo Remote: %REMOTE%
echo Branch: %BRANCH%
echo.
set /p COMMIT_MESSAGE=Commit message ^(leave blank for "%DEFAULT_MESSAGE%"^): 
if "%COMMIT_MESSAGE%"=="" set "COMMIT_MESSAGE=%DEFAULT_MESSAGE%"

echo.
echo [1/4] Staging changes...
git add -A
if errorlevel 1 goto :fail

git diff --cached --quiet
if errorlevel 1 (
    echo [2/4] Creating commit...
    git commit -m "%COMMIT_MESSAGE%"
    if errorlevel 1 goto :fail
) else (
    echo [2/4] No staged changes to commit.
)

echo [3/4] Syncing with GitHub...
git pull --rebase %REMOTE% %BRANCH%
if errorlevel 1 goto :fail

echo [4/4] Pushing to GitHub...
git push %REMOTE% %BRANCH%
if errorlevel 1 goto :fail

echo.
echo [SUCCESS] GitHub update complete.
pause
exit /b 0

:fail
echo.
echo [ERROR] Git reported a problem. Review the message above.
pause
exit /b 1
