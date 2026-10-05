<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import MobileNav from './components/MobileNav.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ExhibitorsSection from './components/ExhibitorsSection.vue'
import SessionsSection from './components/SessionsSection.vue'
import FaqSection from './components/FaqSection.vue'
import ContactSection from './components/ContactSection.vue'
import ExhibitorModal from './components/ExhibitorModal.vue'

const isNavOpen = ref(false)
const isExhibitorOpen = ref(false)
</script>

<template>
  <AppHeader v-on:open-nav="isNavOpen = true" v-on:open-exhibitor="isExhibitorOpen = true" />
  <main>
    <HeroSection v-on:open-exhibitor="isExhibitorOpen = true" />
    <AboutSection />
    <ExhibitorsSection />
    <SessionsSection />
    <FaqSection />
    <ContactSection />
  </main>
  <AppFooter />

  <MobileNav
    v-bind:open="isNavOpen"
    v-on:close="isNavOpen = false"
    v-on:open-exhibitor="isExhibitorOpen = true"
  />

  <ExhibitorModal
    v-bind:open="isExhibitorOpen"
    v-on:close="isExhibitorOpen = false"
  ></ExhibitorModal>
</template>
