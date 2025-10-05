#!/bin/bash

echo "🚀 Iniciando servidor para acceso de red..."

# Detener cualquier proceso anterior
pkill -f "next dev" 2>/dev/null
sleep 2

# Obtener IP local
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
echo "📍 IP Local: $LOCAL_IP"

# Iniciar servidor con configuración explícita
echo "🖥️ Iniciando servidor en puerto 3000..."
HOSTNAME=0.0.0.0 PORT=3000 npm run dev:local &

# Esperar a que el servidor inicie
sleep 5

# Verificar que esté funcionando
echo "🔍 Verificando servidor..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Servidor funcionando en localhost"
else
    echo "❌ Error en localhost"
fi

if curl -s http://$LOCAL_IP:3000 > /dev/null; then
    echo "✅ Servidor funcionando en IP de red: $LOCAL_IP"
else
    echo "❌ Error en IP de red: $LOCAL_IP"
fi

echo ""
echo "📱 URLs de acceso:"
echo "   Local: http://localhost:3000"
echo "   Red:   http://$LOCAL_IP:3000"
echo ""
echo "💡 Si otros dispositivos no pueden acceder:"
echo "   1. Verificar que estén en la misma red WiFi"
echo "   2. Probar desde otro dispositivo: http://$LOCAL_IP:3000"
echo "   3. Verificar firewall del dispositivo cliente"
