# INTEVOPEDI App

Aplicación full-stack para cursos accesibles de INTEVOPEDI, con inscripciones persistentes, seguimiento del participante, panel administrativo, certificados PDF verificables por QR, centro de recursos y mini portafolio institucional para proyectos aliados como Grupo Atrévete.

## Stack

- Next.js 14
- React 18
- Prisma
- PostgreSQL
- PDF-lib
- QRCode

## Curso inicial cargado

- IA como Apoyo a la Discapacidad Visual
- Modalidad Zoom
- Fecha: sábado 14 de marzo
- Costo: RD$ 500

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```bash
cp .env.example .env
```

Variables principales:

- `DATABASE_URL`
- `NEXT_PUBLIC_BASE_URL`
- `ADMIN_ACCESS_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `PARTICIPANT_SESSION_SECRET`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `APP_HOST`

Valores recomendados para producción en `intevopedi.org`:

- `NEXT_PUBLIC_BASE_URL=https://intevopedi.org`
- `APP_HOST=intevopedi.org`
- `ADMIN_SESSION_SECRET` con una cadena aleatoria robusta
- `PARTICIPANT_SESSION_SECRET` con una cadena aleatoria robusta

## Ejecutar en local

```bash
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
```

Luego abre:

- `http://localhost:3000`
- `http://localhost:3000/admin/login`
- `http://localhost:3000/verificar`

## Flujo funcional

1. Publicas el curso en la landing y catálogo.
2. El participante se inscribe desde la página del curso.
3. El sistema crea un código de inscripción y panel personal.
4. Se puede avanzar por módulos o completar desde administración.
5. Al completar, se emite un certificado con código y QR.
6. El certificado se valida desde la página pública o el QR.

## Módulos de experiencia agregados

- Landing institucional moderna
- Catálogo y detalle de cursos
- Hub de acceso para participantes
- Campus privado por participante
- Biblioteca de recursos por curso
- Centro de recursos
- Verificación pública de certificados
- Panel administrativo
- Portafolio integrado de Grupo Atrévete
- Sitemap y robots para SEO técnico básico

## Fase 3 actual

- Biblioteca académica configurable por curso sin migraciones adicionales
- Visualización de recursos en catálogo, detalle del curso, campus y panel del participante
- Inventario de recursos en el panel administrativo
- Base preparada para evolucionar luego a gestión persistente desde base de datos

## Despliegue con Docker

```bash
docker build -t intevopedi-app:latest .
docker run --env-file .env -p 3000:3000 intevopedi-app:latest
```

Si vas a probar localmente antes de Traefik:

```bash
cp .env.example .env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
APP_HOST=localhost
docker build -t intevopedi-app:latest .
docker run --env-file .env -p 3000:3000 intevopedi-app:latest
```

## Despliegue con Portainer / Stack

Archivo incluido:

- `docker-compose.portainer.yml`

Pasos sugeridos en servidor:

```bash
git clone https://github.com/ExpertosTI/INTEVOPEDI.git
cp .env.example .env
nano .env
```

Usa al menos estos valores en `.env`:

```bash
NEXT_PUBLIC_BASE_URL=https://intevopedi.org
APP_HOST=intevopedi.org
ADMIN_ACCESS_PASSWORD=una-clave-segura
ADMIN_SESSION_SECRET=una-cadena-larga-y-aleatoria
PARTICIPANT_SESSION_SECRET=otra-cadena-larga-y-aleatoria
```

```bash
docker compose -f docker-compose.portainer.yml build
docker stack deploy -c docker-compose.portainer.yml intevopedi
```

El `stack` usa la imagen local `intevopedi-app:latest`, por lo que el paso de `build` debe ejecutarse en el mismo servidor antes de desplegar.

Si prefieres Portainer UI:

1. Crear stack nuevo.
2. Subir el contenido de `docker-compose.portainer.yml`.
3. Definir las variables del archivo `.env` en Portainer.
4. Desplegar.

## Accesos clave

- Sitio principal: `/`
- Cursos: `/cursos`
- Acceso participantes: `/participantes`
- Campus privado: `/campus`
- Panel participante: `/mi-inscripcion/[codigo]`
- Centro de recursos: `/recursos`
- Portafolio Grupo Atrévete: `/grupo-atrevete`
- Verificación pública: `/verificar`
- Validación directa: `/certificados/[codigo]`
- PDF certificado: `/api/certificados/[codigo]/pdf`
- Admin: `/admin/login`

## Datos institucionales ajustados

- Teléfono corregido: `829 954 8273`
- Repositorio: `https://github.com/ExpertosTI/INTEVOPEDI`

## Notas importantes

- No subas secretos reales a Git.
- Usa variables de entorno seguras en Portainer.
- Si alguna credencial ya fue expuesta, rótala antes de producción.

---

## Créditos

**Desarrollado por:** Adderly Marte  
**Para:** RENACE.TECH  
**Donado a:** INTEVOPEDI - Instituto de Tecnología Inclusiva para Ciegos  
**Repositorio:** https://github.com/ExpertosTI/INTEVOPEDI
