<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import MobileNav from './components/MobileNav.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import SessionsSection from './components/SessionsSection.vue'
import FaqSection from './components/FaqSection.vue'
import ContactSection from './components/ContactSection.vue'

const isNavOpen = ref(false)
</script>

<template>
  <AppHeader v-on:open-nav="isNavOpen = true" />
  <main>
    <HeroSection />
    <AboutSection />
    <SessionsSection />
    <FaqSection />
    <ContactSection />
  </main>
  <AppFooter />

  <MobileNav v-bind:open="isNavOpen" v-on:close="isNavOpen = false" />
</template>
