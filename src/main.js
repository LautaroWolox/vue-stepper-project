import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import './assets/css/nuestros.css'
import './assets/css/fallidas-fix-filters.css'
import './assets/css/fallidas-fix-grid.css'
import './assets/css/fallidas-fix-empty.css'
import './assets/css/validacion-redes-buttons.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
