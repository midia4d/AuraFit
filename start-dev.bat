@echo off
title AuraFit Dev Server
color 0A
echo.
echo  ██████████████████████████████████████████
echo  █                                        █
echo  █        AURAFIT - DEV SERVER            █
echo  █        http://localhost:3000           █
echo  █                                        █
echo  ██████████████████████████████████████████
echo.
echo  ✓ Supabase: kwkfvarmzjjpcjtxyudd.supabase.co
echo  ✓ Ambiente: .env.local carregado
echo.
echo  Abrindo o browser em 3 segundos...
echo  (Pressione Ctrl+C para parar o servidor)
echo.

cd /d "%~dp0"
timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"
node "node_modules/next/dist/bin/next" dev --port 3000
