# 📋 Mini Gestor de Tareas - BodyTech

## 📌 Descripción del Proyecto

**Mini Gestor de Tareas** es una aplicación web fullstack para gestionar tareas de manera eficiente. Permite crear, editar, eliminar y organizar tareas por estado (pendiente, en progreso, completada), con autenticación segura mediante JWT y login con Google.

---

## ⚠️ Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- **Docker** y **Docker Compose** (para el backend)
- **Node.js 18+** y **npm** (para el frontend)
- **Git** (para clonar el repositorio)

⚡ **Nota**: No necesitas instalar PHP ni PostgreSQL localmente. Docker se encarga de todo.

---

## ⚙️ Stack Tecnológico

### Backend
- **Framework**: Laravel 12.x
- **Lenguaje**: PHP 8.2+
- **Autenticación**: JWT (JWT-Auth 2.2)
- **Base de Datos**: PostgreSQL 15 (Docker)
- **Servidor**: Nginx (en Docker)

### Frontend
- **Framework**: React 19.2.0
- **Lenguaje**: TypeScript 5.x
- **Build Tool**: Vite 6.x
- **Gestión de Estado**: Redux Toolkit
- **Estilos**: Tailwind CSS
- **Routing**: React Router 7.13
- **HTTP Client**: Axios
- **Validaciones**: React Hook Form
- **Autenticación Social**: Firebase + Google OAuth

---

## 🚀 Cómo Levantar el Proyecto

### 1️⃣ Backend (Docker)

```bash
# Navega a la carpeta del backend
cd Back

# Levanta el contenedor Docker
docker compose up -d

# El backend estará disponible en: http://localhost:8000/api
```

**Lo que Docker levanta:**
- Backend con Laravel y Nginx en puerto 8000
- PostgreSQL 15 en puerto 5432 (base de datos)
- Credenciales BD: usuario `taskuser`, contraseña `taskpassword123`

---

### 2️⃣ Frontend (Manual)

```bash
# Navega a la carpeta del frontend (otra terminal)
cd Front

# Instala las dependencias
npm install

# Levanta el servidor de desarrollo
npm run dev

# El frontend estará disponible en: http://localhost:5173
```

---

## 📝 Variables de Entorno

### Backend (.env)

```
APP_NAME="Mini Gestor de Tareas"
APP_ENV=local
APP_DEBUG=true
APP_KEY=base64:tu_clave_aqui
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=tasksdb
DB_USERNAME=taskuser
DB_PASSWORD=taskpassword123

JWT_SECRET=tu_jwt_secret_aqui
```

---

## 🎯 Acceso a la Aplicación

Una vez que levantes ambos servicios:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Base de Datos** (PostgreSQL): localhost:5432

---

## 🛑 Detener la Aplicación

### Backend (Docker)
```bash
cd Back
docker compose down
```

### Frontend
Presiona `Ctrl + C` en la terminal donde está running `npm run dev`

---

## 📦 Dependencias Requeridas

### Para levantar el proyecto necesitas:
- **Docker** y **Docker Compose** (para el backend)
- **Node.js 18+** y **npm** (para el frontend)
- **Git** (para clonar el repositorio)

No necesitas instalar PHP ni PostgreSQL localmente. Todo lo maneja Docker.

---

## ✅ Verificación de que Todo Funciona

1. Abre **http://localhost:5173** en tu navegador
2. Deberías ver la aplicación del gestor de tareas
3. Intenta registrarte o hacer login con Google
4. Crea una tarea
5. ¡Listo! ✨

---

**Última actualización**: Febrero 6, 2026
