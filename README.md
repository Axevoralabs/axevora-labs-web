# Axevora Labs — Corporate Website

Sitio corporativo oficial de **Axevora Labs**, diseñado como una presencia digital premium para presentar la compañía, sus productos y sus líneas de contacto.

## Páginas

- `index.html` — Inicio y portafolio
- `about.html` — Compañía, misión y filosofía
- `investors.html` — Tesis, portafolio y enfoque para inversionistas
- `careers.html` — Cultura y perfiles futuros
- `contact.html` — Contacto corporativo

## Productos

- ¿Me Conviene? AI — https://me-conviene-ai.vercel.app
- CierraFlow — https://cierraflow.vercel.app/

## Stack

HTML, CSS y JavaScript sin framework. El formulario de Contact usa una Vercel Function en `api/contact.js` y está preparado para envío mediante Resend.

## Variables de entorno para Contact

Configurar en Vercel:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

Consulta `.env.example` como referencia. No publiques claves privadas en GitHub.

## Despliegue en Vercel

- Framework Preset: `Other`
- Root Directory: `./`
- Sin Build Command
- Sin Output Directory personalizada

Cada push a la rama de producción del repositorio puede desplegarse automáticamente mediante la integración Git de Vercel.
