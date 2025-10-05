# 🌐 Acceso desde la Red Local

## 📱 Cómo acceder al frontend desde otros dispositivos

### 🖥️ **Desde tu computadora (servidor)**
El frontend está ejecutándose en:
- **Local**: `http://localhost:3000`
- **Red local**: `http://10.75.36.106:3000`

### 📱 **Desde otros dispositivos en la misma red**

#### **Opción 1: Usar la IP local**
```
http://10.75.36.106:3000
```

#### **Opción 2: Usar el nombre del host (si está configurado)**
```
http://[nombre-de-tu-computadora].local:3000
```

### 🔧 **Comandos disponibles**

#### **Para desarrollo con acceso de red:**
```bash
npm run dev
```
- ✅ Accesible desde otros dispositivos
- ✅ Escucha en `0.0.0.0:3000`

#### **Para desarrollo solo local:**
```bash
npm run dev:local
```
- ✅ Solo accesible desde localhost
- ✅ Escucha en `127.0.0.1:3000`

### 📋 **Requisitos**

1. **Misma red WiFi**: Todos los dispositivos deben estar conectados a la misma red
2. **Firewall**: Asegúrate de que el puerto 3000 esté abierto
3. **Backend funcionando**: El backend debe estar ejecutándose en `http://localhost:8000`

### 🚨 **Solución de problemas**

#### **Si no puedes acceder desde otros dispositivos:**

1. **Verificar la IP:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **Verificar que el servidor esté escuchando en todas las interfaces:**
   ```bash
   netstat -an | grep 3000
   ```

3. **Verificar el firewall (macOS):**
   ```bash
   sudo pfctl -sr | grep 3000
   ```

4. **Reiniciar el servidor:**
   ```bash
   pkill -f "next dev"
   npm run dev
   ```

### 📱 **Dispositivos compatibles**

- ✅ **Móviles**: iPhone, Android
- ✅ **Tablets**: iPad, Android tablets
- ✅ **Laptops**: Windows, macOS, Linux
- ✅ **Smart TVs**: Con navegador web

### 🔒 **Seguridad**

- ⚠️ **Solo para desarrollo**: No uses esta configuración en producción
- ⚠️ **Red confiable**: Solo en redes que confíes
- ⚠️ **Puerto temporal**: El puerto 3000 se cierra al detener el servidor

### 🎯 **URLs de acceso**

| Dispositivo | URL |
|-------------|-----|
| **Tu computadora** | `http://localhost:3000` |
| **Otros dispositivos** | `http://10.75.36.106:3000` |
| **Backend API** | `http://localhost:8000` |

---

**¡Ahora puedes acceder al frontend desde cualquier dispositivo en tu red local!** 🚀
