# 📋 Mini Gestor de Tareas - BodyTech

## 📌 Descripción del Proyecto

**Mini Gestor de Tareas** es una aplicación web fullstack para gestionar tareas de manera eficiente. Permite crear, editar, eliminar y organizar tareas por estado, con autenticación por JWT y Google OAuth.

---

## ⚠️ Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- **Docker** y **Docker Compose**
- **Git** (para clonar el repositorio)

⚡ **Nota**: No necesitas instalar PHP, Node.js ni PostgreSQL localmente. Docker lo maneja todo.

---

## ⚙️ Configuración de Variables de Entorno

### ⚠️ IMPORTANTE: Nombres de archivos `.env`

Cuando recibas los archivos `.env` por WhatsApp, Email o cualquier servicio de mensajería, **algunos servicios pueden eliminar el punto (.) al inicio del nombre del archivo**.

🔴 **INCORRECTO**: `env` (sin el punto)  
🟢 **CORRECTO**: `.env` (CON el punto)

#### En Windows:
```powershell
# Renombrar si es necesario
ren env .env
```

#### En Mac/Linux:
```bash
# Renombrar si es necesario
mv env .env
```

## ⚙️ Stack Tecnológico

### Backend
- **Framework**: Laravel 12.x
- **Lenguaje**: PHP 8.2+
- **Autenticación**: JWT (JWT-Auth 2.2)
- **Base de Datos**: PostgreSQL 15
- **Servidor**: Nginx

### Frontend
- **Framework**: React 19.2.0
- **Lenguaje**: TypeScript 5.x
- **Build Tool**: Vite 6.x
- **Gestión de Estado**: Redux Toolkit
- **Estilos**: Tailwind CSS
- **Routing**: React Router
- **Validaciones**: React Hook Form + Yup
- **Autenticación Social**: Firebase + Google OAuth

---

## 🚀 Instalación Rápida (Docker)

### 1. Levantar TODO con un comando

### ⚠️ IMPORTANTE: Tener los archivos `.env` dentro de cada directorio

Por email se hará llegar los archivos de configuración .env para el Back y para el Front.
Se deben agregar a cada directorio, **NO CONFUNDIR CADA ARCHIVO**.

```bash
cd Prueba_BodyTech
docker compose up -d
```

Lo que se inicia automáticamente:
- ✅ Backend (Laravel + Nginx) → puerto 8000
- ✅ Frontend (React + Vite) → puerto 5173
- ✅ Database (PostgreSQL 15) → puerto 5432
- ✅ Migraciones automáticas
- ✅ Variables de entorno configuradas

### 2. Acceso a la aplicación

```
🌐 Frontend:  http://localhost:5173
📡 API:       http://localhost:8000/api
🗄️  Database: localhost:5432 (taskuser / taskpassword123)
```

### 3. Detener los servicios

```bash
docker compose down
```

---

### Archivos de configuración necesarios:

1. **Backend** (`Back/.env`)
   - Configuración de Base de Datos
   - JWT Secret
   - App Key

2. **Frontend** (`Front/.env`)
   - `VITE_FIREBASE_API_KEY` - De Firebase Console
   - `VITE_FIREBASE_AUTH_DOMAIN` - De Firebase Console
   - `VITE_FIREBASE_PROJECT_ID` - De Firebase Console
   - `VITE_FIREBASE_STORAGE_BUCKET` - De Firebase Console
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` - De Firebase Console
   - `VITE_FIREBASE_APP_ID` - De Firebase Console
   - `VITE_CLOUDINARY_CLOUD_NAME` - De Cloudinary
   - `VITE_CLOUDINARY_UPLOAD_PRESET` - De Cloudinary


---

## 📋 Funcionalidades

✅ Registro e inicio de sesión (email + contraseña)  
✅ Autenticación con Google OAuth  
✅ JWT tokens con refresh automático  
✅ Crear tareas  
✅ Editar tareas (título y descripción)  
✅ Cambiar estado de tareas (Pendiente → En Progreso → Completada)  
✅ Eliminar tareas con confirmación  
✅ Filtrar tareas por estado  
✅ Perfil de usuario  
✅ Subida de imagen de perfil  
✅ Validaciones frontend y backend  
✅ Notificaciones toast  
✅ Interfaz responsiva y moderna  

---

## ✅ Verificar que funciona

1. Abre http://localhost:5173
2. Registrate o inicia sesión con Google
3. Crea tu primera tarea
4. ¡Listo! 🎉

---

## 🐛 Troubleshooting

### Los servicios no inician
```bash
docker compose logs -f
docker compose down -v
docker compose up -d
```

### Frontend no conecta con backend
- Verifica que el backend esté corriendo: `docker compose logs backend`
- El puerto 8000 debe estar disponible

### Ejecutar migraciones manualmente
```bash
docker compose exec backend php artisan migrate
```

---

## 📁 Estructura del Proyecto

```
Prueba_BodyTech/
├── Back/               # Backend (Laravel)
│   ├── app/
│   ├── database/
│   ├── config/
│   ├── routes/
│   └── Dockerfile
├── Front/              # Frontend (React)
│   ├── src/
│   ├── public/
│   └── Dockerfile
└── docker-compose.yml  # Orquestación de servicios
```

---

**Última actualización**: Febrero 6, 2026
