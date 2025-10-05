#!/bin/bash

echo "🌐 Verificando configuración de red para acceso externo..."
echo ""

# Verificar IP local
echo "📍 IP Local:"
ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1
echo ""

# Verificar si el servidor está ejecutándose
echo "🖥️ Estado del servidor:"
if pgrep -f "next dev" > /dev/null; then
    echo "✅ Servidor Next.js ejecutándose"
    echo "   PID: $(pgrep -f 'next dev')"
else
    echo "❌ Servidor Next.js NO está ejecutándose"
    echo "   Ejecuta: npm run dev"
fi
echo ""

# Verificar puerto
echo "🔌 Estado del puerto 3000:"
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ Puerto 3000 abierto y escuchando"
    lsof -i :3000 | grep LISTEN
else
    echo "❌ Puerto 3000 NO está abierto"
fi
echo ""

# Verificar firewall
echo "🔥 Estado del firewall:"
firewall_state=$(sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>/dev/null | grep "Firewall is enabled")
if [ -n "$firewall_state" ]; then
    echo "⚠️  Firewall HABILITADO - Puede estar bloqueando conexiones externas"
    echo "   Solución: Deshabilitar temporalmente el firewall en Preferencias del Sistema"
else
    echo "✅ Firewall deshabilitado o no bloqueando"
fi
echo ""

# Verificar conectividad local
echo "🔗 Prueba de conectividad local:"
if curl -s -I http://10.231.220.205:3000 > /dev/null 2>&1; then
    echo "✅ Servidor responde en IP local"
else
    echo "❌ Servidor NO responde en IP local"
fi
echo ""

# Mostrar URLs de acceso
echo "📱 URLs de acceso:"
echo "   Tu computadora: http://localhost:3000"
echo "   Otros dispositivos: http://10.231.220.205:3000"
echo ""

echo "💡 Si otros dispositivos no pueden acceder:"
echo "   1. Deshabilitar firewall temporalmente"
echo "   2. Verificar que estén en la misma red WiFi"
echo "   3. Reiniciar el servidor: pkill -f 'next dev' && npm run dev"
