# Despliegue de INTEVOPEDI en producción

Este documento reúne los pormenores del despliegue de `INTEVOPEDI` para el dominio `https://intevopedi.org`, incluyendo infraestructura, requisitos de base de datos, variables de entorno, Docker, Portainer, Traefik y verificación post-despliegue.

## 1. Arquitectura de despliegue

La aplicación está preparada para ejecutarse con:

- Next.js 14 en Node.js 20
- PostgreSQL 16
- Docker multi-stage build
- Docker Swarm / Portainer Stack
- Traefik como reverse proxy TLS
- Volumen persistente para PostgreSQL

Servicios definidos actualmente:

- `db`: PostgreSQL 16
- `app`: aplicación Next.js `intevopedi-app:latest`

Redes definidas:

- `intevopedi_internal`: red interna overlay
- `RenaceNet`: red externa para Traefik

Volúmenes:

- `intevopedi_db_data`: persistencia de PostgreSQL

## 2. Requisitos mínimos del servidor

Mínimo recomendado:

- 2 vCPU
- 4 GB RAM
- 20 GB de disco SSD
- Docker Engine 24+
- Docker Compose plugin
- Docker Swarm inicializado
- Portainer opcional, pero recomendado
- Traefik operativo con resolver Let's Encrypt

Recomendado para mayor holgura:

- 4 vCPU
- 8 GB RAM
- 40 GB SSD

Puertos requeridos:

- `80/tcp`
- `443/tcp`

## 3. Requisitos del dominio

Debes tener configurado:

- Registro `A` o `AAAA` de `intevopedi.org` apuntando al servidor
- Opcionalmente `www.intevopedi.org`
- Certificados TLS administrados por Traefik

La aplicación debe quedar publicada bajo:

- `https://intevopedi.org`

## 4. Requisitos de base de datos

Configuración prevista:

- Motor: `PostgreSQL 16`
- Base de datos: `intevopedi_db`
- Usuario: `intevopedi`
- Puerto interno: `5432`
- Esquema: `public`
- Persistencia: volumen `intevopedi_db_data`

### Datos mínimos de la base

Debes definir:

- `POSTGRES_USER=intevopedi`
- `POSTGRES_DB=intevopedi_db`
- `POSTGRES_PASSWORD` en el entorno seguro del servidor
- `DATABASE_URL` apuntando al servicio `db`

Formato esperado:

```env
DATABASE_URL=postgresql://intevopedi:TU_PASSWORD_CODIFICADA@db:5432/intevopedi_db?schema=public
```

## 5. Importante sobre contraseñas con caracteres especiales

Si la contraseña de PostgreSQL contiene caracteres especiales, debes codificarlos dentro de `DATABASE_URL`.

Ejemplos frecuentes:

- `@` se convierte en `%40`
- `:` se convierte en `%3A`
- `/` se convierte en `%2F`
- `#` se convierte en `%23`

Esto es importante porque `POSTGRES_PASSWORD` y `DATABASE_URL` **no usan exactamente el mismo formato**:

- En `POSTGRES_PASSWORD` usas el valor real
- En `DATABASE_URL` usas el valor codificado para URL

## 6. Secretos y variables de entorno

Variables necesarias en producción:

```env
DATABASE_URL=postgresql://intevopedi:TU_PASSWORD_CODIFICADA@db:5432/intevopedi_db?schema=public
NEXT_PUBLIC_BASE_URL=https://intevopedi.org
ADMIN_ACCESS_PASSWORD=CAMBIAR_POR_CLAVE_SEGURA
ADMIN_SESSION_SECRET=CAMBIAR_POR_CADENA_LARGA_Y_ALEATORIA
PARTICIPANT_SESSION_SECRET=CAMBIAR_POR_CADENA_LARGA_Y_ALEATORIA
POSTGRES_USER=intevopedi
POSTGRES_PASSWORD=CARGAR_SOLO_EN_SERVIDOR
POSTGRES_DB=intevopedi_db
APP_HOST=intevopedi.org
PORT=3000
```

## 7. Manejo seguro de la contraseña de base de datos

La contraseña de base de datos que definas para producción debe cargarse:

- en `.env` del servidor, o
- como variable segura en Portainer

No debe guardarse en:

- `.env.example`
- `README.md`
- archivos públicos del repositorio
- commits de Git

Si ya publicaste una contraseña real en Git o en GitHub, debes rotarla inmediatamente.

