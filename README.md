# Field Manager Vue

Prototipo frontend de Field Manager construido con Vue 3 + Vite.

La idea del proyecto es validar cómo se verían y cómo se organizarían pantallas migradas desde JSP hacia Vue, manteniendo una estructura lista para conectar contra backend real.

## Stack

- Vue 3
- Vue Router
- Vite
- CSS modular por pantalla/componente
- Servicios preparados para consumir API REST

## Instalación

```bash
npm install
npm run dev
```

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar según el ambiente:

```bash
cp .env.example .env
```

Variables principales:

```env
VITE_FM_MV_URL_2=http://localhost:8080
VITE_AUTH_DEMO=true
VITE_USE_MOCKS=true
```

- `VITE_FM_MV_URL_2`: URL base del backend.
- `VITE_AUTH_DEMO`: permite alternar entre login demo local y login real de backend.
- `VITE_USE_MOCKS`: permite alternar entre datos mock locales y endpoints reales.

## Organización relevante

```txt
src/
├── components/
│   ├── login/
│   ├── materiales/
│   │   ├── GestionMateriales.vue
│   │   ├── MaterialesFilters.vue
│   │   ├── MaterialesStepperHeader.vue
│   │   ├── MaterialesReview.vue
│   │   └── MaterialesExport.vue
│   └── ...
├── composables/
│   └── useAuth.js
├── mocks/
│   └── materialesMock.js
├── services/
│   ├── apiClient.js
│   ├── authService.js
│   └── materialesService.js
└── utils/
    └── csv.js
```

## Integración backend

La capa preparada para backend está en `src/services`.

### Auth

`src/services/authService.js` consume:

```txt
POST /auth/login
```

El frontend acepta respuestas con token en `token`, `accessToken` o `data.token`.

### Materiales

`src/services/materialesService.js` define estos endpoints iniciales:

```txt
POST /materiales/ots/buscar
POST /materiales/descargados/buscar
POST /materiales/ots/guardar
POST /materiales/descargados/guardar
```

Cuando `VITE_USE_MOCKS=true`, los datos salen desde `src/mocks/materialesMock.js`.

Cuando `VITE_USE_MOCKS=false`, se usa `apiClient` con encabezado de autorización automáticamente.

## Estado actual

El proyecto sigue siendo una maqueta funcional, pero la pantalla de Gestión de Materiales ya quedó separada en componentes más chicos y con una capa de servicios lista para reemplazar mocks por backend real.
