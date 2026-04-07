# KabanPro-Final

> 🛠️ Proyecto de sistema tipo **Kanban** para gestión de tareas/usuarios, desarrollado con Node.js, Express y Handlebars.

---

## 🔎 ¿Qué es este proyecto?

KabanPro‑Final es una aplicación web que permite crear, visualizar y gestionar tareas de forma organizada utilizando la metodología visual **Kanban**.  
Está diseñada para ser usada como herramienta de aprendizaje y práctica en desarrollo web backend con Node.js y Express.

---

## 📌 Funcionalidades principales

✅ **Gestión de usuarios** (registro/inicio de sesión)  
✅ **Panel Kanban interactivo**  
✅ Crear, mover y eliminar tareas  
✅ Persistencia de datos en JSON (simulando DB)  
✅ Rutas API estructuradas

---

## ⚙️ Tecnologías utilizadas

- **Node.js** – Entorno de ejecución backend  
- **Express** – Framework web minimalista  
- **Handlebars** – Motor de plantillas para vistas  
- **JavaScript** – Lógica de frontend y backend  
- **CSS** – Estilos de interfaz  
- Archivos JSON para almacenamiento local

---
## 🧱 Estructura del proyecto

📦KabanPro-Final
┣ 📂controllers # Controladores MVC
┣ 📂middleware # Middlewares de rutas
┣ 📂models # Modelos y lógica de datos
┣ 📂views # Vistas Handlebars
┣ 📂routes/api/auth # Rutas de autenticación y API
┣ 📂public # Archivos estáticos (CSS/JS)
┣ app.js # Archivo principal del servidor
┣ database.js # Configuración de DB/archivos
┣ data.json # Datos persistentes
┣ seed.js # Poblado inicial de datos
┣ test-crud.js # Script de pruebas CRUD
┗ package.json # Dependencias y comandos

---

## 🚀 Requisitos previos

Antes de clonar e instalar, asegúrate de tener instalados:

✔️ **Node.js** (v18+)  
✔️ **npm** (v8+)

---

## 🔽 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/riquelmendomi/KabanPro-Final.git

2-. Entra al directorio:
    cd KabanPro-Final

3-. Instala dependencias:
    npm install

4-. Inicia el servidor:
    npm start

---

🧪 Uso

Una vez levantado el servidor:

🔗 Abre en tu navegador:

http://localhost:3000

Interactúa con el sistema Kanban agregando, moviendo y eliminando tareas.
