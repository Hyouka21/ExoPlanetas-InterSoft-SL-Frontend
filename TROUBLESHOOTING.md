# 🔧 Guía de Solución de Problemas - Acceso de Red

## ✅ **Estado Actual - FUNCIONANDO**
- ✅ **Servidor**: Ejecutándose correctamente
- ✅ **Puerto**: 3000 abierto y escuchando
- ✅ **IP Local**: `10.231.220.205`
- ✅ **Firewall**: Desactivado
- ✅ **Conectividad**: Local y red funcionando

## 📱 **URLs de Acceso**
- **Tu computadora**: `http://localhost:3000`
- **Otros dispositivos**: `http://10.231.220.205:3000`

## 🚨 **Si otros dispositivos NO pueden acceder:**

### **1. Verificar Red WiFi**
```bash
# En tu computadora, verificar IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Debe mostrar: 10.231.220.205
```

**En el dispositivo cliente:**
- ✅ Conectar a la **misma red WiFi**
- ✅ Verificar que no esté en "Modo avión"
- ✅ Verificar que WiFi esté activo

### **2. Probar Conectividad Básica**
**Desde el dispositivo cliente:**
```bash
# En terminal (si es posible)
ping 10.231.220.205

# O abrir navegador y probar:
http://10.231.220.205:3000
```

### **3. Verificar Firewall del Dispositivo Cliente**
**iPhone/iPad:**
- Configuración → WiFi → (i) junto a la red → Configurar DNS
- Asegurarse de que no hay restricciones

**Android:**
- Configuración → WiFi → Red actual → Avanzado
- Verificar que no hay proxy o restricciones

**Windows:**
- Windows Defender → Firewall y protección de red
- Verificar que no esté bloqueando conexiones

### **4. Probar Diferentes Navegadores**
- ✅ **Chrome**: `http://10.231.220.205:3000`
- ✅ **Safari**: `http://10.231.220.205:3000`
- ✅ **Firefox**: `http://10.231.220.205:3000`
- ✅ **Edge**: `http://10.231.220.205:3000`

### **5. Verificar Puerto y Protocolo**
- ✅ **Protocolo**: HTTP (no HTTPS)
- ✅ **Puerto**: 3000
- ✅ **Sin barras finales**: `http://10.231.220.205:3000`

## 🔄 **Comandos de Diagnóstico**

### **En tu computadora (servidor):**
```bash
# Verificar servidor
./scripts/check-network.sh

# Reiniciar servidor
./scripts/start-network.sh

# Verificar puerto
lsof -i :3000
```

### **En dispositivo cliente:**
```bash
# Probar conectividad (si tiene terminal)
ping 10.231.220.205
telnet 10.231.220.205 3000
```

## 🎯 **Soluciones Alternativas**

### **Opción 1: Usar Puerto Diferente**
```bash
# Detener servidor actual
pkill -f "next dev"

# Iniciar en puerto 8080
PORT=8080 npm run dev:local
```
Luego acceder desde: `http://10.231.220.205:8080`

### **Opción 2: Usar ngrok (Túnel público)**
```bash
# Instalar ngrok
npm install -g ngrok

# Crear túnel
ngrok http 3000
```
Esto creará una URL pública que funciona desde cualquier lugar.

### **Opción 3: Usar IP diferente**
```bash
# Verificar todas las IPs disponibles
ifconfig | grep "inet "

# Probar con otra IP si está disponible
```

## 📋 **Checklist de Verificación**

### **En el servidor (tu computadora):**
- [ ] Servidor ejecutándose: `ps aux | grep "next dev"`
- [ ] Puerto abierto: `lsof -i :3000`
- [ ] Firewall desactivado
- [ ] IP correcta: `10.231.220.205`

### **En el dispositivo cliente:**
- [ ] Misma red WiFi
- [ ] WiFi activo (no datos móviles)
- [ ] Navegador actualizado
- [ ] Sin proxy configurado
- [ ] URL correcta: `http://10.231.220.205:3000`

## 🆘 **Si nada funciona:**

1. **Reiniciar todo:**
   ```bash
   pkill -f "next dev"
   sleep 5
   ./scripts/start-network.sh
   ```

2. **Probar desde otro dispositivo** en la misma red

3. **Verificar que el backend esté funcionando:**
   ```bash
   curl http://localhost:8000/model/info
   ```

4. **Contactar soporte** con:
   - IP local: `10.231.220.205`
   - Puerto: `3000`
   - Sistema operativo: macOS
   - Navegador usado: [especificar]

---

**¡El servidor está funcionando correctamente! Si hay problemas, sigue esta guía paso a paso.** 🚀
