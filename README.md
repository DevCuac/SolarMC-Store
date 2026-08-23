# 🌐 Solar Store - Tienda de Servidor de Minecraft (Estilo OPLegends)

Tienda web para servidor de Minecraft inspirada y fiel al diseño de **store.oplegends.com**, construida con **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **NextAuth** (Discord, Google, Email/Password y Minecraft Quick Link) y un **Panel de Administración completo**.

---

## ✨ Características Principales

### 🎮 Tienda & Experiencia de Jugador (Storefront)
- **Réplica visual exacta de OPLegends**:
  - Paleta de colores oscuros (`#11141d`, `#181b27`, `#202536`, `#52b824`).
  - Cabecera con **Play Now** (botón de copiado de IP con badge de jugadores online en tiempo real), **Logo 3D** estilizado y **Discord Join Now** (con badge de miembros en vivo).
  - Selector horizontal de categorías tipo pill (`⚡ Home`, `⛏️ Prison`, `🌌 Universes`, `⚔️ Dungeons`, `📦 Gens`, `🌱 Survival`, `🌐 Global`).
  - Tarjeta destacada **"Claim Your Free Rank"** con icono de escudo pixel art, 4 perks destacados y reclamo con confeti y entrega instantánea in-game.
  - Tarjeta de jugador con avatar 3D de la cabeza del skin (integración con `mc-heads.net` y `crafatar.com`), selector de edición (`Java` / `Bedrock`) y botón de carrito de compras.
  - Catálogo de paquetes con badges (`BEST SELLER`, `MONTHLY`, `SALE`), precios y modal de perks detallados.
  - Sección interactiva de cupones de descuento con validación en tiempo real.
  - Sección de Soporte & Asistencia con modal de preguntas frecuentes y los 3 bloques de Disclaimer legal.
  - Footer oficial con aviso de copyright Mojang y barra estilo Tebex con enlaces legales.
  - Carrito de compras desplegable con ajuste de cantidades, aplicación de cupones y checkout simulado con entrega de comandos in-game.

### 🔐 Sistema de Autenticación & Usuarios
- **NextAuth.js** con soporte para:
  - **Discord OAuth**
  - **Google OAuth**
  - **Email y Contraseña** (Registro con encriptación bcrypt)
  - **Minecraft Quick Link** (Conexión rápida por nickname de jugador)
- Control de roles (`USER` y `ADMIN`) con middleware de protección de rutas.

### 🛠️ Panel de Administración (`/admin`)
- **Dashboard Overview**: Ingresos totales (\$ USD), pedidos realizados, paquetes activos, cupones creados y transacciones recientes.
- **Gestor de Productos**: CRUD completo de paquetes con editor de lista de beneficios (perks) y comandos de consola de Minecraft (ej. `lp user {player} parent add overlord`).
- **Gestor de Categorías**: CRUD de categorías con emojis/iconos personalizados y ordenamiento.
- **Gestor de Cupones de Descuento**: Creación de códigos (% de descuento o monto fijo $), límite de usos, fecha de expiración y compra mínima.
- **Historial de Pedidos**: Registro detallado de transacciones, desglose de items y estado de ejecución de comandos.
- **CMS de Páginas Legales**: Editor en vivo con Markdown para:
  - Términos y Condiciones (`/terms`)
  - Políticas de Privacidad (`/privacy`)
  - Impressum / Aviso Legal (`/impressum`)
  - Reglas del Servidor (`/rules`)
- **Configuración del Servidor**: Edición del nombre del servidor, IP, puerto, URL de Discord, contadores en vivo, correo de soporte y textos de disclaimer.

---

## 🚀 Puesta en Marcha Rápida

### 1. Requisitos
- Node.js 18+ o superior (probado en Node.js v24)
- npm

### 2. Variables de Entorno (`.env`)
El archivo `.env` ya viene configurado por defecto con SQLite para ejecución local inmediata:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="oplegends_minecraft_store_secret_jwt_key_2026_super_secure"
NEXTAUTH_URL="http://localhost:3000"

# Opcionales para OAuth (Discord y Google)
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔑 Credenciales de Acceso por Defecto

### Cuenta de Administrador:
- **Email**: `admin@oplegends.com`
- **Contraseña**: `admin123`
- **Rol**: `ADMIN` (Acceso completo a `/admin`)

### Cuenta de Jugador de Prueba:
- **Email**: `player@oplegends.com`
- **Contraseña**: `player123`

### Cupones de Descuento Activos:
- `WELCOME10` : 10% de descuento en todo el carrito.
- `OPLEGENDS50` : 50% de descuento (en compras superiores a $20).
- `DISCORD5` : $5.00 de descuento fijo.

---

## 📦 Comandos Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia el servidor en modo producción.
- `npm run seed`: Restablece y repuebla la base de datos con datos de demostración.
- `npx prisma studio`: Abre la interfaz visual de base de datos de Prisma en el navegador.
