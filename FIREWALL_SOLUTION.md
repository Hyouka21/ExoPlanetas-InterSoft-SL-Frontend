# 🔥 Solución de Firewall para Acceso de Red

## 🚨 **Problema Identificado**
El servidor Next.js está funcionando correctamente, pero el firewall de macOS está bloqueando las conexiones externas al puerto 3000.

## ✅ **Estado Actual**
- ✅ **Servidor**: Ejecutándose en `0.0.0.0:3000`
- ✅ **Puerto**: Abierto y escuchando (`*:hbci`)
- ✅ **IP Local**: `10.231.220.205`
- ❌ **Firewall**: Bloqueando conexiones externas

## 🔧 **Soluciones**

### **Opción 1: Deshabilitar Firewall Temporalmente (Recomendado para desarrollo)**

1. **Abrir Preferencias del Sistema**:
   - Ir a `Apple Menu` → `Preferencias del Sistema`
   - Hacer clic en `Seguridad y Privacidad`
   - Ir a la pestaña `Firewall`

2. **Deshabilitar Firewall**:
   - Hacer clic en el candado para desbloquear
   - Ingresar tu contraseña
   - Hacer clic en `Desactivar Firewall`

3. **Verificar**:
   - El estado debe mostrar "Firewall: Desactivado"
   - Ahora otros dispositivos podrán acceder

### **Opción 2: Permitir Node.js en el Firewall**

1. **Abrir Preferencias del Sistema**:
   - Ir a `Apple Menu` → `Preferencias del Sistema`
   - Hacer clic en `Seguridad y Privacidad`
   - Ir a la pestaña `Firewall`

2. **Configurar Firewall**:
   - Hacer clic en `Opciones de Firewall...`
   - Buscar `node` en la lista
   - Si no está, hacer clic en `+` y agregar `/usr/local/bin/node`
   - Asegurarse de que esté marcado como `Permitir conexiones entrantes`

### **Opción 3: Usar un Puerto Diferente (Alternativa)**

Si el puerto 3000 sigue bloqueado, podemos usar otro puerto:

```bash
# Detener el servidor actual
pkill -f "next dev"

# Iniciar en puerto 8080
npm run dev -- -p 8080
```

Luego acceder desde: `http://10.231.220.205:8080`

## 🧪 **Verificación**

### **Desde tu computadora**:
```bash
curl -I http://10.231.220.205:3000
```

### **Desde otro dispositivo**:
1. Conectar a la misma red WiFi
2. Abrir navegador
3. Ir a: `http://10.231.220.205:3000`

## 🚨 **Importante**

- ⚠️ **Solo para desarrollo**: No deshabilites el firewall en producción
- ⚠️ **Reactivar después**: Recuerda reactivar el firewall cuando termines
- ⚠️ **Red confiable**: Solo hazlo en redes que confíes

## 🔄 **Comandos Rápidos**

```bash
# Verificar estado del firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Ver aplicaciones permitidas
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --listapps

# Permitir Node.js específicamente
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblock /usr/local/bin/node
```

## 📱 **URLs de Acceso**

| Dispositivo | URL |
|-------------|-----|
| **Tu computadora** | `http://localhost:3000` |
| **Otros dispositivos** | `http://10.231.220.205:3000` |

---

**¡Después de deshabilitar el firewall, otros dispositivos podrán acceder al frontend!** 🚀
