@echo off
setlocal
cd /d "%~dp0"
if exist "%~dp0.tools\node-v24.19.0-win-x64\node.exe" (
  set "PATH=%~dp0.tools\node-v24.19.0-win-x64;%PATH%"
)
if not exist "node_modules\" (
  echo Installing dependencies...
  call npm.cmd install
)
call npm.cmd run dev
