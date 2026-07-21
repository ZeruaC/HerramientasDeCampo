# Configuración de Supabase

## Paso 1: Deshabilitar Confirmación de Email (IMPORTANTE)

1. Ve a: https://app.supabase.com/project/sqmhkswgfbvfwxcdkcmi/auth/policies
2. En la sección **Email auth**, busca "Require email verification"
3. **Desactiva** esta opción (toggle OFF)
4. Guarda los cambios

Sin esto, los usuarios recibirán un email de confirmación y no podrán usar la app.

## Paso 2: Base de Datos

Las tablas ya están creadas:
- `profiles` - Información del usuario
- `proposals` - Propuestas de venta (numeradas)
- `products` - Catálogo de baterías
- `prices` - Precios de productos

## Paso 3: Políticas de Seguridad (RLS)

Ya están configuradas:
- Usuarios pueden ver solo sus propias propuestas
- Usuarios pueden leer el catálogo público
- Admins pueden gestionar productos y precios

## Paso 4: Usar la App

1. Regístrate con tu email en la pantalla de login
2. Serás autenticado inmediatamente (sin confirmar email)
3. Podrás acceder a todas las herramientas

## Variables de Entorno

El archivo `.env.local` contiene las credenciales necesarias (no se versionan en Git).