## 8. Preparación del servidor

### Inicializar Swarm

```bash
docker swarm init
```

### Crear la red externa de Traefik si no existe

```bash
docker network create --driver overlay --attachable RenaceNet
```

### Obtener el proyecto

```bash
git clone https://github.com/ExpertosTI/INTEVOPEDI.git
cd INTEVOPEDI
```

### Crear el archivo `.env`

```bash
cp .env.example .env
nano .env
```

## 9. Archivo de stack utilizado

El despliegue usa:

- `docker-compose.portainer.yml`

Puntos relevantes del stack actual:

- PostgreSQL usa `postgres:16-alpine`
- La app usa `intevopedi-app:latest`
- Traefik expone la app con la regla `Host(`${APP_HOST}`)`
- La app escucha en el puerto interno `3000`
- La base de datos persiste en `intevopedi_db_data`

## 10. Construcción y despliegue

### Construir la imagen

```bash
docker compose -f docker-compose.portainer.yml build
```

### Desplegar el stack

```bash
docker stack deploy -c docker-compose.portainer.yml intevopedi
```

## 11. Inicialización de Prisma y datos

La aplicación necesita que el esquema exista en PostgreSQL.

Después del primer despliegue, ejecuta:

```bash
docker ps --filter name=intevopedi_app
```

Identifica el contenedor activo y luego ejecuta:

```bash
docker exec -it <APP_CONTAINER_ID> npx prisma db push
```

Luego carga los datos semilla:

```bash
docker exec -it <APP_CONTAINER_ID> npm run prisma:seed
```

Si vuelves a desplegar una versión nueva sin cambios de esquema, normalmente no necesitas repetir la semilla.

## 12. Verificación post-despliegue

Verifica servicios:

```bash
docker service ls
```

Verifica tareas del servicio:

```bash
docker service ps intevopedi_app
```

Verifica logs:

```bash
docker service logs -f intevopedi_app
```

Pruebas manuales mínimas:

- abrir `https://intevopedi.org`
- abrir `https://intevopedi.org/cursos`
- abrir `https://intevopedi.org/participantes`
- abrir `https://intevopedi.org/verificar`
- probar acceso admin en `/admin/login`
- completar una inscripción de prueba
- validar emisión y descarga de certificado
- comprobar que el QR abre la URL pública correcta

## 13. Verificaciones técnicas esperadas

La instalación debe cumplir con lo siguiente:

- el dominio público debe ser `https://intevopedi.org`
- las cookies deben viajar solo por HTTPS en producción
- las páginas privadas no deben indexarse
- la aplicación debe compilar con `npm run build`
- el volumen de PostgreSQL debe persistir reinicios
- Traefik debe resolver TLS correctamente

## 14. Respaldo de base de datos

Respaldo manual recomendado:

```bash
docker exec -t <DB_CONTAINER_ID> pg_dump -U intevopedi intevopedi_db > intevopedi_backup.sql
```

Restauración:

```bash
cat intevopedi_backup.sql | docker exec -i <DB_CONTAINER_ID> psql -U intevopedi intevopedi_db
```

## 15. Recuperación ante fallos

Si el sitio no levanta:

- revisar `docker service logs -f intevopedi_app`
- revisar `docker service logs -f intevopedi_db`
- confirmar que `RenaceNet` exista
- confirmar que `APP_HOST=intevopedi.org`
- confirmar que `DATABASE_URL` apunte a `db:5432`
- confirmar que la contraseña esté bien escrita y bien codificada en `DATABASE_URL`
- volver a ejecutar `npx prisma db push` dentro del contenedor app

## 16. Checklist final antes de producción

- dominio apuntando al servidor
- Traefik funcionando con TLS
- `.env` creado solo en el servidor
- contraseña de BD cargada solo como secreto del servidor
- `DATABASE_URL` con contraseña codificada correctamente
- build de la app correcto
- `docker stack deploy` completado
- `prisma db push` ejecutado
- `prisma:seed` ejecutado
- prueba de inscripción correcta
- prueba de certificado correcta
- prueba de admin correcta

## 17. Recomendación de seguridad

Aunque tengas una contraseña definida, la práctica correcta es:

- no publicar secretos en el repositorio
- no dejar contraseñas reales en archivos versionados
- rotar las claves si fueron compartidas en texto plano
- usar contraseñas largas y únicas
- considerar Portainer secrets o un gestor de secretos
