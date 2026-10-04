import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({})
const app = createApp({})

app.use(i18n)
app.mount('#app')
