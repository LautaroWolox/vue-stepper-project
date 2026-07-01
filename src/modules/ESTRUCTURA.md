# Estructura modular

Se agregó una estructura nueva por pantalla.

Cada pantalla nueva debe quedar así:

- PantallaPrincipal.vue
- components
- components/elementos
- columns
- store
- utils
- types.js

Pantallas conectadas desde MainView:

- notaCredito
- notaDebito
- registroOtsFallidasCT
- otFallidasGM
- validacionOtRedes
- gestionMaterialesOt
- configJobtypeContrato
- configCmoActividad
- consultarActas
- reporteSas

Los componentes anteriores quedan como compatibilidad para no perder código ya hecho.
