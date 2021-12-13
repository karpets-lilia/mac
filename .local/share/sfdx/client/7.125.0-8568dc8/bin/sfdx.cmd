@echo off
setlocal enableextensions

if not "%SFDX_REDIRECTED%"=="1" if exist "%LOCALAPPDATA%\sfdx\client\bin\sfdx.cmd" (
  set SFDX_REDIRECTED=1
  "%LOCALAPPDATA%\sfdx\client\bin\sfdx.cmd" %*
  goto:EOF
)

if not defined SFDX_BINPATH set SFDX_BINPATH="%~dp0sfdx.cmd"
if exist "%~dp0..\bin\node.exe" (
  "%~dp0..\bin\node.exe" "%~dp0..\bin\run" %*
) else if exist "%LOCALAPPDATA%\oclif\node\node-16.13.0.exe" (
  "%LOCALAPPDATA%\oclif\node\node-16.13.0.exe" "%~dp0..\bin\run" %*
) else (
  node "%~dp0..\bin\run" %*
)
