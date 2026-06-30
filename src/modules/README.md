# Estructura de pantallas migradas

Las pantallas migradas se cargan desde src/modules.

Cada pantalla debe tener una carpeta propia con su archivo Screen.vue.

Estructura recomendada por pantalla:

- Screen.vue
- components
- filters
- buttons
- inputs
- grids
- modals
- composables
- services
- mock

Modulos actuales:

- gestion-extendido
- gestion-materiales
- actas
- reportes

Componentes compartidos:

- src/shared/buttons
- src/shared/fm-icons
- src/shared/inputs
- src/shared/grids
- src/shared/composables
- src/shared/excel

Regla de migracion:

1. La pantalla entra por Screen.vue.
2. Los filtros van en filters.
3. Los botones propios van en buttons.
4. Los inputs propios van en inputs.
5. Las grillas propias van en grids.
6. Los popups y modales van en modals.
7. La comunicacion con backend va en services.
8. Los datos mock temporales van en mock.
9. Lo reutilizable entre pantallas va en src/shared.
